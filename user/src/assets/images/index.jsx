// ==========================================
// 2. REMOTE ASSETS (CONSTANTS)
// ==========================================

// --- Logos ---
const GOOGLE_ICON_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA7VBMVEVHcEz/RkL/R0D+SEr/RUD/RkOwjlb/SD7/SE3/SUj/Vzb/VDf9TFb8TVeHoFb/YTD/byn8TVn/jRr/fSL/mxL/SEj+yQn/ohH/tQv+VUb/vQn/wwn+zgj9wQm3xQ39zgT6zQYwhv/7zgowhv8uhv0ek+Avhv7yzAPjywIvhv0whv7PyQHUygIth/y3yAEnivSlxwGSxgUak94fj+h5xAlgwxMLqp8NnsQVlte6xwBNwh45wC0xwDMLt28IrJgJpa0kjPCaxQEpvzsevkkWvVANumQQu18JtXkIsIgTvVYOvGALuWtJwh4OvF8OvF9ccfxCAAAAT3RSTlMAUZvT7P8T//+wiv//kAv6/mD//+V2jv//JKf//0EmxOr/rP7+MEX//x10/6eu//3+/9v///7I//+K//+KS/3/YeX//7dsnv7/////5s3tMAqBMAAAAXFJREFUeAF0jUUCwCAMwDp3d/f9/4krnVt6goQCFzheECVJFHgOPpB5RZHYIKqqyU+vGwpCXkVM07pp2zEQ8hSYiCBf1rsuFrQCvaSahHe+9wMqWHJuOD2E/lYoWsRxkUbBxcdJshY6bEQ3L6fpWmTnXXbxkBcpJTb8UBZFgUX156uyLLHI4Y+YgqL+DZqS0R7n7o4NLQX9GQwbI5tugpKI7wF5Rjd/BiNCCQZfX5BfCwyWrsnagGEYiKKpMkLqgJmZmXn/caKTzGoM7+v4IEiWPQdJ4fMhFujHCzjH7Wny6xFwMB9UKBa4KN3Tl4kh9AZYVJRbpXhVVRGX0asEXNP1a7MM0wQJA+0WFcQtyz7bcFzPAwn+8AkPwmjDcZK6WJGR75zwsCirOo7rpu0SojC2oQUeIF72/TCMY4sUKSj2wX9iXgAHwYgEoKBPizOBgx4EhwnCtxOtDnYTzn1Gnw3wzYQT3zDJrpmXYVjmpj7d/gPknlJE6eZSewAAAABJRU5ErkJggg==";

// --- Auth Banners ---
const AUTH_BANNERS = {
  login: "https://images.meesho.com/images/marketing/1744698265981.webp",
  signup: "https://images.meesho.com/images/marketing/1744698265981.webp",
  offer:
    "https://www.biba.in/on/demandware.static/-/Library-Sites-BibaSharedLibrary/en_IN/dw166ba4ee/login-sept19.jpg",
};

// --- Hero Slides (Desktop) ---
const HERO_SLIDES_DESKTOP = [
  "/banner/pahadiseid.png",
  "/banner/himlayanbanner.png",
  "/banner/pahadipickle.png",
  "/banner/natural.png",
  "/Gemini_Generated_Image_rxn6avrxn6avrxn6.png",
];

// --- Hero Slides (Mobile) ---
const HERO_SLIDES_MOBILE = [
  "/banner/pahadiseid.png",
  "/banner/himlayanbanner.png",
  "/banner/pahadipickle.png",
  "/banner/natural.png",
];

// ==========================================
// 5. MAIN EXPORT
// ==========================================
const appLogo = "/logo/gharka-logo-mobile.png";
export const IMAGES = {
  /**
   * Brand Identity & Logos
   */
  brand: {
    logo: appLogo,
    googleIcon: GOOGLE_ICON_BASE64,
  },

  /**
   * Authentication Screens (Login/Signup)
   */
  auth: {
    loginBanner: AUTH_BANNERS.login,
    signupBanner: AUTH_BANNERS.signup,
    signupOfferBanner: AUTH_BANNERS.offer,
  },

  /**
   * Homepage Hero Section
   */
  hero: {
    desktopSlides: HERO_SLIDES_DESKTOP,
    mobileSlides: HERO_SLIDES_MOBILE,
  },
};
