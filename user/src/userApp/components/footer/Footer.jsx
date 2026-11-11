import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Mountain,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import SITE_CONFIG from "../../../config/siteConfig";

// Sharp, crisp WhatsApp SVG Icon matching official styling
const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showFullSeo, setShowFullSeo] = useState(false);

  // Structured SEO Footer Links
  const footerSections = [
    {
      title: "Himalayan Pantry",
      links: [
        { name: "Best Selling Products", url: "/shop/best-sellers" },
        { name: "Bhimtal Raw Forest Honey", url: "/pages/raw-honey-uttarakhand" },
        { name: "Authentic Kumaoni Pickles", url: "/pahadi-achar-online" },
        { name: "Sun-Dried Mango Achar", url: "/buy-mango-pickle-online" },
        { name: "A2 Bilona Desi Ghee", url: "/buy-desi-ghee-online" },
        { name: "All Organic Products", url: "/all-products" },
      ],
    },
    {
      title: "Our Heritage",
      links: [
        { name: "Our Story", url: "/our-story" },
        { name: "Customer Reviews", url: "/reviews" },
        { name: "Pahadi Blog & Stories", url: "/blogs" },
        { name: "Contact Us", url: "/contact" },
        { name: "Shipping Policy", url: "/pages/shipping" },
        { name: "Privacy Policy", url: "/pages/privacy-policy" },
        { name: "Terms & Conditions", url: "/pages/terms" },
      ],
    },
  ];

  return (
    <footer
      className="w-full font-sans text-[#F7EFE6] bg-[#8F6646]"
      itemScope
      itemType="https://schema.org/Organization"
      role="contentinfo">
      {/* ── ORGANIZATION SCHEMA METADATA (100% Intact for Google/SEO) ── */}
      <meta itemProp="name" content="Ghar Ka Organic" />
      <meta itemProp="url" content="https://gharkaorganic.com" />
      <meta
        itemProp="logo"
        content={SITE_CONFIG.logo}
      />
      <meta
        itemProp="description"
        content="Authentic organic food brand from Bhimtal, Nainital, Uttarakhand offering homemade Himalayan pickles, raw forest honey, A2 bilona desi ghee and traditional Kumaoni products prepared naturally without preservatives."
      />

      {/* ── 1. ARTWORK BANNER (Mountain Soil Seam) ── */}
      <div className="w-full bg-white overflow-hidden leading-none border-b border-[#8F6646]">
        <picture>
          <img
            src="/nainital-uttarakhand-footer.jpg"
            alt="Traditional Kumaoni women in Pichora harvesting organic red chillies and mustard amidst the hills of Nainital and Bhimtal, Uttarakhand"
            className="w-full h-auto max-h-[170px] sm:max-h-[220px] md:max-h-[290px] lg:max-h-[340px] object-cover object-center block"
            loading="lazy"
            width="1376"
            height="768"
          />
        </picture>
      </div>

      {/* ── 2. FOOTER BODY (Warm Terracotta Soil #8F6646) ── */}
      <div className="w-full bg-[#8F6646]">
        {/* COMPACT KUMAON HERITAGE VALUE BAR */}
        <div className="border-b border-white/15 bg-black/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3]">
                <Mountain size={17} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  Born in Bhimtal, Nainital
                </h4>
                <p className="text-[11px] text-[#F7EFE6]/75 font-light">
                  Direct from the pristine Kumaon hills
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3]">
                <HeartHandshake size={17} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  Empowering Pahadi Women
                </h4>
                <p className="text-[11px] text-[#F7EFE6]/75 font-light">
                  Supporting local Uttarakhand farmer groups
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3]">
                <ShieldCheck size={17} strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  Zero Preservatives
                </h4>
                <p className="text-[11px] text-[#F7EFE6]/75 font-light">
                  100% natural, sun-fermented recipes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. WANT A WEBSITE LIKE THIS? CONTACT SECTION (Matching Uploaded Screenshot Style) ── */}
        <div className="border-b border-white/15 bg-black/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7 sm:py-9">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              {/* Top Underlined Heading */}
              <a
                href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20website%20like%20Ghar%20Ka%20Organic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg text-white hover:text-[#FFE3B3] font-medium underline underline-offset-4 decoration-white/50 hover:decoration-[#FFE3B3] transition-colors mb-2 inline-block">
                Want a Website Like This? Contact Us
              </a>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#F7EFE6]/85 font-light max-w-lg mb-6 leading-relaxed">
                Designed &amp; Developed by{" "}
                <Link
                  to="/website-developer"
                  className="font-semibold text-[#FFE3B3] hover:underline">
                  Ravi Sharma
                </Link>
                . Get a premium, blazing-fast eCommerce store or custom website. Call or WhatsApp:{" "}
                <a
                  href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20website%20like%20Ghar%20Ka%20Organic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:underline whitespace-nowrap">
                  +91 83928 56993
                </a>
              </p>

              {/* Direct Platform Redirect Buttons (No input form needed) */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                {/* Direct 1-Click WhatsApp Redirect Bar Matching Reference Box */}
                <a
                  href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20website%20like%20Ghar%20Ka%20Organic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat directly on WhatsApp with Ravi Sharma"
                  className="w-full sm:max-w-md border border-white/40 hover:border-white/80 bg-white/5 hover:bg-white/10 px-4 py-2.5 flex items-center justify-between text-sm text-white transition group">
                  <span className="text-xs sm:text-sm font-light text-white/90 group-hover:text-white">
                    Connect directly on WhatsApp (+91 83928 56993)
                  </span>
                  <span className="text-white group-hover:text-[#FFE3B3] transition-transform group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </a>

                {/* Circular Platform Action Icons */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Instagram: https://www.instagram.com/raviiiiii._0/ */}
                  <a
                    href="https://www.instagram.com/raviiiiii._0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ravi Sharma on Instagram (@raviiiiii._0)"
                    title="Instagram: @raviiiiii._0"
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white transition-all duration-300">
                    <Instagram size={15} />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20website%20like%20Ghar%20Ka%20Organic"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Ravi Sharma on WhatsApp (+91 83928 56993)"
                    title="WhatsApp: +91 83928 56993"
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300">
                    <WhatsAppIcon size={16} />
                  </a>

                  {/* Phone Call */}
                  <a
                    href="tel:+918392856993"
                    aria-label="Call Ravi Sharma (+91 83928 56993)"
                    title="Call: +91 83928 56993"
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#8F6646] transition-all duration-300">
                    <Phone size={15} />
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:ravisharmabhimtal@gmail.com?subject=Website%20Inquiry%20from%20Ghar%20Ka%20Organic"
                    aria-label="Email Ravi Sharma"
                    title="Email: ravisharmabhimtal@gmail.com"
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#8F6646] transition-all duration-300">
                    <Mail size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. MAIN CONTENT (Compact & Short, 100% SEO preserved) ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-8 sm:pt-9 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-8">
            {/* BRAND SECTION (Spans 4 columns) */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <Link
                  to="/"
                  aria-label="Ghar Ka Organic home"
                  className="mb-3 inline-flex rounded-lg bg-white p-2">
                  <img
                    src={SITE_CONFIG.logo}
                    alt="Ghar Ka Organic"
                    className="h-14 w-auto max-w-[220px] object-contain"
                    loading="lazy"
                  />
                </Link>
                <h2
                  style={{ color: "#ffffff" }}
                  className="!text-white text-xl sm:text-2xl font-serif font-bold tracking-tight">
                  Ghar Ka Organic
                </h2>
                <p
                  style={{ color: "#FFE3B3" }}
                  className="!text-[#FFE3B3] text-[11px] mt-1 uppercase tracking-[0.2em] font-semibold">
                  Bhimtal, Nainital (Uttarakhand)
                </p>
              </div>

              <p className="text-xs sm:text-[13px] leading-relaxed text-[#F7EFE6]/80 font-light">
                Rooted in the serene hills of Nainital, Uttarakhand. We craft
                authentic Kumaoni pickles, pure A2 bilona desi ghee, raw forest
                honey, and traditional Himalayan foods made by mountain women
                with zero artificial preservatives.
              </p>

              {/* TRUST BADGE (Compact) */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2.5 bg-white/95 px-3 py-1.5 rounded-lg shadow-xs">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
                    alt="FSSAI Certified – Food Safety Authority of India"
                    className="h-6 sm:h-7 object-contain"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[#7B4627] text-[9.5px] font-bold tracking-wider uppercase leading-tight">
                      100% Safe &amp; Certified
                    </span>
                    <span className="text-[#6B5A4B] text-[9.5px] leading-tight font-medium">
                      FSSAI Registered • Uttarakhand
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NAVIGATION - HIMALAYAN PANTRY (Spans 3 columns) */}
            <div className="lg:col-span-3">
              <nav aria-label="Himalayan Pantry navigation">
                <h3
                  style={{ color: "#FFE3B3" }}
                  className="!text-[#FFE3B3] text-xs uppercase tracking-[2px] font-semibold mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE3B3]" />
                  {footerSections[0].title}
                </h3>

                <ul className="space-y-2 text-[13px] text-[#F7EFE6]/85 font-light">
                  {footerSections[0].links.map((item) => (
                    <li key={item.url}>
                      <Link
                        to={item.url}
                        className="hover:text-white transition duration-200 inline-flex items-center group">
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {item.name}
                        </span>
                        <ArrowRight
                          size={12}
                          className="ml-1 text-[#FFE3B3] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* NAVIGATION - OUR HERITAGE (Spans 2 columns) */}
            <div className="lg:col-span-2">
              <nav aria-label="Our Heritage navigation">
                <h3
                  style={{ color: "#FFE3B3" }}
                  className="!text-[#FFE3B3] text-xs uppercase tracking-[2px] font-semibold mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE3B3]" />
                  {footerSections[1].title}
                </h3>

                <ul className="space-y-2 text-[13px] text-[#F7EFE6]/85 font-light">
                  {footerSections[1].links.map((item) => (
                    <li key={item.url}>
                      <Link
                        to={item.url}
                        className="hover:text-white transition duration-200 inline-flex items-center group">
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {item.name}
                        </span>
                        <ArrowRight
                          size={12}
                          className="ml-1 text-[#FFE3B3] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* CONTACT & ORIGIN (Spans 3 columns) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h3
                style={{ color: "#FFE3B3" }}
                className="!text-[#FFE3B3] text-xs uppercase tracking-[2px] font-semibold mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE3B3]" />
                Contact &amp; Origin
              </h3>

              <div className="space-y-3 text-xs sm:text-[13px]">
                {/* PHONE */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3] mt-0.5">
                    <Phone size={13} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#FFE3B3]/80 font-medium">
                      Customer Support
                    </p>
                    <a
                      href="tel:+919897447525"
                      className="text-white hover:text-[#FFE3B3] font-medium transition block mt-0.5"
                      itemProp="telephone">
                      +91 98974 47525
                    </a>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3] mt-0.5">
                    <Mail size={13} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#FFE3B3]/80 font-medium">
                      Direct Email
                    </p>
                    <a
                      href="mailto:gharkaorganic@gmail.com"
                      className="text-white hover:text-[#FFE3B3] font-medium transition block mt-0.5"
                      itemProp="email">
                      gharkaorganic@gmail.com
                    </a>
                  </div>
                </div>

                {/* ADDRESS */}
                <div
                  className="flex items-start gap-2.5"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FFE3B3] mt-0.5">
                    <MapPin size={13} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#FFE3B3]/80 font-medium">
                      Kitchen &amp; HQ
                    </p>
                    <address className="not-italic text-[12px] leading-relaxed text-[#F7EFE6]/80 font-light mt-0.5">
                      Ward No. 2, Nalni, Bhimtal,
                      <br />
                      <span itemProp="addressLocality">Nainital</span>,{" "}
                      <span itemProp="addressRegion">Uttarakhand</span> – 263136
                      <br />
                      <span itemProp="addressCountry">India</span>
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. SEO FOOTER TEXT (Compact View for Users, 100% In DOM for Googlebot) ── */}
          <div className="border-t border-white/15 mt-6 pt-5">
            <div className="max-w-4xl">
              <h2
                style={{ color: "#FFE3B3" }}
                className="!text-[#FFE3B3] text-xs font-semibold mb-2 uppercase tracking-wider">
                About Ghar Ka Organic • Nainital, Uttarakhand
              </h2>
              <p
                className={`text-xs leading-relaxed text-[#F7EFE6]/75 font-light ${
                  !showFullSeo ? "line-clamp-2 md:line-clamp-none" : ""
                }`}>
                Buy authentic Himalayan organic food online from Ghar Ka Organic,
                based in Bhimtal, Nainital, Uttarakhand. We offer handmade pickles
                (aam achar, nimbu achar, bhang chutney), raw forest honey gathered
                from wild mountain flora, A2 bilona desi ghee, and traditional
                Uttarakhand organic food products delivered across India with free
                shipping. All our products are prepared naturally by local women
                using multi-generational Kumaoni recipes without chemicals or
                artificial preservatives.
              </p>
              {/* Mobile Read More Toggle for Short Clean Display */}
              <button
                type="button"
                onClick={() => setShowFullSeo(!showFullSeo)}
                className="md:hidden mt-1 text-[11px] text-[#FFE3B3] hover:underline flex items-center gap-1">
                {showFullSeo ? (
                  <>
                    Show less <ChevronUp size={12} />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown size={12} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── 6. BOTTOM - COPYRIGHT & FOOTER POLICIES (Compact) ── */}
          <div className="border-t border-white/15 mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#F7EFE6]/70">
            <p className="text-center md:text-left">
              © {currentYear}, Ghar Ka Organic. Handcrafted in Bhimtal, Nainital, Uttarakhand.
            </p>

            <nav
              className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 font-normal"
              aria-label="Footer policies">
              <Link to="/pages/terms" className="hover:text-white transition">
                Refund policy
              </Link>
              <span className="text-white/30">•</span>
              <Link
                to="/pages/privacy-policy"
                className="hover:text-white transition">
                Privacy policy
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/pages/terms" className="hover:text-white transition">
                Terms of service
              </Link>
              <span className="text-white/30">•</span>
              <Link
                to="/pages/shipping"
                className="hover:text-white transition">
                Shipping policy
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/contact" className="hover:text-white transition">
                Contact information
              </Link>
              <span className="text-white/30">•</span>
              <a
                href="https://gharkaorganic.com/sitemap.xml"
                className="hover:text-white transition">
                Sitemap
              </a>
            </nav>
          </div>
        </div>

        {/* ── 7. COMPACT BOTTOM DEVELOPER CREDIT ── */}
        <div className="border-t border-white/15 bg-black/15 py-3">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#F7EFE6]/70 text-center">
            <span>Website Designed &amp; Developed by</span>
            <Link
              to="/website-developer"
              className="font-semibold text-[#FFE3B3] hover:underline">
              Ravi Sharma
            </Link>
            <span className="hidden sm:inline text-white/30">•</span>
            <span>
              WhatsApp / Call:{" "}
              <a
                href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20website%20like%20Ghar%20Ka%20Organic"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:text-[#FFE3B3] hover:underline">
                +91 83928 56993
              </a>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <a
              href="https://www.instagram.com/raviiiiii._0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE3B3] hover:text-white hover:underline">
              Instagram @raviiiiii._0
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
