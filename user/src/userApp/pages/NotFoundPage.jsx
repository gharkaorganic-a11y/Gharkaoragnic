import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Ghar Ka Organic</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-[75vh] flex flex-col items-center justify-center bg-white px-4 py-20 text-center font-sans">
        <p className="text-sm sm:text-base font-light text-neutral-500 tracking-wider mb-5 sm:mb-6">
          404
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#121212] tracking-tight mb-8 sm:mb-10">
          Page not found
        </h1>

        <Link
          to="/all-products"
          className="inline-block bg-[#121212] hover:bg-black text-white text-[14px] sm:text-[15px] font-medium px-8 py-3.5 sm:px-10 sm:py-4 transition-all duration-200 active:scale-95 shadow-sm">
          Continue shopping
        </Link>
      </main>
    </>
  );
};

export default NotFoundPage;
