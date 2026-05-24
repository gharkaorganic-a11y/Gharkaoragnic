import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/UserContext";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/auth/signup`;

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": CANONICAL,
      url: CANONICAL,
      name: "Create Account | Ghar Ka Organic",
      description:
        "Create your Ghar Ka Organic account and discover authentic Himalayan organic food from Uttarakhand.",
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
          name: "Signup",
          item: CANONICAL,
        },
      ],
    },
  ],
});

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupUser, googleLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;

    if (step === 3) {
      timer = setTimeout(() => {
        navigate("/help/email-verification");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [step, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (!form.email) {
      return setError("Please enter your email address.");
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return setError("Please enter your full name.");
    }

    if (!form.dateOfBirth) {
      return setError("Please enter your date of birth.");
    }

    if (!form.gender) {
      return setError("Please select your gender.");
    }

    if (!form.password || form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    const dob = new Date(form.dateOfBirth);

    const age = Math.floor((Date.now() - dob) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 13) {
      return setError("You must be at least 13 years old.");
    }

    try {
      setLoading(true);

      await signupUser({
        email: form.email,
        password: form.password,
        name: form.name,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
      });

      setStep(3);
    } catch (err) {
      setError(err?.message || "Failed to create account.");
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
      setError(err?.message || "Google signup failed.");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Ghar Ka Organic – Himalayan Organic Food</title>

        <meta
          name="description"
          content="Create your Ghar Ka Organic account to explore authentic Himalayan pickles, A2 bilona ghee, raw honey and organic Uttarakhand food."
        />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ghar Ka Organic" />
        <meta name="language" content="English" />

        <link rel="canonical" href={CANONICAL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Create Account | Ghar Ka Organic" />
        <meta
          property="og:description"
          content="Join Ghar Ka Organic and discover traditional Himalayan organic food from Uttarakhand."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Ghar Ka Organic" />

        {/* JSON LD */}
        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      <div className="bg-white min-h-screen font-sans text-[#4a4a4a]">
        {/* CONTENT */}
        <section className="max-w-[34rem] mx-auto px-6 py-20">
          {/* Back */}
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="mb-10 text-[12px] uppercase tracking-[3px] text-[#777] hover:text-black transition">
              ← Back
            </button>
          )}

          {/* Intro */}
          {step !== 3 && (
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#333] mb-5">
                {step === 1 ? "Start Your Journey" : "Complete Your Profile"}
              </h2>

              <p className="text-[15px] leading-[2] text-[#666] font-light">
                Join Ghar Ka Organic and explore authentic Himalayan organic
                products crafted traditionally in Uttarakhand.
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-10 border border-red-200 bg-red-50 text-red-600 text-center text-sm py-4 px-5">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <form onSubmit={handleNextStep} className="space-y-10">
                {/* Email */}
                <div>
                  <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Continue */}
                <button
                  type="submit"
                  className="w-full h-[58px] bg-[#222] hover:bg-black text-white uppercase tracking-[3px] text-[13px] transition-all">
                  Continue
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-14">
                <div className="border-t border-gray-200"></div>

                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 text-[11px] tracking-[3px] text-gray-400 uppercase">
                  Or Continue With
                </span>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={socialLoading}
                className="w-full h-[58px] border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-4">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google Signup"
                  className="w-5 h-5"
                />

                <span className="uppercase tracking-[2px] text-[13px]">
                  Continue With Google
                </span>
              </button>

              {/* Login */}
              <div className="text-center mt-14">
                <p className="text-[15px] text-[#666] font-light">
                  Already have an account?
                </p>

                <Link
                  to="/auth/login"
                  className="inline-block mt-3 text-[13px] uppercase tracking-[3px] text-[#222] hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Name */}
              <div>
                <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all placeholder:text-gray-400"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                  Date Of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  max={
                    new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                  Gender
                </label>

                <select
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-[13px] uppercase tracking-[2px] text-[#777] mb-4">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full border-b border-gray-300 bg-transparent h-[55px] text-[15px] outline-none focus:border-[#222] transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[58px] bg-[#222] hover:bg-black text-white uppercase tracking-[3px] text-[13px] transition-all">
                {loading ? "PLEASE WAIT..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center py-10">
              <div className="w-24 h-24 border border-[#d9d9d9] rounded-full mx-auto flex items-center justify-center mb-10">
                <svg
                  className="w-10 h-10 text-[#222]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#333] mb-6">
                Account Created
              </h2>

              <p className="text-[15px] leading-[2] text-[#666] font-light max-w-md mx-auto">
                Please verify your email address to activate your Ghar Ka
                Organic account.
              </p>

              <p className="mt-6 text-[14px] tracking-wide text-[#222]">
                Verification email sent to:
              </p>

              <p className="mt-2 text-[15px] font-medium text-[#111]">
                {form.email}
              </p>

              <p className="mt-10 text-[12px] uppercase tracking-[3px] text-[#999] animate-pulse">
                Redirecting...
              </p>

              <button
                onClick={() => navigate("/help/email-verification")}
                className="mt-12 border border-[#222] hover:bg-[#222] hover:text-white transition-all px-10 h-[55px] text-[12px] uppercase tracking-[3px]">
                Go To Verification Page
              </button>
            </div>
          )}
        </section>

        {/* SEO CONTENT */}
        <section className="max-w-[52rem] mx-auto px-6 pb-20 text-center space-y-10">
          <p className="text-[15px] leading-[2.2] text-[#666] font-light">
            Ghar Ka Organic brings authentic Himalayan organic food directly
            from Uttarakhand villages using traditional preparation methods
            without preservatives or chemicals.
          </p>

          <p className="text-[15px] leading-[2.2] text-[#666] font-light">
            Explore handmade pahadi pickles, A2 bilona ghee, Himalayan spices,
            raw forest honey and farm fresh products sourced naturally from
            Bhimtal and nearby regions.
          </p>

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
