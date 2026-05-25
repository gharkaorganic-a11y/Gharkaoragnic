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
    <footer
      className="bg-[#2A2621] text-[#F8F5EE] w-full font-sans"
      itemScope
      itemType="https://schema.org/Organization">
      {/* SEO HIDDEN CONTENT */}
      <div className="hidden">
        <h2>Ghar Ka Organic</h2>
        <p>
          Ghar Ka Organic is an Indian organic food brand offering Himalayan
          pickles, raw forest honey, A2 bilona desi ghee, traditional achar,
          organic spices and homemade products across India.
        </p>
      </div>

      {/* HERO IMAGE */}
      <div className="w-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1776771800/0ff91c26-4c45-4159-8b58-f2bb3d1db249_fuqto9.webp"
          alt="Ghar Ka Organic Himalayan Organic Food Banner"
          className="
            w-full
            h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px]
            object-cover object-center
          "
          loading="lazy"
        />
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-12 md:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND & TRUST BADGE */}
          <div className="space-y-6">
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold text-[#DE9F35]"
                itemProp="name">
                Ghar Ka Organic
              </h2>

              <meta itemProp="url" content="https://gharkaorganic.com" />

              <meta
                itemProp="logo"
                content="https://gharkaorganic.com/gharka-logo.png"
              />
            </div>

            <p className="text-[14px] md:text-[15px] leading-relaxed text-[#F8F5EE]/80">
              Authentic organic food brand offering homemade Himalayan pickles,
              raw forest honey, A2 bilona desi ghee and traditional Indian food
              products prepared naturally without preservatives.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3">
              {[
                {
                  Icon: Instagram,
                  href: "https://instagram.com/gharkaorganic",
                  label: "Instagram",
                },
                {
                  Icon: Facebook,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
                {
                  Icon: Youtube,
                  href: "https://youtube.com",
                  label: "YouTube",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
              ].map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-[#F8F5EE]/20 rounded-full flex items-center justify-center hover:bg-[#DE9F35] hover:text-[#2A2621] transition duration-300">
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {/* FSSAI TRUST BADGE */}
            <div className="mt-8 pt-6 border-t border-[#F8F5EE]/10">
              <div className="flex items-center gap-4">
                <div className="bg-white px-3 py-2 rounded-md shadow-sm inline-block">
                  {/* Note: Replace 'fssai-logo.png' with your actual image path or import */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
                    alt="FSSAI Certified"
                    className="h-9 md:h-10 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#DE9F35] text-xs font-bold tracking-widest uppercase mb-1">
                    100% Safe & Trusted
                  </span>
                  <span className="text-[#F8F5EE]/60 text-[11px]">
                    FSSAI Certified Brand
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SHOP LINKS */}
          <div>
            <h3 className="text-sm uppercase tracking-[3px] text-[#DE9F35] mb-6 font-semibold">
              Shop
            </h3>

            <ul className="space-y-4 text-[15px] text-[#F8F5EE]/80">
              {[
                {
                  name: "Best Selling Products",
                  url: "/shop/best-sellers",
                },
                {
                  name: "Raw Forest Honey",
                  url: "/organic-honey",
                },
                {
                  name: "Pahadi Pickles",
                  url: "/buy-pahadi-achar-online",
                },
                {
                  name: "Buy Mango Pickle Online",
                  url: "/buy-mango-pickle-online",
                },
                {
                  name: "A2 Bilona Desi Ghee",
                  url: "/buy-desi-ghee-online",
                },
                {
                  name: "All Organic Products",
                  url: "/all-products",
                },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.url}
                    className="hover:text-[#DE9F35] transition duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-sm uppercase tracking-[3px] text-[#DE9F35] mb-6 font-semibold">
              Company
            </h3>

            <ul className="space-y-4 text-[15px] text-[#F8F5EE]/80">
              {[
                { name: "Our Story", url: "/pages/our-story" },
                { name: "How We Make", url: "/pages/process" },
                { name: "Blogs", url: "/pages/blogs" },
                { name: "Contact Us", url: "/pages/contact" },
                { name: "Shipping Policy", url: "/shipping" },
                { name: "Privacy Policy", url: "/privacy" },
                { name: "Terms & Conditions", url: "/terms" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.url}
                    className="hover:text-[#DE9F35] transition duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-[3px] text-[#DE9F35] mb-6 font-semibold">
                Contact
              </h3>
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="text-[#DE9F35] mt-[2px] flex-shrink-0"
              />

              <div>
                <p className="text-xs uppercase text-[#F8F5EE]/50 mb-1">
                  Customer Support
                </p>

                <a
                  href="tel:+919897447525"
                  className="text-[15px] hover:text-[#DE9F35] transition">
                  +91 98974 47525
                </a>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="text-[#DE9F35] mt-[2px] flex-shrink-0"
              />

              <div>
                <p className="text-xs uppercase text-[#F8F5EE]/50 mb-1">
                  Email
                </p>

                <a
                  href="mailto:gharkaorganic@gmail.com"
                  className="text-[15px] hover:text-[#DE9F35] transition"
                  itemProp="email">
                  gharkaorganic@gmail.com
                </a>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="text-[#DE9F35] mt-[2px] flex-shrink-0"
              />

              <div
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress">
                <p className="text-xs uppercase text-[#F8F5EE]/50 mb-1">
                  Address
                </p>

                <address className="not-italic text-[15px] leading-relaxed text-[#F8F5EE]/80">
                  <span itemProp="addressRegion">Uttarakhand</span>,
                  <span itemProp="addressCountry"> India</span>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* SEO TEXT */}
        <div className="border-t border-[#F8F5EE]/10 mt-14 pt-8">
          <div className="max-w-4xl">
            <p className="text-[14px] md:text-[15px] leading-[2] text-[#F8F5EE]/60">
              Buy authentic Himalayan organic food online from Ghar Ka Organic.
              Explore homemade pickles, mango achar, raw forest honey, A2 bilona
              desi ghee, pahadi chutneys and traditional Indian organic food
              products delivered across India.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-[#F8F5EE]/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-[#F8F5EE]/50">
          <p className="text-center md:text-left">
            © {currentYear} Ghar Ka Organic. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/terms" className="hover:text-[#DE9F35] transition">
              Terms
            </Link>

            <Link to="/privacy" className="hover:text-[#DE9F35] transition">
              Privacy
            </Link>

            <Link to="/shipping" className="hover:text-[#DE9F35] transition">
              Shipping
            </Link>

            <Link
              to="/pages/contact"
              className="hover:text-[#DE9F35] transition">
              Contact
            </Link>

            <Link to="/sitemap.xml" className="hover:text-[#DE9F35] transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* PREMIUM WEBSITE CREDIT */}
      <div className="border-t border-[#F8F5EE]/10 mt-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-5">
          <a
            href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20premium%20website%20like%20Ghar%20Ka%20Organic"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              flex
              flex-col
              md:flex-row
              items-center
              justify-center
              gap-2
              text-center
              transition-all
              duration-300
            ">
            <span
              className="
                text-[10px]
                sm:text-[11px]
                tracking-[4px]
                uppercase
                text-[#F8F5EE]/35
                group-hover:text-[#DE9F35]
                transition
              ">
              Website Designed & Developed By
            </span>

            <div className="hidden md:block w-1 h-1 rounded-full bg-[#F8F5EE]/20"></div>

            <span
              className="
                text-sm
                md:text-[15px]
                font-semibold
                tracking-[1px]
                text-[#DE9F35]
                group-hover:scale-[1.03]
                transition
              ">
              Ravi Sharma
            </span>

            <div className="hidden md:block w-1 h-1 rounded-full bg-[#F8F5EE]/20"></div>

            <span
              className="
                text-[11px]
                md:text-[13px]
                text-[#F8F5EE]/50
                group-hover:text-[#F8F5EE]/80
                transition
              ">
              WhatsApp: +91 83928 56993
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
