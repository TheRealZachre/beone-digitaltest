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
      <div className="text-center">
        <Image
          src={BRAND_ASSETS.beoneLogoWhite}
          alt="BeOne"
          width={180}
          height={40}
          className="mx-auto h-auto w-full max-w-[12rem]"
          priority
        />
        {showTagline && (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
            {PLATFORM_TAGLINE}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Image
        src={BRAND_ASSETS.beoneLogoWhite}
        alt="BeOne"
        width={180}
        height={40}
        className="h-8 w-auto max-w-[11.5rem]"
        priority
      />
      {showTagline && (
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-muted">
          {PLATFORM_TAGLINE}
        </p>
      )}
    </div>
  );
}
