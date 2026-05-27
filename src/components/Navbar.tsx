"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flower } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 40,
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(198, 161, 91, 0.35)",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
      padding: scrolled ? "12px 24px" : "16px 24px",
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0"
      }}>
        {/* LEFT: Logo Section */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #C6A15B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(198, 161, 91, 0.15)"
          }}>
            <Flower size={18} color="#C6A15B" />
          </div>
          <div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              fontWeight: "700",
              letterSpacing: "0.06em",
              color: "#171717",
              display: "block",
              lineHeight: 1
            }}>GAARLANDZ</span>
            <span style={{
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: "#5A5A5A",
              textTransform: "uppercase",
              fontWeight: "600",
              display: "block",
              marginTop: "2px"
            }}>Luxury Garden Venue Platform</span>
          </div>
        </Link>

        {/* CENTER: small muted text (Desktop Only) */}
        <div className="desktop-only" style={{
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "#5A5A5A",
          fontWeight: "500",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
          borderLeft: "1px solid rgba(198, 161, 91, 0.2)",
          borderRight: "1px solid rgba(198, 161, 91, 0.2)",
          padding: "0 20px"
        }}>
          100–1000 Guests • Weddings • Corporate • Celebrations
        </div>

        {/* RIGHT: Actions */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/admin-login">
            <button className="luxury-btn-outline">
              Admin Access
            </button>
          </Link>
          <Link href="/?tab=book">
            <button className="luxury-btn-primary">
              Book Venue
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .luxury-btn-primary {
          background-color: #171717;
          color: #FFFFFF;
          border: 1px solid #171717;
          border-radius: 16px;
          padding: 12px 24px;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .luxury-btn-primary:hover {
          background-color: #1f1f1f;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12), 0 0 0 4px rgba(198, 161, 91, 0.08);
        }
        .luxury-btn-outline {
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(198, 161, 91, 0.35);
          color: #171717;
          border-radius: 16px;
          padding: 12px 24px;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .luxury-btn-outline:hover {
          background-color: rgba(198, 161, 91, 0.12);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .luxury-btn-primary, .luxury-btn-outline {
            padding: 8px 14px;
            font-size: 0.7rem;
            border-radius: 12px;
          }
        }
      `}</style>
    </header>
  );
}
