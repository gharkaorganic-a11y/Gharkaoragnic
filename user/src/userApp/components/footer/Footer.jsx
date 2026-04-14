import React from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFBF7] text-gray-800 w-full font-sans relative">
      {/* Decorative top wave - Soft Cream */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.15,122.5,214.34,120,250.56,118.45,286.74,106.63,321.39,56.44Z"
            className="fill-[#FDFBF7]"></path>
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand - spans 4 on desktop */}
          <div className="lg:col-span-4 space-y-6 lg:pr-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm -0">
                <img
                  src="/gharka.png"
                  alt="Ghar ka Organic Logo"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">
                  GharKaOrganic
                </h3>
                <p className="text-xs font-medium text-[#c8102e] uppercase tracking-widest mt-0.5">
                  Homemade with Love
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 max-w-sm">
              Authentic homemade pickles crafted by rural women entrepreneurs
              across India. Bringing the traditional taste of home straight to
              your dining table.
            </p>

            {/* Social */}
            <div className="pt-2">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">
                Join the Didigiri
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, label: "Instagram", href: "#" },
                  { Icon: Facebook, label: "Facebook", href: "#" },
                  { Icon: Twitter, label: "X", href: "#" },
                  { Icon: Youtube, label: "YouTube", href: "#" },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Icon size={18} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Shop - spans 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-6">
              Shop Collections
            </h4>
            <ul className="space-y-3.5 text-[14px] font-medium">
              {[
                "Homemade Pickles",
                "Mustard Oil Pickles",
                "Spicy Pickles",
                "Tangy Pickles",
                "Sweet Pickles",
                "Mango Pickles",
                "Oil Free",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/collection/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 hover:text-[#c8102e] hover:translate-x-1.5 inline-block transition-all duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company - spans 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-6">
              Our Company
            </h4>
            <ul className="space-y-3.5 text-[14px] font-medium">
              {[
                { label: "Our Story", to: "/our-story" },
                { label: "Blogs & Recipes", to: "/blog" },
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Refund Policy", to: "/cancellation" },
                { label: "Shipping Info", to: "/shipping" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-[#c8102e] hover:translate-x-1.5 inline-block transition-all duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact - spans 4 */}
          <div className="lg:col-span-4 lg:pl-8">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-6">
              Need Help?
            </h4>
            <div className="space-y-5 text-sm">
              <a
                href="mailto:customercare@gharka.com"
                className="flex items-start gap-4 text-gray-600 hover:text-gray-900 group transition-colors">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:border-[#c8102e] transition-colors">
                  <Mail
                    size={18}
                    className="text-gray-700 group-hover:text-[#c8102e] transition-colors"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 mb-0.5">
                    Email Support
                  </p>
                  <p className="font-medium">customercare@gharkaorganic.com</p>
                </div>
              </a>

              <a
                href="tel:+918045883770"
                className="flex items-start gap-4 text-gray-600 hover:text-gray-900 group transition-colors">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:border-[#c8102e] transition-colors">
                  <Phone
                    size={18}
                    className="text-gray-700 group-hover:text-[#c8102e] transition-colors"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 mb-0.5">Call Us</p>
                  <p className="font-medium">+91 8045883770 / +91 9960214247</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Mon-Sat, 10 AM - 6 PM
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 text-gray-600">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <MapPin size={18} className="text-gray-700" />
                </div>
                <div className="pt-1">
                  <p className="font-bold text-gray-900 mb-0.5">
                    Registered Office
                  </p>
                  <address className="not-italic text-[13px] leading-relaxed font-medium text-gray-600">
                    Missiondidis Private Limited
                    <br />
                    Plot no - 84, Jay Associates, Sector 22,
                    <br />
                    Kamothe, Kalamboli, Navi Mumbai,
                    <br />
                    Raigad, Maharashtra, 410210
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>© {currentYear} Ghar Ka Organic. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/terms"
              className="hover:text-[#c8102e] transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:text-[#c8102e] transition-colors">
              Privacy Policy
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-[#c8102e] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
