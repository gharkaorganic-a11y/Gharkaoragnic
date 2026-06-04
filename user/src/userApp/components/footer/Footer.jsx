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

  // ✅ STRUCTURED FOOTER LINKS FOR SITELINKS
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Best Selling Products", url: "/shop/best-sellers" },
        { name: "Raw Forest Honey", url: "/pages/raw-honey-uttarakhand" },
        { name: "Pahadi Pickles", url: "/pahadi-achar-online" },
        { name: "Mango Pickle Online", url: "/buy-mango-pickle-online" },
        { name: "A2 Bilona Desi Ghee", url: "/buy-desi-ghee-online" },
        { name: "All Organic Products", url: "/all-products" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Our Story", url: "/our-story" },
        { name: "Customer Reviews", url: "/reviews" },
        { name: "Blog & Stories", url: "/blogs" },
        { name: "Contact Us", url: "/contact" },
        { name: "Shipping Policy", url: "/pages/shipping" },
        { name: "Privacy Policy", url: "/pages/privacy" },
        { name: "Terms & Conditions", url: "/pages/terms" },
      ],
    },
  ];

  const socialLinks = [
    {
      Icon: Instagram,
      href: "https://instagram.com/gharkaorganic",
      label: "Instagram",
    },
    {
      Icon: Facebook,
      href: "https://facebook.com/gharkaorganic",
      label: "Facebook",
    },
    {
      Icon: Youtube,
      href: "https://youtube.com/@gharkaorganic",
      label: "YouTube",
    },
    {
      Icon: Twitter,
      href: "https://twitter.com/gharkaorganic",
      label: "Twitter",
    },
  ];

  return (
    <footer
      className="bg-[#2A2621] text-[#F8F5EE] w-full font-sans"
      itemScope
      itemType="https://schema.org/Organization"
      role="contentinfo">
      {/* ✅ ORGANIZATION SCHEMA METADATA */}
      <meta itemProp="name" content="Ghar Ka Organic" />
      <meta itemProp="url" content="https://gharkaorganic.com" />
      <meta
        itemProp="logo"
        content="https://gharkaorganic.com/gharka-logo.png"
      />
      <meta
        itemProp="description"
        content="Authentic organic food brand offering homemade Himalayan pickles, raw forest honey, A2 bilona desi ghee and traditional Indian food products prepared naturally without preservatives."
      />

      {/* HERO IMAGE */}
      <div className="w-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1776771800/0ff91c26-4c45-4159-8b58-f2bb3d1db249_fuqto9.webp"
          alt="Ghar Ka Organic Himalayan Organic Food Banner"
          className="w-full h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px] object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-12 md:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND SECTION */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#DE9F35]">
                Ghar Ka Organic
              </h2>
              <p className="text-xs text-[#F8F5EE]/50 mt-1">
                Himalayan Organic Food
              </p>
            </div>

            <p className="text-[14px] md:text-[15px] leading-relaxed text-[#F8F5EE]/80">
              Authentic organic food brand offering homemade Himalayan pickles,
              raw forest honey, A2 bilona desi ghee and traditional Indian food
              products prepared naturally without preservatives.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`Follow us on ${label}`}
                  className="w-10 h-10 border border-[#F8F5EE]/20 rounded-full flex items-center justify-center hover:bg-[#DE9F35] hover:text-[#2A2621] transition duration-300">
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {/* TRUST BADGE */}
            <div className="mt-8 pt-6 border-t border-[#F8F5EE]/10">
              <div className="flex items-center gap-4">
                <div className="bg-white px-3 py-2 rounded-md shadow-sm inline-block">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
                    alt="FSSAI Certified – Food Safety Authority of India"
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

          {/* ✅ SEMANTIC NAVIGATION - WITH STRUCTURED LINKS */}
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={`${section.title} navigation`}>
              <h3 className="text-sm uppercase tracking-[3px] text-[#DE9F35] mb-6 font-semibold">
                {section.title}
              </h3>

              <ul className="space-y-4 text-[15px] text-[#F8F5EE]/80">
                {section.links.map((item) => (
                  <li key={item.url}>
                    <Link
                      to={item.url}
                      className="hover:text-[#DE9F35] transition duration-300 inline-flex items-center group">
                      {item.name}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* CONTACT SECTION */}
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-[3px] text-[#DE9F35] font-semibold">
              Contact
            </h3>

            {/* PHONE */}
            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="text-[#DE9F35] mt-[2px] flex-shrink-0"
                aria-hidden="true"
              />

              <div>
                <p className="text-xs uppercase text-[#F8F5EE]/50 mb-1">
                  Customer Support
                </p>
                <a
                  href="tel:+919897447525"
                  className="text-[15px] hover:text-[#DE9F35] transition font-medium"
                  itemProp="telephone">
                  +91 98974 47525
                </a>
                <p className="text-xs text-[#F8F5EE]/40 mt-1">
                  WhatsApp available
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="text-[#DE9F35] mt-[2px] flex-shrink-0"
                aria-hidden="true"
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
                aria-hidden="true"
              />

              <div
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress">
                <p className="text-xs uppercase text-[#F8F5EE]/50 mb-1">
                  Headquarters
                </p>
                <address className="not-italic text-[15px] leading-relaxed text-[#F8F5EE]/80">
                  <span itemProp="addressLocality">Nainital</span>,{" "}
                  <span itemProp="addressRegion">Uttarakhand</span>
                  <br />
                  <span itemProp="addressCountry">India</span>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SEO FOOTER TEXT - NOT HIDDEN (Better for indexing) */}
        <div className="border-t border-[#F8F5EE]/10 mt-14 pt-8">
          <div className="max-w-4xl">
            <h2 className="text-lg font-semibold text-[#DE9F35] mb-4">
              About Ghar Ka Organic
            </h2>
            <p className="text-[14px] md:text-[15px] leading-[2] text-[#F8F5EE]/70">
              Buy authentic Himalayan organic food online from Ghar Ka Organic,
              based in Nainital, Uttarakhand. We offer homemade pickles (aam
              achar, nimbu achar), raw forest honey, A2 bilona desi ghee, pahadi
              chutneys, and traditional Indian organic food products delivered
              across India with free shipping. All our products are made without
              artificial preservatives or chemicals using traditional Kumaoni
              recipes and methods. Shop best-selling organic products, read
              customer reviews, and discover our story about bringing authentic
              Himalayan food to your home.
            </p>
          </div>
        </div>

        {/* BOTTOM - COPYRIGHT & FOOTER LINKS */}
        <div className="border-t border-[#F8F5EE]/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-[#F8F5EE]/50">
          <p className="text-center md:text-left">
            © {currentYear} Ghar Ka Organic. All rights reserved.
          </p>

          <nav
            className="flex flex-wrap justify-center gap-5"
            aria-label="Footer policies">
            <Link to="/pages/terms" className="hover:text-[#DE9F35] transition">
              Terms
            </Link>
            <span className="text-[#F8F5EE]/20">•</span>
            <Link
              to="/pages/privacy"
              className="hover:text-[#DE9F35] transition">
              Privacy
            </Link>
            <span className="text-[#F8F5EE]/20">•</span>
            <Link
              to="/pages/shipping"
              className="hover:text-[#DE9F35] transition">
              Shipping
            </Link>
            <span className="text-[#F8F5EE]/20">•</span>
            <Link to="/contact" className="hover:text-[#DE9F35] transition">
              Contact
            </Link>
            <span className="text-[#F8F5EE]/20">•</span>
            <a
              href="https://gharkaorganic.com/sitemap.xml"
              className="hover:text-[#DE9F35] transition">
              Sitemap
            </a>
          </nav>
        </div>
      </div>

      {/* WEBSITE CREDIT */}
      <div className="border-t border-[#F8F5EE]/10 mt-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-5">
          <a
            href="https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20want%20a%20premium%20website%20like%20Ghar%20Ka%20Organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row items-center justify-center gap-2 text-center transition-all duration-300">
            <span className="text-[10px] sm:text-[11px] tracking-[4px] uppercase text-[#F8F5EE]/35 group-hover:text-[#DE9F35] transition">
              Website Designed & Developed By
            </span>

            <div className="hidden md:block w-1 h-1 rounded-full bg-[#F8F5EE]/20"></div>

            <span className="text-sm md:text-[15px] font-semibold tracking-[1px] text-[#DE9F35] group-hover:scale-[1.03] transition">
              Ravi Sharma
            </span>

            <div className="hidden md:block w-1 h-1 rounded-full bg-[#F8F5EE]/20"></div>

            <span className="text-[11px] md:text-[13px] text-[#F8F5EE]/50 group-hover:text-[#F8F5EE]/80 transition">
              WhatsApp: +91 83928 56993
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
