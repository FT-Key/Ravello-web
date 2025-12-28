// src/components/common/Navbar/Topbar.jsx
import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { siteConfig } from "../../../config/siteConfig";

export default function Topbar({ isScrolled, topbarClickable }) {
  return (
    <div
      className={`transition-all duration-500 overflow-hidden ${
        isScrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
      } ${topbarClickable ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center text-sm py-2 border-b border-white border-opacity-20 min-h-[56px]">
          {/* IZQUIERDA */}
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-6 text-white">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-2 hover:text-secondary-cyan transition-colors text-sm"
            >
              <Phone size={16} />
              <span>{siteConfig.contact.phone}</span>
            </a>

            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 hover:text-secondary-cyan transition-colors text-sm"
            >
              <Mail size={16} />
              <span>{siteConfig.contact.email}</span>
            </a>
          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-4 text-white ml-4">
            <button className="hover:text-secondary-cyan transition-colors flex items-center gap-1 text-sm no-select">
              <Globe size={14} />
              <span>ES</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href={siteConfig.social.facebook}
                className="hover:text-secondary-cyan transition-colors no-select"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href={siteConfig.social.instagram}
                className="hover:text-secondary-cyan transition-colors no-select"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href={siteConfig.social.twitter}
                className="hover:text-secondary-cyan transition-colors no-select"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}