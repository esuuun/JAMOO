'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

export interface EmotionResult {
  dominantEmotion: string
  confidenceScore: number
  allExpressions: Record<string, number>
  age: number
  gender: string
  genderProbability: number
}

interface UseFaceDetectionReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  modelsLoaded: boolean
  cameraActive: boolean
  isScanning: boolean
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  scanEmotion: () => Promise<EmotionResult | null>
}

export function useFaceDetection(): UseFaceDetectionReturn {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [isScanning, setIsScanning]     = useState(false)
  const [error, setError]               = useState<string | null>(null)

  // ── Load models sekali saat hook dipanggil ────────────
  useEffect(() => {
    async function loadModels() {
      try {
        const faceapi = await import('face-api.js')
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          faceapi.nets.ageGenderNet.loadFromUri('/models'),
        ])
        setModelsLoaded(true)
      } catch (err) {
        console.error('[useFaceDetection] Failed to load models:', err)
        setError(
          'Gagal load model face-api.js. ' +
          'Pastikan folder /public/models sudah berisi file model.'
        )
      }
    }
    loadModels()
  }, [])

  // ── Cleanup kamera saat komponen unmount ──────────────
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // ── Start kamera ──────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      if (videoRef.current) videoRef.current.srcObject = stream
      streamRef.current = stream
      setCameraActive(true)
    } catch (err) {
      console.error('[useFaceDetection] Camera error:', err)
      setError('Tidak bisa akses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }, [])

  // ── Stop kamera ───────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  }, [])

  // ── Scan emotion dari frame video saat ini ────────────
  // Return EmotionResult atau null jika wajah tidak terdeteksi
  const scanEmotion = useCallback(async (): Promise<EmotionResult | null> => {
    if (!videoRef.current || !modelsLoaded) return null

    setIsScanning(true)
    setError(null)

    try {
      const faceapi = await import('face-api.js')

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions()
        .withAgeAndGender()

      if (!detection) {
        setError('Wajah tidak terdeteksi. Pastikan wajah terlihat jelas dan ruangan cukup terang.')
        return null
      }

      const expressions = detection.expressions as unknown as Record<string, number>

      const [dominantEmotion, confidenceScore] = Object.entries(expressions)
        .sort(([, a], [, b]) => b - a)[0]

      return {
        dominantEmotion,
        confidenceScore,
        allExpressions: expressions,
        age:               Math.round(detection.age),
        gender:            detection.gender,
        genderProbability: detection.genderProbability,
      }
    } catch (err) {
      console.error('[useFaceDetection] Scan error:', err)
      setError('Gagal scan ekspresi. Coba lagi.')
      return null
    } finally {
      setIsScanning(false)
    }
  }, [modelsLoaded])

  return {
    videoRef,
    modelsLoaded,
    cameraActive,
    isScanning,
    error,
    startCamera,
    stopCamera,
    scanEmotion,
  }
}
