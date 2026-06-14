import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/brand";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

interface BrandLogoProps {
  variant?: "sidebar" | "compact" | "full";
  showTagline?: boolean;
}

export function BrandLogo({
  variant = "sidebar",
  showTagline = true,
}: BrandLogoProps) {
  if (variant === "compact") {
    return (
      <Image
        src={BRAND_ASSETS.iconDark}
        alt={PLATFORM_NAME}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
        priority
      />
    );
  }

  if (variant === "full") {
    return (
      <Image
        src={BRAND_ASSETS.logoPrimarySpectrumPng}
        alt={PLATFORM_NAME}
        width={640}
        height={160}
        className="h-auto w-full max-w-xl"
        priority
      />
    );
  }

  return (
    <div className="min-w-0">
      <Image
        src={BRAND_ASSETS.wordmarkWhite}
        alt={PLATFORM_NAME}
        width={220}
        height={36}
        className="h-7 w-auto max-w-[11.5rem]"
        priority
      />
      {showTagline && (
        <p className="mt-1.5 text-[11px] font-medium tracking-wide text-brand-muted">
          {PLATFORM_TAGLINE}
        </p>
      )}
    </div>
  );
}
