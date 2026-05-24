import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/auth/login`;

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": CANONICAL,
      url: CANONICAL,
      name: "Login | Ghar Ka Organic",
      description:
        "Login to Ghar Ka Organic for premium Uttarakhand organic products including Himalayan pickles, A2 bilona ghee and raw honey.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
    },

    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Ghar Ka Organic",
      url: BASE_URL,
      logo: `${BASE_URL}/gharka-logo.png`,
      sameAs: ["https://www.instagram.com/gharkaorganic/"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bhimtal",
        addressRegion: "Uttarakhand",
        addressCountry: "IN",
      },
    },

    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Login",
          item: CANONICAL,
        },
      ],
    },
  ],
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, googleLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email) return setError("Please enter your email address.");

    if (!form.password) return setError("Please enter your password.");

    setLoading(true);

    try {
      const result = await loginUser(form.email, form.password);

      if (!result?.emailVerified) {
        navigate("/help/email-verification");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setSocialLoading(true);
      await googleLogin();
      navigate("/");
    } catch (err) {
      setError(err?.message || "Google login failed.");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        {/* SEO */}
        <title>Login | Ghar Ka Organic – Himalayan Organic Food Brand</title>

        <meta
          name="description"
          content="Login to Ghar Ka Organic and explore handmade Himalayan pickles, raw forest honey, A2 bilona ghee and authentic Uttarakhand organic food."
        />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ghar Ka Organic" />
        <meta name="language" content="English" />

        <link rel="canonical" href={CANONICAL} />

        {/* OG */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Login | Ghar Ka Organic" />
        <meta
          property="og:description"
          content="Access your Ghar Ka Organic account for premium Uttarakhand organic products."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Ghar Ka Organic" />

        {/* JSON LD */}
        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      <div className="bg-white min-h-screen text-[#4a4a4a] font-sans">
        {/* HERO IMAGE */}

        {/* LOGIN SECTION */}
        <section className="max-w-[32rem] mx-auto px-6 py-20">
          {/* Intro */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#333] mb-5">
              Login To Your Account
            </h2>

            <p className="text-[15px] leading-[2] text-[#666] font-light">
              Continue your journey with authentic Himalayan organic food
              crafted traditionally in Bhimtal, Uttarakhand.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 border border-red-200 bg-red-50 text-red-600 text-center text-sm py-4 px-5">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* EMAIL */}
            <div>
              <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] tracking-[2px] text-[#777] hover:text-black transition">
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-[13px] tracking-wide text-[#666] hover:text-black transition">
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[58px] bg-[#222] hover:bg-black text-white uppercase tracking-[3px] text-[13px] transition-all">
              {loading ? "PLEASE WAIT..." : "LOGIN"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-14">
            <div className="border-t border-gray-200"></div>

            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 text-[11px] tracking-[3px] text-gray-400 uppercase">
              Or Continue With
            </span>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={socialLoading}
            className="w-full h-[58px] border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-4">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Login"
              className="w-5 h-5"
            />

            <span className="uppercase tracking-[2px] text-[13px]">
              Continue With Google
            </span>
          </button>

          {/* SIGNUP */}
          <div className="text-center mt-14">
            <p className="text-[15px] text-[#666] font-light">
              Don’t have an account?
            </p>

            <Link
              to="/auth/signup"
              className="inline-block mt-3 text-[13px] uppercase tracking-[3px] text-[#222] hover:underline">
              Create Account
            </Link>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="max-w-[52rem] mx-auto px-6 pb-20 text-center space-y-10">
          <p className="text-[15px] leading-[2.2] text-[#666] font-light">
            Ghar Ka Organic is an Uttarakhand based Himalayan organic food brand
            bringing traditional Indian food heritage directly from villages to
            homes across India.
          </p>

          <p className="text-[15px] leading-[2.2] text-[#666] font-light">
            Discover authentic handmade pahadi pickles, A2 bilona ghee,
            Himalayan spices and raw forest honey prepared using traditional
            methods without chemicals or preservatives.
          </p>

          {/* Internal SEO Link */}
          <div className="pt-4">
            <a
              href="/all-products"
              className="text-sm underline text-gray-700 hover:text-black">
              Explore Organic Products →
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
