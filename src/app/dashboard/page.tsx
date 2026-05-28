"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGaarlandz } from "@/context/GaarlandzContext";
import { 
  Sparkles, 
  Clock, 
  CheckSquare, 
  Square, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Calendar,
  Users,
  IndianRupee,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from "lucide-react";

export default function HostPlannerDashboard() {
  const router = useRouter();
  const { bookings, spaces, updateBookingChecklist } = useGaarlandz();

  const [activeBooking, setActiveBooking] = useState<any | null>(null);

  // Loader
  useEffect(() => {
    const active = bookings.find(b => b.status !== "Completed" && b.status !== "Cancelled") 
                   || bookings[0];
    if (active) {
      setActiveBooking(active);
    }
  }, [bookings]);

  // Compute countdown timer
  const calculateDaysLeft = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date("2026-05-27"); // locked reference
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysRemaining = activeBooking ? calculateDaysLeft(activeBooking.date) : 35;
  const activeSpaces = activeBooking ? spaces.filter(s => (activeBooking.spaceId || "").split(",").includes(s.id)) : [spaces[0]];
  const activeSpace = {
    ...(activeSpaces[0] || spaces[0]),
    name: activeSpaces.map(s => s.name).join(" + ") || (spaces[0]?.name || "")
  };

  const handleChecklistToggle = (taskId: string, currentVal: boolean) => {
    if (!activeBooking) return;
    updateBookingChecklist(activeBooking.id, taskId, !currentVal);
  };

  const handleDownloadInvoice = () => {
    if (!activeBooking) return;
    alert(`Downloaded invoice file: invoice_${activeBooking.id}.pdf\nSecured total amount: ₹${activeBooking.pricing.total.toLocaleString()}`);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-white)", minHeight: "90vh", padding: "80px 0" }}>
      <div className="container">
        
        {activeBooking ? (
          <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* Header Portal Intro */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px"
            }}>
              <div>
                <span className="floral-badge" style={{ marginBottom: "8px" }}>
                  <Heart size={12} color="var(--accent-yellow-metallic)" /> Host Planner Dashboard
                </span>
                <h2 style={{ fontSize: "2.4rem" }}>{activeBooking.customerName}'s Celebration Dashboard</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Plan details, track checklist tasks, and download balance sheets.
                </p>
              </div>
              <div className="glass-panel" style={{
                padding: "10px 20px",
                border: "1px solid var(--accent-yellow-metallic)",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "var(--primary-black-dark)"
              }}>
                Secured Booking ID: {activeBooking.id}
              </div>
            </div>

            {/* Top row: Countdown dials + Venue spec summaries */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "32px"
            }}>
              {/* Countdown Dial Card */}
              <div className="luxury-card" style={{
                backgroundColor: "var(--primary-black-dark)",
                color: "var(--bg-cream)",
                display: "flex",
                alignItems: "center",
                gap: "28px",
                padding: "32px",
                border: "1px solid var(--accent-yellow-metallic)"
              }}>
                <div style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "4px solid var(--accent-yellow-metallic)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-gold)",
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--accent-yellow-gold)", lineHeight: "1" }}>
                    {daysRemaining}
                  </span>
                  <span style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "rgba(250, 249, 245, 0.8)", fontWeight: "600" }}>Days</span>
                </div>
                <div>
                  <span style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.155em",
                    color: "var(--accent-yellow-metallic)",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px"
                  }}>Time Until Celebration</span>
                  <h3 style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "8px" }}>The Big Milestone</h3>
                  <p style={{ fontSize: "0.8rem", color: "rgba(250, 249, 245, 0.75)" }}>
                    Date: {activeBooking.date} ({activeBooking.sessionTime} Session).
                  </p>
                </div>
              </div>

              {/* Venue Specs summary */}
              <div className="luxury-card" style={{ display: "flex", gap: "20px", padding: "24px", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
                <img 
                  src={activeSpace?.image} 
                  alt={activeSpace?.name} 
                  style={{ width: "120px", height: "100%", borderRadius: "16px", objectFit: "cover" }}
                />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--accent-yellow-metallic)", fontWeight: "600" }}>Secured Space</span>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{activeSpace?.name}</h4>
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Users size={12} /> {activeBooking.guestCount} Guests</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Calendar size={12} /> {activeBooking.eventType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist + Invoices Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px"
            }}>
              {/* Bride & Groom Planning Checklist */}
              <div className="luxury-card" style={{ padding: "32px", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(229, 169, 16, 0.2)", paddingBottom: "12px", marginBottom: "24px" }}>
                  <CheckSquare size={20} color="var(--accent-yellow-metallic)" />
                  <h3 style={{ fontSize: "1.2rem" }}>Milestone Checklist</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {activeBooking.checklist?.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id, item.completed)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(229, 169, 16, 0.1)",
                        backgroundColor: item.completed ? "var(--bg-soft-beige)" : "var(--bg-white)",
                        cursor: "pointer",
                        transition: "all 0.3s"
                      }}
                    >
                      {item.completed ? (
                        <CheckSquare size={20} color="var(--accent-yellow-metallic)" />
                      ) : (
                        <Square size={20} color="var(--accent-yellow-metallic)" />
                      )}
                      <span style={{
                        fontSize: "0.85rem",
                        textDecoration: item.completed ? "line-through" : "none",
                        color: item.completed ? "var(--text-muted)" : "var(--text-dark)",
                        fontWeight: item.completed ? "400" : "500"
                      }}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice details sheet */}
              <div className="luxury-card" style={{ padding: "32px", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(229, 169, 16, 0.2)", paddingBottom: "12px", marginBottom: "24px" }}>
                  <Sparkles size={20} color="var(--accent-yellow-metallic)" />
                  <h3 style={{ fontSize: "1.2rem" }}>Payment Milestone Summary</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    backgroundColor: "var(--bg-cream)",
                    padding: "12px 16px",
                    borderRadius: "12px"
                  }}>
                    <span style={{ color: "var(--text-muted)" }}>Total Event Invoice:</span>
                    <strong style={{ color: "var(--primary-black-dark)" }}>₹{activeBooking.pricing.total.toLocaleString()}</strong>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    backgroundColor: "var(--accent-yellow-light)",
                    color: "var(--primary-black-dark)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(229, 169, 16, 0.2)"
                  }}>
                    <span style={{ fontWeight: "600" }}>Secured Booking Advance:</span>
                    <strong style={{ display: "flex", alignItems: "center" }}>
                      <ShieldCheck size={14} style={{ marginRight: "4px" }} />
                      ₹{activeBooking.pricing.advancePaid.toLocaleString()}
                    </strong>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    backgroundColor: "#FCE8E6",
                    color: "#A8352A",
                    padding: "12px 16px",
                    borderRadius: "12px"
                  }}>
                    <span style={{ fontWeight: "600" }}>Remaining Milestone Due:</span>
                    <strong>₹{activeBooking.pricing.remainingBalance.toLocaleString()}</strong>
                  </div>

                  <button 
                    onClick={handleDownloadInvoice}
                    className="luxury-btn" 
                    style={{ width: "100%", marginTop: "12px" }}
                  >
                    <Download size={16} /> Download Signed Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Support section & Estate Coordinates */}
            <div className="luxury-card" style={{ padding: "32px", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Dedicated Venue Concierge</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px"
              }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <Phone size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Property Coordinator</span>
                    <a href="tel:8012700700" style={{ fontSize: "0.9rem", fontWeight: "600" }}>+91 80127 00700</a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <Mail size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Operations Email</span>
                    <a href="mailto:v4.gaarlandz@gmail.com" style={{ fontSize: "0.9rem", fontWeight: "600" }}>v4.gaarlandz@gmail.com</a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <MapPin size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Coimbatore Office</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Mettupalayam Road, Coimbatore</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="luxury-card" style={{ padding: "40px", textAlign: "center", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
            <Sparkles size={48} color="var(--accent-yellow-metallic)" style={{ margin: "0 auto 16px auto" }} />
            <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>No Active Bookings Secured</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "500px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
              Secure your magical date first. Open our multi-step celebration wizard to reserve a space or consult our venue experts.
            </p>
            <button onClick={() => router.push("/")} className="luxury-btn">
              Go to Celebration Wizard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
