"use client";

import { useEffect } from "react";
import { useFaceDetection, type EmotionResult } from "@/hooks/useFaceDetection";
import { LoaderCircle } from "lucide-react";

interface Props {
  onScanned: (result: EmotionResult) => void;
}

export default function StepCamera({ onScanned }: Props) {
  const {
    videoRef,
    modelsLoaded,
    cameraActive,
    isScanning,
    error,
    startCamera,
    stopCamera,
    scanEmotion,
  } = useFaceDetection();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  async function handleCapture() {
    const result = await scanEmotion();
    if (result) onScanned(result);
  }

  return (
    <div className="w-full min-h-screen bg-[#EDEBD2] flex flex-col lg:flex-row lg:items-stretch">

      {/* ── Left: viewfinder panel ── */}
      <div className="flex flex-col items-center justify-center px-4 pt-8 pb-4 lg:w-[55%] lg:min-h-screen lg:px-10 lg:py-0 gap-4 lg:gap-6">
        {/* Viewfinder */}
        <div
          className="relative bg-black rounded-3xl overflow-hidden shadow-2xl"
          style={{ width: '100%', maxWidth: 380, aspectRatio: '3/4' }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />

          {/* Face guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="border-[3px] border-[#C8D96B] rounded-sm w-44 h-52 lg:w-52 lg:h-60" />
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C8D96B] rounded-tl pointer-events-none z-10" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C8D96B] rounded-tr pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C8D96B] rounded-bl pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C8D96B] rounded-br pointer-events-none z-10" />

          {/* Loading overlays */}
          {(!modelsLoaded || isScanning) && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 gap-3">
              <LoaderCircle className="animate-spin text-white" size={48} />
              <p className="text-white text-sm font-semibold">
                {!modelsLoaded ? 'Loading AI models...' : 'Analyzing...'}
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center bg-white rounded-xl px-4 py-2 w-full max-w-sm">
            {error}
          </p>
        )}

        {/* Capture button — visible on mobile only */}
        <button
          onClick={handleCapture}
          disabled={!modelsLoaded || !cameraActive || isScanning}
          className="lg:hidden w-16 h-16 rounded-full border-4 border-[#4A5820] bg-white disabled:opacity-40 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Scan expression"
        >
          <div className="w-10 h-10 rounded-full bg-[#4A5820]" />
        </button>
      </div>

      {/* ── Right: instructions panel (desktop) ── */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 lg:mt-0 lg:rounded-none lg:rounded-l-3xl px-6 pt-8 pb-10 flex flex-col gap-6 lg:px-12 lg:py-16 lg:justify-center lg:shadow-2xl">

        <div>
          <p className="text-xs text-[#9C9070] uppercase tracking-widest font-semibold mb-1">Step 3 of 3</p>
          <h2 className="text-2xl lg:text-3xl font-black text-[#2D1A10] leading-tight">FACE SCAN</h2>
          <p className="text-sm lg:text-base text-[#9C9070] mt-1">Let the AI read your vibe</p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { step: '01', text: 'Position your face inside the green guide box' },
            { step: '02', text: 'Make sure you\'re in a well-lit area' },
            { step: '03', text: 'Keep a natural expression — just be yourself!' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4 bg-[#F5F3E8] rounded-2xl px-5 py-4">
              <span className="text-xs font-black text-[#4A5820] bg-[#C8D96B] rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center">{item.step}</span>
              <p className="text-sm lg:text-base text-[#5C4033]">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${modelsLoaded && cameraActive ? 'bg-[#4A5820] animate-pulse' : 'bg-[#9C9070]'}`} />
          <p className="text-sm text-[#9C9070]">
            {!modelsLoaded ? 'Loading AI models…' : cameraActive ? 'Camera ready' : 'Starting camera…'}
          </p>
        </div>

        <div className="flex-1 lg:hidden" />

        {/* Capture button — desktop */}
        <button
          onClick={handleCapture}
          disabled={!modelsLoaded || !cameraActive || isScanning}
          className="hidden lg:flex w-full bg-[#4A5820] disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-base tracking-widest hover:bg-[#3a4518] transition-colors items-center justify-center gap-2"
          aria-label="Scan expression"
        >
          {isScanning ? (
            <>
              <LoaderCircle className="animate-spin" size={18} />
              SCANNING...
            </>
          ) : (
            'SCAN NOW'
          )}
        </button>
      </div>
    </div>
  );
}
