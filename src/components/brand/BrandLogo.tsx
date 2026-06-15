import { BRAND_ASSETS } from "@/lib/brand";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

interface BrandLogoProps {
  variant?: "sidebar" | "compact" | "full";
  showTagline?: boolean;
}

function BrandAsset({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} className={className} />;
}

export function BrandLogo({
  variant = "sidebar",
  showTagline = true,
}: BrandLogoProps) {
  const vibeCodeFlowWordmark = (
    <BrandAsset
      src={BRAND_ASSETS.wordmarkWhite}
      alt="Vibe. Code. Flow."
      className={
        variant === "full"
          ? "mx-auto mt-3 h-7 w-auto max-w-[12rem]"
          : "mt-2.5 h-7 w-auto max-w-[12rem]"
      }
    />
  );

  if (variant === "compact") {
    return (
      <BrandAsset
        src={BRAND_ASSETS.iconDark}
        alt={PLATFORM_NAME}
        className="h-9 w-9 shrink-0"
      />
    );
  }

  if (variant === "full") {
    return (
      <div className="text-center">
        <BrandAsset
          src={BRAND_ASSETS.beoneLogoWhite}
          alt="BeOne"
          className="mx-auto h-auto w-full max-w-[12rem]"
        />
        {showTagline && (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
            {PLATFORM_TAGLINE}
          </p>
        )}
        {vibeCodeFlowWordmark}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <BrandAsset
        src={BRAND_ASSETS.beoneLogoWhite}
        alt="BeOne"
        className="h-8 w-auto max-w-[11.5rem]"
      />
      {showTagline && (
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-muted">
          {PLATFORM_TAGLINE}
        </p>
      )}
      {vibeCodeFlowWordmark}
    </div>
  );
}
