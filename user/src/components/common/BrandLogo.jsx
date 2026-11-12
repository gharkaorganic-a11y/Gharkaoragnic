import React from "react";
import { Link } from "react-router-dom";

export const BRAND_SYMBOL_SRC = "/logo/gharka-logo-symbol.png";
export const BRAND_FULL_SRC = "/logo/gharka-logo-full.png";

const STACKED_PRESETS = {
  sm: {
    symbol: "h-[19px] w-[57px] -mb-[2px]",
    title:
      "font-serif text-[15px] font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#54270D]",
    taglineRow: "mt-[1.5px] flex items-center justify-center gap-1",
    rule: "h-[1.5px] w-1.5 rounded-full bg-[#168A35] shrink-0",
    tagline:
      "font-sans text-[5.25px] font-bold uppercase leading-none tracking-[0.08em] text-[#3D1D0B] whitespace-nowrap",
  },
  md: {
    symbol: "h-[24px] w-[72px] -mb-[3px]",
    title:
      "font-serif text-[18px] sm:text-[19px] font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#54270D]",
    taglineRow: "mt-[2px] flex items-center justify-center gap-1.5",
    rule: "h-[1.5px] w-2 rounded-full bg-[#168A35] shrink-0",
    tagline:
      "font-sans text-[6px] sm:text-[6.5px] font-bold uppercase leading-none tracking-[0.11em] text-[#3D1D0B] whitespace-nowrap",
  },
  lg: {
    symbol: "h-[34px] w-[102px] -mb-[4px]",
    title:
      "font-serif text-[26px] sm:text-[28px] font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#54270D]",
    taglineRow: "mt-[3px] flex items-center justify-center gap-2",
    rule: "h-[2px] w-3 rounded-full bg-[#168A35] shrink-0",
    tagline:
      "font-sans text-[8px] sm:text-[9px] font-bold uppercase leading-none tracking-[0.13em] text-[#3D1D0B] whitespace-nowrap",
  },
};

const HORIZONTAL_PRESETS = {
  sm: {
    wrapper: "inline-flex items-center gap-2",
    symbol: "h-[20px] w-[60px] shrink-0",
    title:
      "font-serif text-[15px] font-black uppercase leading-none tracking-[-0.02em] text-[#54270D]",
    tagline:
      "mt-[2px] font-sans text-[5.5px] font-bold uppercase leading-none tracking-[0.09em] text-[#168A35] whitespace-nowrap",
  },
  md: {
    wrapper: "inline-flex items-center gap-2.5",
    symbol: "h-[24px] w-[72px] shrink-0",
    title:
      "font-serif text-[17px] sm:text-[18px] font-black uppercase leading-none tracking-[-0.02em] text-[#54270D]",
    tagline:
      "mt-[3px] font-sans text-[6.5px] font-bold uppercase leading-none tracking-[0.11em] text-[#168A35] whitespace-nowrap",
  },
  lg: {
    wrapper: "inline-flex items-center gap-3",
    symbol: "h-[30px] w-[90px] shrink-0",
    title:
      "font-serif text-[22px] font-black uppercase leading-none tracking-[-0.02em] text-[#54270D]",
    tagline:
      "mt-[3px] font-sans text-[8px] font-bold uppercase leading-none tracking-[0.12em] text-[#168A35] whitespace-nowrap",
  },
};

const BrandLogo = ({
  variant = "default",
  size = "md",
  showTagline = true,
  symbolOnly = false,
  clickable = false,
  to = null,
  onClick,
  ariaLabel = "Ghar Ka Organic - Go to homepage",
  fetchPriority = "auto",
  className = "",
  symbolClassName = "",
}) => {
  const effectiveSize = variant === "compact" && size === "md" ? "sm" : size;
  const targetTo = to ?? (clickable ? "/" : null);
  const isInteractiveLink = typeof targetTo === "string" && targetTo.length > 0;

  const stacked = STACKED_PRESETS[effectiveSize] || STACKED_PRESETS.md;
  const horizontal = HORIZONTAL_PRESETS[effectiveSize] || HORIZONTAL_PRESETS.md;

  const symbolAlt = symbolOnly && !isInteractiveLink ? "Ghar Ka Organic" : "";

  const renderSymbol = (baseClasses) => (
    <img
      src={BRAND_SYMBOL_SRC}
      alt={symbolAlt}
      aria-hidden={symbolAlt === "" ? "true" : undefined}
      width={2172}
      height={724}
      decoding="async"
      fetchPriority={fetchPriority}
      className={`object-contain select-none ${baseClasses} ${symbolClassName}`.trim()}
    />
  );

  let content;

  if (symbolOnly) {
    const baseSize =
      variant === "compact" || effectiveSize === "sm"
        ? "h-[20px] w-[60px]"
        : effectiveSize === "lg"
          ? "h-[36px] w-[108px]"
          : "h-[26px] w-[78px]";

    content = renderSymbol(baseSize);
  } else if (variant === "horizontal") {
    content = (
      <>
        {renderSymbol(horizontal.symbol)}
        <span className="flex flex-col items-start justify-center leading-none">
          <span className={horizontal.title}>GHAR KA</span>
          {showTagline && (
            <span className={horizontal.tagline}>GHAR KA, GHAR SE, GHAR TK</span>
          )}
        </span>
      </>
    );
  } else {
    content = (
      <>
        {renderSymbol(stacked.symbol)}
        <span className={stacked.title}>GHAR KA</span>
        {showTagline && (
          <span className={stacked.taglineRow}>
            <span aria-hidden="true" className={stacked.rule} />
            <span className={stacked.tagline}>GHAR KA, GHAR SE, GHAR TK</span>
            <span aria-hidden="true" className={stacked.rule} />
          </span>
        )}
      </>
    );
  }

  const baseLayoutClass =
    variant === "horizontal" && !symbolOnly
      ? `${horizontal.wrapper} select-none`
      : "inline-flex flex-col items-center justify-center leading-none select-none";

  const combinedClass = `${baseLayoutClass} ${className}`.trim();

  if (isInteractiveLink) {
    return (
      <Link
        to={targetTo}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${combinedClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99A36] rounded-md transition-opacity hover:opacity-95`}>
        {content}
      </Link>
    );
  }

  return (
    <span className={combinedClass}>
      {content}
    </span>
  );
};

export default React.memo(BrandLogo);
