import React from "react";
import { Link } from "react-router-dom";
import { BRAND_NAME, CONFIG } from "../../../config/AppConfig";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full font-sans bg-[#FAF7F2] text-[#2F3E2F]">
      <img src="https://www.farmdidi.com/cdn/shop/files/website_Footer_1-01.webp?v=1758439630&width=5760" />
      {/* ── Main Footer ── */}
      <div className="pt-14 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border shadow-sm">
              <img src="/gharka-logo.png" alt={BRAND_NAME} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Authentic homemade organic food made with traditional recipes and
              love. Fresh, pure, and chemical-free.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {CONFIG.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 bg-white border rounded-full flex items-center justify-center hover:bg-[#2F3E2F] hover:text-white transition">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {CONFIG.categories?.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    className="hover:text-[#2F3E2F] transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
              Policies
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {CONFIG.policies.map((policy) => (
                <li key={policy.label}>
                  <Link
                    to={policy.path}
                    className="hover:text-[#2F3E2F] transition">
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Contact
            </h3>

            <div className="text-sm text-gray-600 space-y-2">
              <a
                href={CONFIG.contact.phoneLink}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[#2F3E2F]">
                {CONFIG.contact.phoneDisplay}
              </a>

              <a
                href={`mailto:${CONFIG.contact.email}`}
                className="block hover:text-[#2F3E2F]">
                {CONFIG.contact.email}
              </a>
            </div>

            {/* CTA */}
            <a
              href={CONFIG.contact.phoneLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 px-5 py-2.5 bg-[#2F3E2F] text-white text-sm rounded-full hover:bg-[#1e2a1e] transition">
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-[#E8E5DF] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-gray-500">
            © {year} {BRAND_NAME}. All Rights Reserved
          </p>

          <div className="flex gap-4 text-[11px] text-gray-500">
            <span>100% Homemade</span>
            <span>No Preservatives</span>
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
