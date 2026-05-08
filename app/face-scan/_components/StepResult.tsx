"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SecretRecipeResponse } from "@/lib/types";
import type { FaceScanData } from "../page";

interface Props {
  recipe: SecretRecipeResponse;
  formData: FaceScanData;
  sessionId: string;
  basePrice: number;
  onCancel: () => void;
}

function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function StepResult({
  recipe,
  formData,
  sessionId,
  basePrice,
  onCancel,
}: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);

  const sizeExtra = formData.size === "large" ? 10000 : 0;
  const unitPrice = basePrice + sizeExtra;
  const totalPrice = unitPrice * qty;

  function handleOrder() {
    setOrdering(true);
    sessionStorage.setItem(
      "jamoo_face_order",
      JSON.stringify({
        sessionId,
        recipe,
        formData,
        qty,
        unitPrice,
        totalPrice,
      })
    );
    router.push("/face-scan/order-summary");
  }

  return (
    <div className="w-full min-h-screen bg-[#EDEBD2] flex flex-col lg:items-center lg:justify-center lg:py-12">
      {/* Back button */}
      <button onClick={onCancel} className="self-start p-5 lg:hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="#523921"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Main card ── */}
      <div className="w-full max-w-5xl mx-auto lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden flex flex-col lg:flex-row">
        {/* ── Left: image panel ── */}
        <div
          className="relative flex items-center justify-center overflow-hidden
                     h-72 mx-4 rounded-2xl
                     lg:h-auto lg:mx-0 lg:rounded-none lg:w-[45%] lg:min-h-[560px]"
          style={{
            backgroundImage: "url('/background_card.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Desktop back button */}
          <button
            onClick={onCancel}
            className="hidden lg:flex absolute top-5 left-5 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#523921"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative w-48 h-56 lg:w-64 lg:h-72">
            <Image
              src={recipe.image_url ?? "/mascot.svg"}
              alt={recipe.menu_name}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* ── Right: info panel ── */}
        <div className="flex flex-col flex-1 bg-white rounded-t-3xl -mt-4 lg:mt-0 lg:rounded-none">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 lg:px-10 lg:pt-10 flex flex-col gap-5">
            {/* Header */}
            <div>
              <p className="text-xs text-[#9C9070] uppercase tracking-widest font-semibold mb-1">
                {recipe.persona}
              </p>
              <h1 className="text-2xl lg:text-3xl font-black text-[#523921] leading-tight uppercase">
                {recipe.recipe_name}
              </h1>
              <p className="text-sm text-[#9C9070] mt-0.5">
                {recipe.menu_name}
              </p>
            </div>

            <p className="text-sm text-[#5C4033] leading-relaxed border-l-2 border-[#C8D96B] pl-3">
              {recipe.narasi}
            </p>

            {/* Ingredients */}
            <div>
              <p className="text-xs font-black text-[#523921] uppercase tracking-widest mb-3">
                Ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients
                  .split(",")
                  .map((item) => item.replace(/^and\s+/i, "").trim())
                  .filter(Boolean)
                  .map((item, i) => (
                    <span
                      key={i}
                      className="bg-white text-[#523921] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E8E4D0]"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#F5F3E8] rounded-2xl px-5 py-4">
              <p className="text-xs font-black text-[#523921] uppercase tracking-widest mb-2">
                Benefits
              </p>
              <p className="text-sm text-[#5C4033] leading-relaxed">
                {recipe.benefits}
              </p>
            </div>

            <button className="w-full bg-[#EDEBD2] text-[#523921] font-bold py-3 rounded-2xl text-sm tracking-widest hover:bg-[#E0DEC5] transition-colors">
              Share
            </button>
          </div>

          {/* ── Bottom bar ── */}
          <div className="px-6 pb-8 pt-4 border-t border-[#F0EDD8] lg:px-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9C9070]">Total</p>
                <span className="text-2xl font-black text-[#523921]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-4 bg-[#F5F3E8] rounded-2xl px-5 py-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-[#523921] font-bold text-xl w-6 text-center leading-none"
                >
                  −
                </button>
                <span className="text-[#523921] font-bold text-lg w-5 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="text-[#523921] font-bold text-xl w-6 text-center leading-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 border-2 border-[#523921] text-[#523921] font-bold py-4 rounded-2xl tracking-widest text-sm hover:bg-[#523921]/5 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleOrder}
                disabled={ordering}
                className="flex-1 bg-[#4A5820] disabled:opacity-60 text-white font-bold py-4 rounded-2xl tracking-widest text-sm hover:bg-[#3a4518] transition-colors"
              >
                {ordering ? "..." : "ORDER NOW"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
