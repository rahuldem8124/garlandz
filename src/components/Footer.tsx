"use client";

import React from "react";
import Link from "next/link";
import { Flower, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--primary-black-dark)",
      color: "var(--bg-cream)",
      borderTop: "2px solid var(--accent-yellow-metallic)",
      padding: "80px 0 40px 0",
      fontFamily: "var(--font-sans)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Soft background glow decoration */}
      <div style={{
        position: "absolute",
        bottom: "-50px",
        right: "-50px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        backgroundColor: "rgba(229, 169, 16, 0.05)",
        filter: "blur(40px)",
        pointerEvents: "none"
      }} />

      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px",
          marginBottom: "60px"
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-cream)",
                border: "1px solid var(--accent-yellow-metallic)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Flower size={18} color="var(--primary-black-dark)" />
              </div>
              <span style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.3rem",
                fontWeight: "600",
                letterSpacing: "0.05em",
                color: "var(--bg-white)"
              }}>GAARLANDZ</span>
            </div>
            <p style={{
              color: "rgba(250, 249, 245, 0.7)",
              fontSize: "0.9rem",
              lineHeight: "1.7",
              marginBottom: "24px"
            }}>
              Where Every Celebration Becomes Extraordinary. Experience the premium luxury sunset celebration & wedding venue grounds in Coimbatore. Crafted for magical milestones.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(229, 169, 16, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-yellow-gold)",
                transition: "all 0.3s"
              }} className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(229, 169, 16, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-yellow-gold)",
                transition: "all 0.3s"
              }} className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Platform Services Links */}
          <div>
            <h4 style={{
              color: "var(--bg-white)",
              fontSize: "1.1rem",
              marginBottom: "24px",
              fontFamily: "var(--font-serif)"
            }}>Platform Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Link href="/" style={{ color: "rgba(250, 249, 245, 0.8)", fontSize: "0.9rem" }} className="footer-link">
                Plan Celebration
              </Link>
              <Link href="/track" style={{ color: "rgba(250, 249, 245, 0.8)", fontSize: "0.9rem" }} className="footer-link">
                Track Live Booking
              </Link>
              <Link href="/dashboard" style={{ color: "rgba(250, 249, 245, 0.8)", fontSize: "0.9rem" }} className="footer-link">
                Host Planner Checklist
              </Link>
              <Link href="/admin" style={{ color: "rgba(250, 249, 245, 0.8)", fontSize: "0.9rem" }} className="footer-link">
                Celebration Calendar (Admin)
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{
              color: "var(--bg-white)",
              fontSize: "1.1rem",
              marginBottom: "24px",
              fontFamily: "var(--font-serif)"
            }}>Get In Touch</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", color: "rgba(250, 249, 245, 0.8)", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <MapPin size={18} color="var(--accent-yellow-metallic)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  Rakkipalayam pirivu bus stop,<br />
                  Mettupalayam Road,<br />
                  Coimbatore - 641031
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Phone size={16} color="var(--accent-yellow-metallic)" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <a href="tel:8012700700" style={{ color: "inherit" }} className="footer-link">+91 80127 00700</a>
                  <a href="tel:9843555700" style={{ color: "inherit" }} className="footer-link">+91 98435 55700</a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Mail size={16} color="var(--accent-yellow-metallic)" />
                <a href="mailto:v4.gaarlandz@gmail.com" style={{ color: "inherit" }} className="footer-link">v4.gaarlandz@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(250, 249, 245, 0.15)",
          paddingTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px"
        }}>
          <p style={{ fontSize: "0.8rem", color: "rgba(250, 249, 245, 0.5)" }}>
            © {new Date().getFullYear()} GAARLANDZ. All rights reserved. Built as a luxury operational platform.
          </p>
          <div style={{ display: "flex", gap: "24px", fontSize: "0.8rem", color: "rgba(250, 249, 245, 0.5)" }}>
            <span style={{ cursor: "pointer" }} className="footer-link">Privacy Policy</span>
            <span style={{ cursor: "pointer" }} className="footer-link">Terms of Service</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover {
          color: var(--accent-yellow-gold) !important;
          transform: translateX(4px);
        }
        .social-icon:hover {
          color: var(--primary-black-dark) !important;
          border-color: var(--accent-yellow-gold) !important;
          background-color: var(--accent-yellow-metallic);
          transform: translateY(-4px);
        }
      `}</style>
    </footer>
  );
}
