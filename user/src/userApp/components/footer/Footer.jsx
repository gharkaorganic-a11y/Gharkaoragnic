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
    <footer className="bg-[#2A2621] text-[#F8F5EE] w-full font-sans">
      {/* HERO IMAGE (RESPONSIVE HEIGHT FIX) */}
      <div className="w-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1776771800/0ff91c26-4c45-4159-8b58-f2bb3d1db249_fuqto9.webp"
          alt="Ghar Ka Organic Himalayan lifestyle banner"
          className="
            w-full 
            h-[160px] sm:h-[220px] md:h-[320px] lg:h-[380px] 
            object-cover object-center
          "
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-10 md:pt-14 pb-8">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* BRAND */}
          <div className="space-y-5">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#DE9F35]">
              Ghar Ka.
            </h1>

            <p className="text-[14px] md:text-[15px] text-[#F8F5EE]/80 leading-relaxed">
              Authentic Himalayan food brand offering A2 Desi Ghee, Raw Forest
              Honey, and traditional Pahadi Pickles made by rural women
              entrepreneurs.
            </p>

            <div className="flex gap-3 pt-1">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Youtube, href: "#", label: "YouTube" },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 md:w-10 md:h-10 border border-[#F8F5EE]/30 rounded-full flex items-center justify-center hover:bg-[#DE9F35] hover:text-[#2A2621] transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h2 className="text-xs md:text-sm font-serif uppercase tracking-widest text-[#DE9F35] mb-4 md:mb-6">
              Shop
            </h2>

            <ul className="space-y-3 md:space-y-4 text-[14px] md:text-[15px] text-[#F8F5EE]/80">
              {[
                { name: "Most Loved Products", url: "/shop/best-sellers" },
                { name: "Raw Honey", url: "/raw-honey-uttarakhand" },
                { name: "Pickles", url: "/buy-pahadi-achar-online" },
                {
                  name: "Buy Mango Pickle Online",
                  url: "/buy-mango-pickle-online",
                },
                { name: "All Products", url: "/all-products" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.url}
                    className="hover:text-[#DE9F35] transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h2 className="text-xs md:text-sm font-serif uppercase tracking-widest text-[#DE9F35] mb-4 md:mb-6">
              Company
            </h2>

            <ul className="space-y-3 md:space-y-4 text-[14px] md:text-[15px] text-[#F8F5EE]/80">
              {[
                { name: "Our Story", url: "/pages/our-story" },
                { name: "Process", url: "/pages/process" },
                { name: "Blogs", url: "/pages/blogs" },
                { name: "Contact", url: "/pages/contact" },
                { name: "Shipping", url: "/shipping" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.url} className="hover:text-[#DE9F35]">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-5">
            <h2 className="text-xs md:text-sm font-serif uppercase tracking-widest text-[#DE9F35] mb-4 md:mb-6">
              Contact
            </h2>

            <div className="flex gap-3">
              <Phone size={18} className="text-[#DE9F35]" />
              <a href="tel:+917983990550" className="text-sm md:text-[15px]">
                +91 79839 90550
              </a>
            </div>

            <div className="flex gap-3">
              <Mail size={18} className="text-[#DE9F35]" />
              <a
                href="mailto:gharkaorganic@gmail.com"
                className="text-sm md:text-[15px]">
                gharkaorganic@gmail.com
              </a>
            </div>

            <div className="flex gap-3">
              <MapPin size={18} className="text-[#DE9F35]" />
              <address className="not-italic text-sm md:text-[15px]">
                Bhimtal, Nainital <br />
                Uttarakhand, India
              </address>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-[#F8F5EE]/10 mt-10 md:mt-14 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-[#F8F5EE]/50">
          <p className="text-center md:text-left">
            © {currentYear} Ghar Ka Organic
          </p>

          <div className="flex gap-5 mt-3 md:mt-0">
            <Link to="/terms" className="hover:text-[#DE9F35]">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-[#DE9F35]">
              Privacy
            </Link>
            <Link to="/sitemap" className="hover:text-[#DE9F35]">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
