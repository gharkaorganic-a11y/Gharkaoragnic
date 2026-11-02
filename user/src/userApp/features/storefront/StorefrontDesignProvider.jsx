import { createContext, useContext, useMemo } from "react";

const SANS_FONT_STACK =
  '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const DEFAULT_DESIGN = {
  bodyFont: SANS_FONT_STACK,
  headingFont: SANS_FONT_STACK,
  baseFontSize: 16,
  headingColor: "#263329",
  textColor: "#263329",
  mutedTextColor: "#687267",
  priceColor: "#263329",
  reviewColor: "#687267",
  starColor: "#f5a623",
  buttonColor: "#009f68",
  buttonTextColor: "#ffffff",
  categoryColor: "#009f68",
  announcementColor: "#009762",
};

const StorefrontDesignContext = createContext(DEFAULT_DESIGN);

export const StorefrontDesignProvider = ({ children }) => {
  const cssVariables = useMemo(
    () => ({
      "--storefront-body-font": DEFAULT_DESIGN.bodyFont,
      "--storefront-heading-font": DEFAULT_DESIGN.headingFont,
      "--storefront-base-font-size": `${DEFAULT_DESIGN.baseFontSize}px`,
      "--storefront-heading-color": DEFAULT_DESIGN.headingColor,
      "--storefront-text-color": DEFAULT_DESIGN.textColor,
      "--storefront-muted-color": DEFAULT_DESIGN.mutedTextColor,
      "--storefront-price-color": DEFAULT_DESIGN.priceColor,
      "--storefront-review-color": DEFAULT_DESIGN.reviewColor,
      "--storefront-star-color": DEFAULT_DESIGN.starColor,
      "--storefront-button-color": DEFAULT_DESIGN.buttonColor,
      "--storefront-button-text-color": DEFAULT_DESIGN.buttonTextColor,
      "--storefront-category-color": DEFAULT_DESIGN.categoryColor,
      "--storefront-announcement-color": DEFAULT_DESIGN.announcementColor,
    }),
    [],
  );

  return (
    <StorefrontDesignContext.Provider value={DEFAULT_DESIGN}>
      <div className="storefront-root" style={cssVariables}>
        {children}
      </div>
    </StorefrontDesignContext.Provider>
  );
};

export const useStorefrontDesign = () => useContext(StorefrontDesignContext);
