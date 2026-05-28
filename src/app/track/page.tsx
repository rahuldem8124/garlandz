"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGaarlandz } from "@/context/GaarlandzContext";
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Heart,
  Phone,
  ShieldAlert,
  ArrowRight,
  Clock
} from "lucide-react";

// The full 8-step pipeline
const WORKFLOW_STEPS = [
  { status: "Inquiry", label: "Inquiry Submitted", desc: "milestone options received" },
  { status: "Callback", label: "Callback Scheduled", desc: "aligning custom decor packages" },
  { status: "Confirmed", label: "Date Secured", desc: "advance deposit verified" },
  { status: "Decor Planning", label: "Decor Team Active", desc: "stage themes finalized" },
  { status: "Photography", label: "Photography Confirmed", desc: "sunset grids mapped" },
  { status: "Food Finalized", label: "Menu Curated", desc: "buffet lines set" },
  { status: "Event Day", label: "Celebration Day", desc: "welcome to the garden" },
  { status: "Completed", label: "Milestone Completed", desc: "timeless album stored" }
];

export default function TrackBooking() {
  return (
    <React.Suspense fallback={
      <div style={{ backgroundColor: "var(--bg-white)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ color: "var(--primary-black-dark)", fontFamily: "var(--font-serif)" }}>Loading Gaarlandz Engine...</h3>
      </div>
    }>
      <TrackBookingContent />
    </React.Suspense>
  );
}

function TrackBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, spaces } = useGaarlandz();

  const [searchId, setSearchId] = useState("");
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const idParam = searchParams.get("id");

  useEffect(() => {
    if (idParam) {
      setSearchId(idParam);
      const found = bookings.find(b => b.id.toLowerCase() === idParam.toLowerCase());
      if (found) {
        setActiveBooking(found);
        setErrorMsg("");
      } else {
        setActiveBooking(null);
        setErrorMsg(`Booking ID "${idParam}" not found. Try searching GAAR1024 or GAAR1025.`);
      }
    }
  }, [idParam, bookings]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    router.push(`/track?id=${searchId}`);
  };

  const getStepIndex = (statusStr: string) => {
    switch (statusStr) {
      case "Inquiry": return 0;
      case "Callback": return 1;
      case "Confirmed": return 2;
      case "Decor Planning": return 3;
      case "Photography": return 4;
      case "Food Finalized": return 5;
      case "Event Day": return 6;
      case "Completed": return 7;
      default: return 2;
    }
  };

  const currentStepIdx = activeBooking ? getStepIndex(activeBooking.status) : 0;

  return (
    <div style={{ backgroundColor: "var(--bg-white)", minHeight: "80vh", padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Search Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.2em", color: "var(--accent-yellow-metallic)", textTransform: "uppercase", fontWeight: "600" }}>Live Operations Tracking</span>
          <h2 style={{ fontSize: "2.4rem", marginTop: "10px", marginBottom: "20px" }}>Track Celebration Pipeline</h2>
          <div className="gold-divider" style={{ maxWidth: "200px", margin: "0 auto", marginBottom: "32px" }} />

          <form onSubmit={handleSearchSubmit} style={{
            display: "flex",
            maxWidth: "500px",
            margin: "0 auto",
            gap: "12px"
          }}>
            <input 
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID (e.g. GAAR1024)"
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: "50px",
                border: "1px solid var(--accent-yellow-metallic)",
                backgroundColor: "var(--bg-white)",
                boxShadow: "var(--shadow-premium)",
                fontSize: "1rem",
                fontFamily: "var(--font-sans)",
                outline: "none"
              }}
            />
            <button type="submit" className="luxury-btn" style={{ padding: "0 28px" }}>
              <Search size={16} /> Search
            </button>
          </form>

          {errorMsg && (
            <div style={{
              color: "var(--status-booked)",
              fontSize: "0.85rem",
              marginTop: "16px",
              fontWeight: "600"
            }}>
              {errorMsg}
            </div>
          )}
        </div>

        {activeBooking ? (
          <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Celebration Metadata Card */}
            <div className="luxury-card" style={{ padding: "32px", backgroundColor: "var(--bg-white)", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(229, 169, 16, 0.2)",
                paddingBottom: "16px",
                marginBottom: "24px"
              }}>
                <div>
                  <span className="floral-badge" style={{ marginBottom: "8px" }}>GAARLANDZ HOSTING</span>
                  <h3 style={{ fontSize: "1.6rem" }}>{activeBooking.customerName}'s {activeBooking.eventType}</h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Session Time Slot: <strong>{activeBooking.sessionTime}</strong>
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", display: "block" }}>Secured Booking ID</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--primary-black-dark)" }}>{activeBooking.id}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "24px"
              }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Calendar size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Date locked</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{activeBooking.date}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <MapPin size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Secured Venue Area</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                      {spaces.filter(s => (activeBooking.spaceId || "").split(",").includes(s.id)).map(s => s.name).join(" + ") || "Gaarlandz Area"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Users size={18} color="var(--accent-yellow-metallic)" />
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Expected scaling</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{activeBooking.guestCount} Guests</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PIPELINE PROGRESS BOARD - THEME LOCKED */}
            <div className="luxury-card" style={{ padding: "40px 32px", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
                <Heart size={18} color="var(--accent-yellow-metallic)" />
                <h3 style={{ fontSize: "1.2rem" }}>Celebration Progress Timeline</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "28px", position: "relative" }}>
                
                {/* Visual Line connecting items */}
                <div style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  width: "2px",
                  height: "calc(100% - 28px)",
                  backgroundColor: "var(--bg-soft-beige)",
                  zIndex: 0
                }} />
                
                <div style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  width: "2px",
                  height: `${(currentStepIdx / (WORKFLOW_STEPS.length - 1)) * 100}%`,
                  backgroundColor: "var(--accent-yellow-metallic)",
                  zIndex: 1,
                  transition: "height 0.6s ease-in-out"
                }} />

                {/* Individual workflow steps */}
                {WORKFLOW_STEPS.map((step, idx) => {
                  const isCurrent = idx === currentStepIdx;
                  const isCompleted = idx < currentStepIdx;
                  
                  return (
                    <div key={idx} style={{
                      display: "flex",
                      gap: "20px",
                      position: "relative",
                      zIndex: 5,
                      alignItems: "flex-start",
                      animation: `slowFadeReveal ${0.3 + idx * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`
                    }}>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: isCompleted || isCurrent ? "var(--primary-black-dark)" : "var(--bg-white)",
                        border: `2px solid ${isCurrent ? "var(--accent-yellow-gold)" : isCompleted ? "var(--accent-yellow-metallic)" : "var(--bg-soft-beige)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isCompleted || isCurrent ? "var(--accent-yellow-gold)" : "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        boxShadow: isCurrent ? "var(--shadow-gold)" : "none",
                        transition: "all 0.4s"
                      }}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>

                      <div style={{
                        backgroundColor: isCurrent ? "var(--accent-yellow-light)" : "transparent",
                        padding: isCurrent ? "16px 20px" : "0",
                        borderRadius: "16px",
                        border: isCurrent ? "1px solid rgba(229, 169, 16, 0.25)" : "1px solid transparent",
                        flex: 1
                      }}>
                        <h4 style={{
                          fontSize: "1.05rem",
                          color: isCurrent ? "var(--primary-black-dark)" : isCompleted ? "var(--text-dark)" : "var(--text-muted)",
                          fontWeight: isCurrent ? "700" : "500",
                          margin: "0"
                        }}>
                          {step.label}
                          {isCurrent && (
                            <span className="floral-badge" style={{ fontSize: "0.55rem", padding: "2px 6px", marginLeft: "10px", verticalAlign: "middle" }}>
                              Active Stage
                            </span>
                          )}
                        </h4>
                        <p style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          textTransform: "capitalize"
                        }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dashboard Link Shortcut */}
            <div className="glass-panel" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 32px",
              border: "1px solid var(--accent-yellow-metallic)"
            }}>
              <div>
                <h4 style={{ color: "var(--primary-black-dark)", fontSize: "1.1rem", marginBottom: "4px" }}>Bride & Groom Checklist</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0" }}>Access your countdown timer and interactive planning checklists.</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard`)}
                className="luxury-btn" 
                style={{ padding: "10px 20px", fontSize: "0.75rem" }}
              >
                Open Host Planner <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Initial Empty state guide cards */
          <div className="luxury-card" style={{ padding: "40px", textAlign: "center", border: "1px solid rgba(229, 169, 16, 0.25)" }}>
            <Heart size={48} color="var(--accent-yellow-metallic)" style={{ margin: "0 auto 16px auto" }} />
            <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Awaiting Host Query</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "500px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
              Please enter your customized Gaarlandz secure ID inside the tracking input search. 
              If you wish to inspect our template operations pipelines instantly, search:
            </p>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button 
                onClick={() => { setSearchId("GAAR1024"); router.push(`/track?id=GAAR1024`); }}
                className="luxury-btn-secondary" 
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                Demo Wedding (GAAR1024)
              </button>
              <button 
                onClick={() => { setSearchId("GAAR1025"); router.push(`/track?id=GAAR1025`); }}
                className="luxury-btn-secondary" 
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                Demo Corporate (GAAR1025)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
