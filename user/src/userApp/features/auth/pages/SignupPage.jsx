import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/UserContext";

const BASE_URL = "https://gharkaorganic.com";

const CANONICAL = `${BASE_URL}/auth/signup`;

const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";

/* ─────────────────────────────────────────────
   VALID JSON-LD
───────────────────────────────────────────── */

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",

      "@id": CANONICAL,

      url: CANONICAL,

      name: "Create Account | Ghar Ka Organic",

      description:
        "Create your account on Ghar Ka Organic and discover Himalayan organic food products including raw honey, A2 bilona ghee and homemade pickles.",

      inLanguage: "en-IN",

      isPartOf: {
        "@type": "WebSite",

        "@id": `${BASE_URL}/#website`,

        name: "Ghar Ka Organic",

        url: BASE_URL,
      },
    },

    {
      "@type": "Organization",

      "@id": `${BASE_URL}/#organization`,

      name: "Ghar Ka Organic",

      url: BASE_URL,

      logo: `${BASE_URL}/gharka-logo.png`,

      image: OG_IMAGE,

      email: "gharkaorganic@gmail.com",

      telephone: "+91 7983990550",

      sameAs: ["https://www.instagram.com/gharkaorganic/"],

      address: {
        "@type": "PostalAddress",

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
      return setError("Please enter your email.");
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return setError("Please enter your full name.");
    }

    if (!form.password || form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
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
      setError(err?.message || "Signup failed.");
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
        {/* PRIMARY SEO */}

        <title>Create Account | Ghar Ka Organic – Himalayan Organic Food</title>

        <meta
          name="description"
          content="Create your Ghar Ka Organic account and discover authentic Himalayan pickles, raw honey, bilona ghee and traditional organic food from Uttarakhand."
        />

        <meta
          name="keywords"
          content="signup Ghar Ka Organic, Himalayan organic food, raw honey India, bilona ghee, homemade pickle, Uttarakhand organic products"
        />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="Ghar Ka Organic" />

        <meta name="theme-color" content="#ffffff" />

        <link rel="canonical" href={CANONICAL} />

        {/* OPEN GRAPH */}

        <meta property="og:type" content="website" />

        <meta property="og:title" content="Create Account | Ghar Ka Organic" />

        <meta
          property="og:description"
          content="Join Ghar Ka Organic and explore authentic Himalayan organic food products."
        />

        <meta property="og:url" content={CANONICAL} />

        <meta property="og:image" content={OG_IMAGE} />

        <meta property="og:site_name" content="Ghar Ka Organic" />

        {/* TWITTER */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="Create Account | Ghar Ka Organic" />

        <meta
          name="twitter:description"
          content="Join Ghar Ka Organic for authentic Himalayan organic food."
        />

        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON LD */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSONLD,
          }}
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        <section className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-gray-900">
              Create Your Account
            </h1>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Join Ghar Ka Organic and explore authentic Himalayan organic
              products including raw honey, bilona ghee and homemade pickles.
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <form onSubmit={handleNextStep} className="space-y-8">
                <div>
                  <label className="block mb-3 text-sm text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-black text-white rounded-lg hover:bg-gray-900 transition">
                  Continue
                </button>
              </form>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={socialLoading}
                className="w-full mt-8 h-14 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue With Google
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black"
              />

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black"
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black">
                <option value="">Select Gender</option>

                <option value="Male">Male</option>

                <option value="Female">Female</option>

                <option value="Other">Other</option>
              </select>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-lg px-4 h-14 outline-none focus:border-black"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-black text-white rounded-lg hover:bg-gray-900 transition">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-10">
              <h2 className="text-3xl font-light text-gray-900">
                Account Created
              </h2>

              <p className="mt-5 text-gray-600">Verification email sent to:</p>

              <p className="mt-2 font-medium">{form.email}</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-600">Already have an account?</p>

            <Link
              to="/auth/login"
              className="inline-block mt-3 text-black underline">
              Login
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
