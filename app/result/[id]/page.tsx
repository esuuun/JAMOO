import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { SecretRecipeResponse } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharedResultPage({ params }: Props) {
  const { id } = await params;

  const { data: session } = await supabase
    .from("sessions")
    .select("ai_response, detected_mood, created_at")
    .eq("id", id)
    .eq("order_source", "face")
    .single();

  if (!session?.ai_response) notFound();

  const recipe = session.ai_response as SecretRecipeResponse;

  return (
    <div className="min-h-screen bg-[#EDEBD2] flex flex-col lg:items-center lg:justify-center lg:py-12">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 lg:pt-0 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/jamoo_logo.svg" alt="JAMOO" width={150} height={98} className="object-contain" />
        </Link>
        <span className="text-xs text-[#9C9070] font-semibold tracking-widest uppercase">
          Secret Recipe
        </span>
      </div>

      {/* Main card */}
      <div className="w-full max-w-5xl mx-auto lg:bg-white lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden flex flex-col lg:flex-row">
        {/* Left: image panel */}
        <div
          className="relative flex items-center justify-center overflow-hidden
                     h-72 mx-4 rounded-2xl
                     lg:h-auto lg:mx-0 lg:rounded-none lg:w-[45%] lg:min-h-[520px]"
          style={{
            backgroundImage: "url('/background_card.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative w-48 h-56 lg:w-64 lg:h-72">
            <Image
              src={recipe.image_url ?? "/mascot.svg"}
              alt={recipe.menu_name}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Right: info panel */}
        <div className="flex flex-col flex-1 bg-white rounded-t-3xl -mt-4 lg:mt-0 lg:rounded-none">
          <div className="flex-1 px-6 pt-6 pb-8 lg:px-10 lg:pt-10 flex flex-col gap-5">
            {/* Header */}
            <div>
              <p className="text-xs text-[#9C9070] uppercase tracking-widest font-semibold mb-1">
                {recipe.persona}
              </p>
              <h1 className="text-2xl lg:text-3xl font-black text-[#523921] leading-tight uppercase">
                {recipe.recipe_name}
              </h1>
              <p className="text-sm text-[#9C9070] mt-0.5">{recipe.menu_name}</p>
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
              <p className="text-sm text-[#5C4033] leading-relaxed">{recipe.benefits}</p>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col gap-3">
              <p className="text-center text-xs text-[#9C9070]">
                Want your own personalized JAMOO recipe?
              </p>
              <Link
                href="/face-scan"
                className="w-full bg-[#4A5820] text-white font-bold py-4 rounded-2xl tracking-widest text-sm text-center hover:bg-[#3a4518] transition-colors"
              >
                TRY FACE SCAN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
