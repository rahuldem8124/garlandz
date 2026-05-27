"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGaarlandz, VenueSpace, BookingService, Booking } from "@/context/GaarlandzContext";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Flower, 
  Sparkles, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText,
  AlertTriangle,
  X,
  Heart,
  TrendingUp,
  Award,
  BookOpen,
  Camera,
  ArrowRight,
  Download,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function GatewayPage() {
  return (
    <React.Suspense fallback={
      <div style={{ backgroundColor: "var(--bg-cream)", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ color: "#171717", fontFamily: "var(--font-serif)" }}>Loading Gaarlandz Engine...</h3>
      </div>
    }>
      <CelebrationGateway />
    </React.Suspense>
  );
}

function CelebrationGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    spaces, 
    additionalServices, 
    addBooking, 
    calculateDynamicPrice, 
    bookings
  } = useGaarlandz();

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("home");
    }
  }, [searchParams]);

  // Track code search input
  const [trackCodeInput, setTrackCodeInput] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [trackErrorMsg, setTrackErrorMsg] = useState("");

  // ==========================================
  // MOBILE-FIRST WIZARD STATES (DRAFT AUTOSAVE)
  // ==========================================
  const [wizardStep, setWizardStep] = useState(1);
  const [wizEvent, setWizEvent] = useState("Wedding");
  const [wizSpace, setWizSpace] = useState("open-wedding");
  const [wizGuests, setWizGuests] = useState(300);
  const [wizDate, setWizDate] = useState("");
  const [wizSession, setWizSession] = useState<"Morning" | "Evening" | "Full Day">("Morning");
  const [wizServices, setWizServices] = useState<string[]>([]);
  const [wizCustomReqs, setWizCustomReqs] = useState("");
  
  const [wizName, setWizName] = useState("");
  const [wizPhone, setWizPhone] = useState("");
  const [wizEmail, setWizEmail] = useState("");

  // Payment popup state
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [createdGaarId, setCreatedGaarId] = useState("");
  const [checkoutPath, setCheckoutPath] = useState<"payment" | "expert">("payment");

  // FAQ state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const activeSpaceObj = spaces.find(s => s.id === wizSpace) || spaces[0];
  const dynamicPricing = calculateDynamicPrice(wizSpace, wizDate, wizGuests, wizSession, wizServices);

  const handleWizServiceToggle = (srvId: string) => {
    setWizServices(wizServices.includes(srvId)
      ? wizServices.filter(id => id !== srvId)
      : [...wizServices, srvId]
    );
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutPath === "expert") {
      const res = addBooking({
        eventType: wizEvent,
        spaceId: wizSpace,
        guestCount: wizGuests,
        date: wizDate,
        sessionTime: wizSession,
        services: wizServices,
        customRequirements: wizCustomReqs,
        customerName: wizName,
        customerPhone: wizPhone,
        customerEmail: wizEmail
      }, false);

      if (res.success && res.bookingId) {
        setCreatedGaarId(res.bookingId);
        setWizardStep(8);
      } else {
        alert(res.error || "Conflict logged. Please try another date.");
      }
    } else {
      setRazorpayOpen(true);
    }
  };

  const handleDemoPaymentComplete = () => {
    const res = addBooking({
      eventType: wizEvent,
      spaceId: wizSpace,
      guestCount: wizGuests,
      date: wizDate,
      sessionTime: wizSession,
      services: wizServices,
      customRequirements: wizCustomReqs,
      customerName: wizName,
      customerPhone: wizPhone,
      customerEmail: wizEmail
    }, true);

    if (res.success && res.bookingId) {
      setCreatedGaarId("GAAR1026"); // Explicit ID request
      setRazorpayOpen(false);
      setWizardStep(8);
    } else {
      setRazorpayOpen(false);
      alert(res.error || "Payment completed but booking failed. Please try another date.");
    }
  };

  const handleTrackCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackErrorMsg("");
    if (!trackCodeInput) return;
    const found = bookings.find(b => b.id.toLowerCase() === trackCodeInput.trim().toLowerCase());
    if (found) {
      setSearchedBooking(found);
    } else {
      setSearchedBooking(null);
      setTrackErrorMsg(`Quotation/Booking reference ID "${trackCodeInput}" not found in Gaarlandz database. Try seed key GAAR1024.`);
    }
  };

  return (
    <div style={{ minHeight: "90vh", backgroundColor: "#FAF9F5", color: "#171717", fontFamily: "var(--font-sans)" }}>
      
      {/* ==============================================================
          1. HOME PAGE - BOOKING-ORIENTED STRUCTURE (EXACT 6 SECTIONS)
          ============================================================== */}
      {activeTab === "home" && (
        <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "80px", paddingBottom: "100px" }}>
          
          {/* SECTION 1: HERO SECTION */}
          <section style={{
            position: "relative",
            minHeight: "85vh",
            backgroundImage: "linear-gradient(rgba(20, 20, 20, 0.45), rgba(20, 20, 20, 0.65)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            padding: "80px 24px",
            textAlign: "center"
          }}>
            <div style={{ maxWidth: "800px", zIndex: 10 }}>
              <span className="floral-badge" style={{ marginBottom: "20px", backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#C6A15B", borderColor: "rgba(198, 161, 91, 0.4)" }}>
                <Sparkles size={12} color="#C6A15B" /> Luxury Garden Celebrations
              </span>
              <h1 style={{ 
                fontSize: "3.5rem", 
                color: "#FFFFFF", 
                lineHeight: "1.2", 
                marginBottom: "20px",
                fontFamily: "var(--font-serif)",
                fontWeight: "700" 
              }}>
                Luxury Garden Venue for Extraordinary Celebrations
              </h1>
              <p style={{ 
                fontSize: "1.15rem", 
                color: "#FAF9F5", 
                opacity: 0.95, 
                maxWidth: "640px", 
                margin: "0 auto 40px auto",
                letterSpacing: "0.02em"
              }}>
                Wedding • Corporate • Reception • Engagement • Family Celebrations
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "60px" }}>
                <button onClick={() => router.push("/?tab=book")} className="luxury-btn" style={{ backgroundColor: "#171717", borderColor: "#171717", borderRadius: "16px", padding: "14px 28px" }}>
                  Book Venue
                </button>
                <button onClick={() => router.push("/?tab=track")} className="luxury-btn-secondary" style={{ borderColor: "#FFFFFF", color: "#FFFFFF", borderRadius: "16px", padding: "14px 28px" }}>
                  Track Booking
                </button>
              </div>

              {/* Floating Stat tiles */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                maxWidth: "600px",
                margin: "0 auto",
                borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                paddingTop: "32px"
              }}>
                <div>
                  <strong style={{ fontSize: "2.4rem", display: "block", color: "#C6A15B", fontFamily: "var(--font-serif)" }}>500+</strong>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FAF9F5" }}>Events Completed</span>
                </div>
                <div>
                  <strong style={{ fontSize: "2.4rem", display: "block", color: "#C6A15B", fontFamily: "var(--font-serif)" }}>100–1000</strong>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FAF9F5" }}>Guests Capacity</span>
                </div>
                <div>
                  <strong style={{ fontSize: "2.4rem", display: "block", color: "#C6A15B", fontFamily: "var(--font-serif)" }}>4.9 ★</strong>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FAF9F5" }}>Luxury Rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: VENUE QUICK HIGHLIGHTS (6 CARDS ONLY) */}
          <section className="container" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "40px" }}>
              <span className="floral-badge">Our Premium Spaces</span>
              <h2 style={{ fontSize: "2.2rem", marginTop: "12px", fontFamily: "var(--font-serif)" }}>Signature Venue Highlights</h2>
              <div style={{ width: "80px", height: "2px", backgroundColor: "#C6A15B", margin: "16px auto" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
              {[
                { title: "Open Wedding Venue", cap: "100–1000 Guests", price: "₹1,50,000", avail: "Available", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600" },
                { title: "Corporate Meeting Hall", cap: "50–300 Guests", price: "₹80,000", avail: "Available", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600" },
                { title: "Food Court / Mini Hall", cap: "100–400 Guests", price: "₹70,000", avail: "Available", img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600" },
                { title: "Kids Play Area", cap: "Up to 150 Kids", price: "₹30,000", avail: "Available", img: "https://images.unsplash.com/photo-1571844307560-f55a55956a30?auto=format&fit=crop&q=80&w=600" },
                { title: "Photo Shoot Spots", cap: "Photography Crews", price: "₹40,000", avail: "Available", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" },
                { title: "Luxury Bride/Groom Suites", cap: "Royal Accommodations", price: "₹25,000", avail: "Available", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600" }
              ].map((card, idx) => (
                <div key={idx} className="luxury-card" style={{ display: "flex", flexDirection: "column", padding: "0", overflow: "hidden", textAlign: "left" }}>
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: "1" }}>
                    <h3 style={{ fontSize: "1.25rem", color: "#171717", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>{card.title}</h3>
                    <div style={{ height: "1px", backgroundColor: "rgba(198, 161, 91, 0.35)", margin: "12px 0" }} />
                    <div style={{ display: "flex", justifySelf: "space-between", fontSize: "0.8rem", color: "#5A5A5A", marginBottom: "20px" }}>
                      <span>Cap: <strong>{card.cap}</strong></span>
                      <span>From: <strong style={{ color: "#C6A15B" }}>{card.price}</strong></span>
                    </div>
                    <button onClick={() => router.push("/?tab=book")} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                      Book Space
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: AVAILABLE EXPERIENCES */}
          <section style={{ backgroundColor: "#F8F5EE", padding: "80px 0", textAlign: "center" }}>
            <div className="container">
              <span className="floral-badge">Tailored Galas</span>
              <h2 style={{ fontSize: "2.2rem", marginTop: "12px", fontFamily: "var(--font-serif)" }}>Available Experiences</h2>
              <div style={{ width: "80px", height: "2px", backgroundColor: "#C6A15B", margin: "16px auto 40px auto" }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                {[
                  { title: "Grand Royal Weddings", desc: "Bespoke traditional mandap decors, sunset trails, and comprehensive catering orchestration." },
                  { title: "Elite Corporate Summits", desc: "Premium acoustic halls, corporate banquets, high-speed projector setup." },
                  { title: "Elegant Sunset Receptions", desc: "Stunning evening lights, live violin/DJ, sparkling celebratory fireworks." }
                ].map((exp, idx) => (
                  <div key={idx} className="luxury-card" style={{ textAlign: "left", borderTop: "4px solid #C6A15B" }}>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "8px", fontFamily: "var(--font-serif)", color: "#171717" }}>{exp.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#5A5A5A" }}>{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: AMENITIES */}
          <section className="container" style={{ textAlign: "center" }}>
            <span className="floral-badge">Premium Comforts</span>
            <h2 style={{ fontSize: "2.2rem", marginTop: "12px", fontFamily: "var(--font-serif)" }}>Curated Guest Amenities</h2>
            <div style={{ width: "80px", height: "2px", backgroundColor: "#C6A15B", margin: "16px auto 40px auto" }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
              {[
                { title: "VIP Valet Parking", desc: "Secure multi-slot premium valet allocations." },
                { title: "Vanity Dressing Lounges", desc: " opulently prepared 5-star changing suites." },
                { title: "Attended Nursery Play", desc: "Fully supervised secure childrens zone." },
                { title: "Acoustic DJ & Live Sound", desc: "High fidelity professional sounds system." }
              ].map((am, idx) => (
                <div key={idx} className="luxury-card" style={{ padding: "24px" }}>
                  <Heart size={20} color="#C6A15B" style={{ marginBottom: "12px" }} />
                  <h4 style={{ fontSize: "1.05rem", marginBottom: "6px", fontFamily: "var(--font-serif)" }}>{am.title}</h4>
                  <p style={{ fontSize: "0.75rem", color: "#5A5A5A" }}>{am.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: BOOKING CTA */}
          <section style={{
            backgroundImage: "linear-gradient(rgba(20, 20, 20, 0.6), rgba(20, 20, 20, 0.8)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "100px 24px",
            color: "#FFFFFF",
            textAlign: "center"
          }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", marginBottom: "16px" }}>Reserve Your Historic Date</h2>
              <p style={{ fontSize: "1rem", color: "#FAF9F5", opacity: 0.9, marginBottom: "32px" }}>
                Our dynamic scheduling system allows secure online booking lock and invoice splits configuration instantly.
              </p>
              <button onClick={() => router.push("/?tab=book")} className="luxury-btn-primary" style={{ display: "inline-flex", alignSelf: "center" }}>
                Book Venue Now
              </button>
            </div>
          </section>

          {/* SECTION 6: FAQ ACCORDION */}
          <section className="container" style={{ maxWidth: "720px", textAlign: "left" }}>
            <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", textAlign: "center", marginBottom: "40px" }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { q: "What is the maximum guest capacity at Gaarlandz?", a: "Gaarlandz can comfortably host from 100 up to 1000 guests across our grand open amphitheater and dining corridor spaces." },
                { q: "Can we customize our decoration and food packages?", a: "Absolutely! Step 5 of our Booking Wizard lets you select premium catering tiers, customized mandap layouts, and drone cinematic packages on-demand." },
                { q: "Is there a secure advance payment option?", a: "Yes, you can secure your date lock instantly with a simulated ₹50,000 deposit sandbox. The remaining balance splits are managed transparently from the admin ledger." }
              ].map((faq, idx) => (
                <div key={idx} className="luxury-card" style={{ padding: "20px", cursor: "pointer" }} onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}>
                  <div style={{ display: "flex", justifySelf: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{faq.q}</strong>
                    <span style={{ color: "#C6A15B", fontWeight: "700" }}>{faqOpenIndex === idx ? "−" : "+"}</span>
                  </div>
                  {faqOpenIndex === idx && (
                    <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "#5A5A5A", lineHeight: "1.6" }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* ==============================================================
          2. BOOKING WIZARD TAB (MOBILE-FIRST 7-STEPS CODES)
          ============================================================== */}
      {activeTab === "book" && (
        <div className="container fade-in-reveal" style={{ padding: "40px 0", maxWidth: "600px" }}>
          
          <div className="luxury-card" style={{ padding: "32px 24px", border: "1px solid rgba(198, 161, 91, 0.35)", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifySelf: "space-between", marginBottom: "20px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "12px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>Royal Celebration Booking</span>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#C6A15B" }}>Step {wizardStep} of 7</span>
            </div>

            <form onSubmit={handleWizardSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* STEP 1: EVENT TYPE */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Select Event Milestone</h4>
                  {["Wedding", "Reception", "Corporate", "Engagement", "Birthday", "Custom"].map(ev => (
                    <div 
                      key={ev} 
                      onClick={() => setWizEvent(ev)}
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        border: wizEvent === ev ? "2px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)",
                        backgroundColor: wizEvent === ev ? "rgba(198, 161, 91, 0.08)" : "#FFFFFF",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {ev} Event
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: VENUE AREA */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Select Signature Venue Space</h4>
                  {spaces.map(sp => (
                    <div 
                      key={sp.id} 
                      onClick={() => setWizSpace(sp.id)}
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        border: wizSpace === sp.id ? "2px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)",
                        backgroundColor: wizSpace === sp.id ? "rgba(198, 161, 91, 0.08)" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center"
                      }}
                    >
                      <img src={sp.image} alt="" style={{ width: "60px", height: "44px", borderRadius: "8px", objectFit: "cover" }} />
                      <div style={{ textAlign: "left" }}>
                        <strong style={{ fontSize: "0.85rem", display: "block" }}>{sp.name}</strong>
                        <span style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>Price: ₹{sp.basePrice.toLocaleString()} | Capacity: {sp.capacity} Guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: GUEST SLIDER */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Expected Guests Count</h4>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    value={wizGuests} 
                    onChange={(e) => setWizGuests(parseInt(e.target.value))} 
                    style={{ width: "100%", accentColor: "#171717" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                    <span>100 Guests</span>
                    <span style={{ color: "#C6A15B", fontSize: "1.2rem" }}>{wizGuests} Expected Guests</span>
                    <span>1000 Guests</span>
                  </div>
                </div>
              )}

              {/* STEP 4: DATE & SESSION */}
              {wizardStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Schedule Lock Date & Session</h4>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Session Time Slot</label>
                    <select 
                      value={wizSession} 
                      onChange={(e) => setWizSession(e.target.value as any)} 
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }}
                    >
                      <option value="Morning">Morning Session (6:00 AM - 2:00 PM)</option>
                      <option value="Evening">Evening Sunset Gala (4:00 PM - 11:30 PM)</option>
                      <option value="Full Day">Full Day Grand Celebration</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Target Lock Date</label>
                    <input 
                      type="date" 
                      required
                      value={wizDate} 
                      onChange={(e) => setWizDate(e.target.value)} 
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: ADDITIONAL SERVICES */}
              {wizardStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Append Custom Services</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {additionalServices.map(srv => (
                      <div 
                        key={srv.id}
                        onClick={() => handleWizServiceToggle(srv.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "12px",
                          border: wizServices.includes(srv.id) ? "2px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)",
                          backgroundColor: wizServices.includes(srv.id) ? "rgba(198, 161, 91, 0.08)" : "#FFFFFF",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{srv.name}</span>
                        <span style={{ fontSize: "0.8rem", color: "#C6A15B", fontWeight: "700" }}>
                          {srv.isPerGuest ? `₹${srv.price}/Guest` : `₹${srv.price.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: REQUIREMENTS & CONTACT */}
              {wizardStep === 6 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Bespoke Requests & Customer Info</h4>
                  <textarea 
                    value={wizCustomReqs} 
                    onChange={(e) => setWizCustomReqs(e.target.value)} 
                    placeholder="Describe stage floral themes, specialized decorators, culinary briefs..." 
                    style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}
                  />
                  <input type="text" required placeholder="Full Name" value={wizName} onChange={(e) => setWizName(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }} />
                  <input type="tel" required placeholder="Phone Number" value={wizPhone} onChange={(e) => setWizPhone(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }} />
                  <input type="email" required placeholder="Email Address" value={wizEmail} onChange={(e) => setWizEmail(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }} />
                </div>
              )}

              {/* STEP 7: CHECKOUT */}
              {wizardStep === 7 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>Bespoke Invoice Splits Summary</h4>
                  <div style={{ backgroundColor: "#F8F5EE", padding: "20px", borderRadius: "16px", border: "1px solid #C6A15B", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>Base space layout:</span>
                      <strong>₹{dynamicPricing.basePrice.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>Appendix/Custom services:</span>
                      <strong>₹{dynamicPricing.servicesCost.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "8px", marginBottom: "8px" }}>
                      <span>18% Government GST:</span>
                      <strong>₹{dynamicPricing.tax.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "700", color: "#171717", marginTop: "10px" }}>
                      <span>Subtotal Invoice Amount:</span>
                      <span>₹{dynamicPricing.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button type="submit" onClick={() => setCheckoutPath("payment")} className="luxury-btn-primary" style={{ justifyContent: "center" }}>Secure Lock with Deposit (₹50,000)</button>
                    <button type="submit" onClick={() => setCheckoutPath("expert")} className="luxury-btn-secondary" style={{ justifyContent: "center" }}>Direct Callback Inquiry</button>
                  </div>
                </div>
              )}

              {/* STEP 8: SUCCESS DISPLAY */}
              {wizardStep === 8 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(40,167,69,0.1)", color: "#28A745", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", marginBottom: "16px" }}>✔</div>
                  <h3 style={{ fontSize: "1.5rem", color: "#171717", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>Celebration Locked Successfully!</h3>
                  <p style={{ fontSize: "0.85rem", color: "#5A5A5A", marginBottom: "24px" }}>Your reservation holds reference ID: <strong>{createdGaarId}</strong>. Digital contracts dispatched successfully.</p>
                  
                  <div style={{ display: "flex", justifySelf: "center", gap: "10px" }}>
                    <button type="button" onClick={() => { setActiveTab("track"); setTrackCodeInput(createdGaarId); setWizardStep(1); }} className="luxury-btn-primary" style={{ padding: "8px 16px" }}>Track Booking</button>
                    <button type="button" onClick={() => { setActiveTab("home"); setWizardStep(1); }} className="luxury-btn-secondary" style={{ padding: "8px 16px" }}>Back Home</button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* STICKY BOTTOM CONTROL CTA BAR */}
          {wizardStep < 8 && (
            <div style={{
              position: "sticky",
              bottom: "20px",
              backgroundColor: "#FFFFFF",
              padding: "16px 24px",
              borderRadius: "16px",
              border: "1px solid rgba(198, 161, 91, 0.35)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}>
              <button 
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="luxury-btn-secondary" 
                style={{ padding: "8px 16px", fontSize: "0.7rem", opacity: wizardStep === 1 ? 0.3 : 1 }}
              >
                Back
              </button>
              
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.6rem", color: "#5A5A5A", display: "block" }}>Dynamic Estimate Subtotal</span>
                <strong style={{ fontSize: "1rem", color: "#C6A15B" }}>₹{dynamicPricing.total.toLocaleString()}</strong>
              </div>

              {wizardStep < 7 ? (
                <button 
                  onClick={() => {
                    if (wizardStep === 4 && !wizDate) {
                      alert("Select a date lock first.");
                      return;
                    }
                    setWizardStep(wizardStep + 1);
                  }}
                  className="luxury-btn-primary" 
                  style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                >
                  Continue
                </button>
              ) : (
                <span style={{ fontSize: "0.65rem", fontWeight: "700" }}>Check path above</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==============================================================
          3. TRACK BOOKING PIPELINE TAB
          ============================================================== */}
      {activeTab === "track" && (
        <div className="container fade-in-reveal" style={{ padding: "80px 0", maxWidth: "600px", textAlign: "center" }}>
          <span className="floral-badge">Live pipeline tracker</span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "12px", marginBottom: "32px", fontFamily: "var(--font-serif)" }}>Track Celebration Pipeline</h2>

          <form onSubmit={handleTrackCodeSearch} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
            <input 
              type="text" 
              required
              value={trackCodeInput}
              onChange={(e) => setTrackCodeInput(e.target.value)}
              placeholder="Enter Quote/Booking ID (e.g. GAAR1024)"
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: "30px",
                border: "1px solid rgba(198, 161, 91, 0.35)",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
            <button type="submit" className="luxury-btn-primary">Search Status</button>
          </form>

          {trackErrorMsg && <p style={{ color: "#F44336", fontSize: "0.85rem", fontWeight: "600", marginBottom: "24px" }}>{trackErrorMsg}</p>}

          {searchedBooking && (
            <div className="luxury-card" style={{ textAlign: "left" }}>
              <div style={{ borderBottom: "1px solid rgba(198, 161, 91, 0.25)", paddingBottom: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ fontSize: "1.2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>{searchedBooking.customerName}'s {searchedBooking.eventType}</h4>
                  <span style={{ fontSize: "0.75rem", color: "#5A5A5A" }}>Lock Date: {searchedBooking.date} | Session: {searchedBooking.sessionTime}</span>
                </div>
                <span className="floral-badge" style={{ alignSelf: "flex-start" }}>{searchedBooking.id}</span>
              </div>

              {/* Steps indicators */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {["Inquiry", "Confirmed", "Decor Planning", "Event Preparation", "Completed"].map((statusStep, stepIdx) => {
                  const currentStatusIdx = ["Inquiry", "Confirmed", "Decor Planning", "Event Preparation", "Completed"].indexOf(searchedBooking.status);
                  const isDone = currentStatusIdx >= stepIdx;
                  return (
                    <div key={statusStep} style={{ display: "flex", alignItems: "center", gap: "14px", opacity: isDone ? 1 : 0.4 }}>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: isDone ? "#171717" : "rgba(198, 161, 91, 0.08)",
                        color: isDone ? "#fff" : "#171717",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: "700"
                      }}>
                        {isDone ? "✔" : stepIdx + 1}
                      </div>
                      <div>
                        <strong style={{ fontSize: "0.85rem" }}>{statusStep}</strong>
                        <span style={{ fontSize: "0.65rem", color: "#5A5A5A", display: "block" }}>{isDone ? "Step completed successfully." : "Awaiting operational pipeline phase."}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==============================================================
          4. RAZORPAY DEMO SANDBOX MODAL OVERLAY
          ============================================================== */}
      {razorpayOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div className="luxury-card" style={{ maxWidth: "400px", width: "100%", padding: "32px", border: "2px solid #C6A15B", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", justifySelf: "end", marginBottom: "8px" }}>
              <button onClick={() => setRazorpayOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <ShieldCheck size={36} color="#C6A15B" style={{ margin: "0 auto 10px auto" }} />
              <h4 style={{ fontSize: "1.2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Razorpay Demo Sandbox</h4>
              <p style={{ fontSize: "0.75rem", color: "#5A5A5A" }}>Secure customer deposit transaction simulation</p>
            </div>

            <div style={{ backgroundColor: "#FAF9F5", padding: "16px", borderRadius: "12px", border: "1px solid rgba(198,161,89,0.2)", marginBottom: "24px", fontSize: "0.8rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifySelf: "space-between", marginBottom: "6px" }}>
                <span>Selected Space:</span>
                <strong>{activeSpaceObj.name}</strong>
              </div>
              <div style={{ display: "flex", justifySelf: "space-between", fontSize: "0.95rem", color: "#171717", fontWeight: "700" }}>
                <span>Advance deposit required:</span>
                <span>₹50,000.00</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={handleDemoPaymentComplete} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Simulate UPI Payment</button>
              <button onClick={handleDemoPaymentComplete} className="luxury-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Simulate Card Payment</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
