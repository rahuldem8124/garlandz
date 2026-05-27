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

// ==========================================
// CENTRALIZED EXPERIENTIAL EVENT THEMES
// ==========================================

export interface EventThemeConfig {
  title: string;
  mood: string;
  venue: string;
  atmosphere: string;
  previewImage: string;
  extras: string[];
  particles: "rose" | "confetti" | "geometric" | "fairy" | "cinematic" | "traditional" | "custom";
  subtotal: number;
  heroTitle: string;
  storyCopy: string;
  recommendedServices: string[];
  timeline: string[];
  testimonial: { quote: string; author: string };
  badgeText: string;
  previewDetails: string[];
}

export const CUSTOM_ATMOSPHERE_IMAGES: Record<string, string> = {
  Royal: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
  Modern: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
  Outdoor: "https://images.unsplash.com/photo-1507504038482-7622ab247f9e?auto=format&fit=crop&q=80&w=1200",
  Traditional: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200",
  Minimal: "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=1200"
};

export const EVENT_THEMES: Record<string, EventThemeConfig> = {
  wedding: {
    title: "Wedding",
    mood: "Luxury • Royal • Elegant",
    venue: "Grand Outdoor Wedding Venue",
    atmosphere: "Royal Ambience",
    previewImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    extras: ["Mandap Decoration", "Drone Photography", "Luxury Bride Suite", "Live Music"],
    particles: "rose",
    subtotal: 150000,
    heroTitle: "Where dream weddings become unforgettable memories",
    storyCopy: "Elegant couple standing together in a premium outdoor garden venue at night. Warm lights shimmer through a grand floral entrance onto a luxury stage bathed in a golden atmosphere.",
    recommendedServices: ["srv-decor", "srv-photo", "srv-bridal", "srv-music"],
    timeline: ["Inquiry", "Venue Reserved", "Mandap & Floral Setup", "Catering Tasting", "Final Run-through", "Wedding Day"],
    testimonial: {
      quote: "An absolutely magical night. The garden lit up with warm golden light, and the floral mandap felt straight out of a royal fairytale.",
      author: "Aishwarya & Rohan"
    },
    badgeText: "Royal Wedding Ceremony",
    previewDetails: ["Couple visual", "Wedding stage", "Mandap", "Bride suite preview"]
  },
  birthday: {
    title: "Birthday",
    mood: "Luxury • Festive • Celebration",
    venue: "Mini Function Hall",
    atmosphere: "Celebration Mode",
    previewImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200",
    extras: ["Cake Arrangement", "Kids Area", "Photography", "DJ Setup", "Return Gifts"],
    particles: "confetti",
    subtotal: 65000,
    heroTitle: "Turn every birthday into a magical celebration",
    storyCopy: "A luxury celebration with a stunning centerpiece cake as the visual focus, elegant balloons, a warm family atmosphere, and a dedicated kids celebration area.",
    recommendedServices: ["srv-kids", "srv-music", "srv-food"],
    timeline: ["Inquiry", "Theme Setup", "Cake Preparation", "Celebration Day"],
    testimonial: {
      quote: "The kids play zone and the centerpiece cake arrangements were incredible. Best family celebration we have ever hosted.",
      author: "Devendra K."
    },
    badgeText: "Premium Birthday Celebrations",
    previewDetails: ["Large birthday cake", "Decor setup", "Party table", "Kids zone"]
  },
  corporate: {
    title: "Corporate",
    mood: "Professional • Elite • Premium",
    venue: "Corporate Meeting Hall",
    atmosphere: "Business Environment",
    previewImage: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200",
    extras: ["AV Setup", "Projector", "Lunch Package", "Registration Desk"],
    particles: "geometric",
    subtotal: 90000,
    heroTitle: "Professional spaces designed for impactful meetings",
    storyCopy: "A professional meeting environment with a group of executives sitting in discussion around a presentation screen in a premium conference hall. Minimal luxury, zero party visuals.",
    recommendedServices: ["srv-led", "srv-valet", "srv-food"],
    timeline: ["Inquiry", "AV Setup Check", "Conference Hall Prep", "Meeting Day"],
    testimonial: {
      quote: "Exceptional acoustics, high-speed connectivity, and top-tier executive lunch catering. Extremely high professional standards.",
      author: "TechCorp Operations"
    },
    badgeText: "Elite Corporate Sanctuary",
    previewDetails: ["Conference room", "Business team", "Meeting setup"]
  },
  engagement: {
    title: "Engagement",
    mood: "Romantic • Elegant • Warm",
    venue: "Romantic Couple Stage",
    atmosphere: "Romantic Garden Glow",
    previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    extras: ["Couple Stage", "Photography", "Luxury Seating", "Floral Decor"],
    particles: "fairy",
    subtotal: 75000,
    heroTitle: "Celebrate the beginning of forever",
    storyCopy: "Romantic couple standing together under warm fairy lights and a beautifully decorated stage. Soft warm ambience.",
    recommendedServices: ["srv-decor", "srv-photo", "srv-music"],
    timeline: ["Inquiry", "Fairy Lights Prep", "Floral Stage Design", "Engagement Day"],
    testimonial: {
      quote: "Soft warm lighting, romantic garden stage setup, and incredible acoustic melodies. It was absolutely dreamlike.",
      author: "Priya & Arjun"
    },
    badgeText: "Romantic Engagement Stage",
    previewDetails: ["Couple setup", "Elegant stage", "Romantic lighting"]
  },
  photoshoot: {
    title: "Photoshoot",
    mood: "Creative • Cinematic • Sunset",
    venue: "Garden Photography Location",
    atmosphere: "Sunset Trails",
    previewImage: "https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&q=80&w=1200",
    extras: ["Photography Package", "Theme Backdrops", "Outdoor Locations"],
    particles: "cinematic",
    subtotal: 40000,
    heroTitle: "Capture moments in breathtaking settings",
    storyCopy: "A scenic outdoor photography setup where couples and families stand in beautiful locations illuminated by warm sunset lighting in a cinematic, timeless mood.",
    recommendedServices: ["srv-photo", "srv-drone", "srv-valet"],
    timeline: ["Inquiry", "Sunset Trail Booking", "Theme Backdrop Check", "Photoshoot Day"],
    testimonial: {
      quote: "Breathtaking landscapes and gorgeous golden hour spots. The scenic pre-wedding catalog is absolutely world-class.",
      author: "Pixels & Film Co."
    },
    badgeText: "Cinematic Photography Spots",
    previewDetails: ["Photo spots", "Landscape setup", "Light arrangements"]
  },
  family: {
    title: "Family Function",
    mood: "Warm • Traditional • Cozy",
    venue: "Traditional Gathering Atmosphere",
    atmosphere: "Warm Traditional",
    previewImage: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=1200",
    extras: ["Traditional Decoration", "Food Packages", "Kids Area", "Photography"],
    particles: "traditional",
    subtotal: 70000,
    heroTitle: "Celebrate family moments together",
    storyCopy: "A warm family group photo in a traditional celebration atmosphere, complete with dining and traditional gathering setups in an emotional family environment.",
    recommendedServices: ["srv-decor", "srv-food", "srv-kids"],
    timeline: ["Inquiry", "Traditional Mandap Set", "Buffet Line Setup", "Gathering Day"],
    testimonial: {
      quote: "Warm hospitality, traditional brass decorations, and a beautiful dining setup for the entire family. Simply unforgettable.",
      author: "The Nair Family"
    },
    badgeText: "Cozy Family Milestones",
    previewDetails: ["Large family gathering", "Traditional decor", "Dining setup"]
  },
  custom: {
    title: "Custom",
    mood: "Adaptive • Bespoke • Luxury",
    venue: "Bespoke Experiential Venue",
    atmosphere: "Custom Vibe",
    previewImage: "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&q=80&w=1200",
    extras: ["Stage Decor", "Specialist Lighting", "Guest Valet"],
    particles: "custom",
    subtotal: 100000,
    heroTitle: "Bespoke Experiential Venues Tailored to Your Vision",
    storyCopy: "A luxury neutral environment with a minimal premium setup. Customize the atmosphere dynamically to match your exact aesthetic.",
    recommendedServices: ["srv-decor", "srv-photo"],
    timeline: ["Inquiry", "Layout Design Review", "Vendor Orchestration", "Your Custom Event Day"],
    testimonial: {
      quote: "They mapped every segment of our dream event down to the inch. Gold accents, glass screens, and high-end aesthetics.",
      author: "Vikram & Sneha"
    },
    badgeText: "Bespoke Celebration Studio",
    previewDetails: ["Luxury layout", "Ambient settings", "Selected atmosphere"]
  }
};

// ==========================================
// IMMERSIVE GPU-ACCELERATED DOM PARTICLES
// ==========================================

export function ThemeParticles({ activeTheme }: { activeTheme: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: string }>>([]);

  useEffect(() => {
    // Generate particles only on the client to avoid Next.js hydration mismatch
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${7 + Math.random() * 9}s`,
      size: `${8 + Math.random() * 12}px`
    }));
    setParticles(generated);
  }, [activeTheme]);

  const themeKey = activeTheme.toLowerCase().replace(" function", "") as keyof typeof EVENT_THEMES;
  const config = EVENT_THEMES[themeKey] || EVENT_THEMES.wedding;
  if (config.particles === "custom") return null;

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map(p => {
        let className = "";
        let inlineStyle: React.CSSProperties = {
          left: p.left,
          animationDelay: p.delay,
          animationDuration: p.duration,
        };

        if (config.particles === "rose") {
          className = "petal-particle";
          inlineStyle.width = p.size;
          inlineStyle.height = p.size;
        } else if (config.particles === "confetti") {
          className = "confetti-particle";
          inlineStyle.width = `${5 + Math.random() * 5}px`;
          inlineStyle.height = `${9 + Math.random() * 9}px`;
          const colors = ["#C6A15B", "#ff85a1", "#4cc9f0", "#7209b7", "#ffb703", "#FFFFFF"];
          inlineStyle.backgroundColor = colors[p.id % colors.length];
        } else if (config.particles === "geometric") {
          className = "line-particle";
          inlineStyle.top = `${25 + (p.id * 7) % 60}%`;
        } else if (config.particles === "fairy") {
          className = "sparkle-particle";
          inlineStyle.top = `${15 + Math.random() * 70}%`;
          inlineStyle.width = `${12 + Math.random() * 10}px`;
          inlineStyle.height = `${12 + Math.random() * 10}px`;
        } else if (config.particles === "cinematic") {
          className = "bokeh-particle";
          inlineStyle.width = `${40 + Math.random() * 40}px`;
          inlineStyle.height = `${40 + Math.random() * 40}px`;
        } else if (config.particles === "traditional") {
          className = "lantern-particle";
          inlineStyle.width = `${16 + Math.random() * 10}px`;
          inlineStyle.height = `${22 + Math.random() * 14}px`;
        }

        return (
          <div
            key={p.id}
            className={className}
            style={inlineStyle}
          />
        );
      })}
    </div>
  );
}

export default function GatewayPage() {
  return (
    <React.Suspense fallback={
      <div style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <h3 className="cinematic-text-reveal" style={{ color: "#171717", fontFamily: "var(--font-serif)", fontSize: "1.45rem", letterSpacing: "0.02em" }}>Initializing Gaarlandz Experience Studio</h3>
        <div style={{ width: "220px", height: "3px" }} className="luxury-skeleton">
          <div className="luxury-skeleton-accent" style={{ margin: 0, height: "100%", width: "70px" }} />
        </div>
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
  const [wizSpace, setWizSpace] = useState("open-wedding");
  const [wizGuests, setWizGuests] = useState(300);
  const [wizDate, setWizDate] = useState("");
  const [wizSession, setWizSession] = useState<"Morning" | "Evening" | "Full Day">("Morning");
  const [wizServices, setWizServices] = useState<string[]>([]);
  const [wizCustomReqs, setWizCustomReqs] = useState("");
  
  const [wizName, setWizName] = useState("");
  const [wizPhone, setWizPhone] = useState("");
  const [wizEmail, setWizEmail] = useState("");

  // ==========================================
  // DYNAMIC EXPERIENCE ENGINE STATE & PRELOADER
  // ==========================================
  const [activeTheme, setActiveTheme] = useState<string>("wedding");
  const [customAtmosphere, setCustomAtmosphere] = useState<string>("Royal");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Derived state to replace wizEvent and act as single source of truth
  const wizEvent = EVENT_THEMES[activeTheme]?.title || "Wedding";

  const activePreviewImage = activeTheme === "custom"
    ? (CUSTOM_ATMOSPHERE_IMAGES[customAtmosphere] || EVENT_THEMES.custom.previewImage)
    : (EVENT_THEMES[activeTheme]?.previewImage || EVENT_THEMES.wedding.previewImage);

  // Preload Images on Client Mount
  useEffect(() => {
    const urls = [
      ...Object.values(EVENT_THEMES).map(t => t.previewImage),
      ...Object.values(CUSTOM_ATMOSPHERE_IMAGES)
    ];
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Debug Check
  useEffect(() => {
    console.log("Active Theme Selected:", activeTheme, EVENT_THEMES[activeTheme]);
  }, [activeTheme]);

  // Payment popup state
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [createdGaarId, setCreatedGaarId] = useState("");
  const [checkoutPath, setCheckoutPath] = useState<"payment" | "expert">("payment");

  // FAQ state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const activeSpaceObj = spaces.find(s => s.id === wizSpace) || spaces[0];
  const dynamicPricing = calculateDynamicPrice(wizSpace, wizDate, wizGuests, wizSession, wizServices, EVENT_THEMES[activeTheme]?.subtotal);

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            padding: "100px 24px 80px 24px",
            textAlign: "center",
            overflow: "hidden"
          }}>
            {/* Cinematic Luxury Background crossfade and parallax overlay */}
            <div 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.45), rgba(15, 15, 15, 0.65)), url('/luxury_event_collage.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center 35%", // Face-safe visual crop
                zIndex: 0,
                pointerEvents: "none"
              }}
            />
            {/* Dark gradient and gold lighting overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at 50% 30%, rgba(198, 161, 91, 0.12) 0%, transparent 70%)",
              zIndex: 1,
              pointerEvents: "none"
            }} />

            {/* Mount theme-specific hardware accelerated particle canvas */}
            <ThemeParticles activeTheme={activeTheme} />



            <div style={{ maxWidth: "800px", zIndex: 10 }}>
              <span key={`badge-${activeTheme}`} className="floral-badge cinematic-text-reveal" style={{ marginBottom: "20px", backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#C6A15B", borderColor: "rgba(198, 161, 91, 0.4)" }}>
                <Sparkles size={12} color="#C6A15B" /> {EVENT_THEMES[activeTheme]?.badgeText || "Luxury Garden Venue"}
              </span>
              <h1 key={`title-${activeTheme}`} className="cinematic-text-reveal" style={{ 
                fontSize: "3.5rem", 
                color: "#FFFFFF", 
                lineHeight: "1.2", 
                marginBottom: "20px",
                fontFamily: "var(--font-serif)",
                fontWeight: "700",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}>
                {EVENT_THEMES[activeTheme]?.heroTitle}
              </h1>
              <p key={`mood-${activeTheme}`} className="cinematic-text-reveal" style={{ 
                fontSize: "1.15rem", 
                color: "#FAF9F5", 
                opacity: 0.95, 
                maxWidth: "640px", 
                margin: "0 auto 40px auto",
                letterSpacing: "0.02em",
                fontWeight: "500",
                textTransform: "uppercase"
              }}>
                Mood: {EVENT_THEMES[activeTheme]?.mood}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "60px" }}>
                <button onClick={() => router.push("/?tab=book")} className="hero-btn-primary">
                  Book Venue
                </button>
                <button onClick={() => router.push("/?tab=track")} className="hero-btn-secondary">
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

          {/* DYNAMIC EVENT STORIES SECTION */}
          <section className="container" style={{ marginTop: "-50px", zIndex: 15, position: "relative" }}>
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "36px 32px",
              border: "1px solid rgba(198, 161, 91, 0.3)",
              boxShadow: "var(--shadow-elevated)",
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px"
            }}>
              <span className="floral-badge">Our Atmospheric Vision</span>
              <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "#171717",
                lineHeight: "1.5",
                fontStyle: "italic",
                transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}>
                "{EVENT_THEMES[activeTheme]?.storyCopy}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#C6A15B", fontWeight: "700" }}>
                <Sparkles size={14} color="#C6A15B" /> <span>Current Atmosphere Vibe: {EVENT_THEMES[activeTheme]?.atmosphere}</span>
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

          {/* SOCIAL PROOF STRIP */}
          <section style={{
            backgroundColor: "#171717",
            borderTop: "1px solid rgba(198, 161, 91, 0.4)",
            borderBottom: "1px solid rgba(198, 161, 91, 0.4)",
            padding: "24px 0",
            overflow: "hidden",
            position: "relative",
            width: "100%"
          }}>
            <div className="proof-strip-scroller" style={{ display: "flex", gap: "60px", alignItems: "center" }}>
              {/* Double array elements to make it infinite scroll flawlessly */}
              {[
                { count: "500+", label: "Weddings Hosted" },
                { count: "300+", label: "Birthdays Celebrated" },
                { count: "200+", label: "Corporate Summits" },
                { count: "4.9 ★", label: "Luxury Rating" },
                { count: "1000+", label: "Happy Families" },
                { count: "500+", label: "Weddings Hosted" },
                { count: "300+", label: "Birthdays Celebrated" },
                { count: "200+", label: "Corporate Summits" },
                { count: "4.9 ★", label: "Luxury Rating" },
                { count: "1000+", label: "Happy Families" }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    color: "#C6A15B",
                    letterSpacing: "0.02em"
                  }}>{item.count}</span>
                  <span style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#FAF9F5",
                    fontWeight: "600"
                  }}>{item.label}</span>
                  <Flower size={12} color="rgba(198, 161, 91, 0.4)" style={{ marginLeft: "20px" }} />
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
        <div style={{
          position: "relative",
          minHeight: "100vh",
          padding: "40px 24px 100px 24px",
          overflow: "hidden"
        }}>
          {/* Booking Tab Crossfading Background */}
          <div 
            key={activePreviewImage}
            className="hero-background-fade"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.45), rgba(15, 15, 15, 0.65)), url('${activePreviewImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 35%", // Face-safe visual crop
              backgroundAttachment: "fixed",
              zIndex: 0,
              pointerEvents: "none"
            }}
          />
          {/* Mount dynamic theme particles on booking tab */}
          <ThemeParticles activeTheme={activeTheme} />

          {/* Desktop Dual-Column or Mobile Single-Column grid */}
          <div className="container" style={{
            maxWidth: "1150px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "center",
            position: "relative"
          }}>
            
            {/* LEFT COLUMN: WIZARD FORM & JOURNEY ROADMAP */}
            <div style={{ flex: "1 1 600px", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 20 }}>
              
              <div className="luxury-card" style={{ 
                padding: "48px 40px", 
                border: "1px solid rgba(198, 161, 91, 0.2)", 
                backgroundColor: "#FFFFFF",
                boxShadow: "0 15px 45px rgba(0, 0, 0, 0.04)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#171717", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Gaarlandz Experience Studio</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#C6A15B", letterSpacing: "0.05em" }}>Step {wizardStep} of 7</span>
                </div>
                <div className="gold-divider" style={{ margin: "16px 0 28px 0" }} />

                <form onSubmit={handleWizardSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  {/* STEP 1: EVENT TYPE */}
                  {wizardStep === 1 && (
                    <div key="step-1" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Select Event Milestone</h4>
                      {["Wedding", "Birthday", "Corporate", "Engagement", "Photoshoot", "Family Function", "Custom"].map(ev => {
                        const themeKey = ev.toLowerCase().replace(" function", "");
                        const isSelected = activeTheme === themeKey;
                        return (
                          <div 
                            key={ev} 
                            onClick={() => setActiveTheme(themeKey)}
                            style={{
                              padding: "16px",
                              borderRadius: "14px",
                              border: isSelected ? "2px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)",
                              backgroundColor: isSelected ? "rgba(198, 161, 91, 0.08)" : "#FFFFFF",
                              cursor: "pointer",
                              fontWeight: "600",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)"
                            }}
                          >
                            <span>{ev} Event</span>
                            <span style={{ fontSize: "0.65rem", color: "#C6A15B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {isSelected ? "✓ Selected" : "Customize"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* STEP 2: VENUE AREA */}
                  {wizardStep === 2 && (
                    <div key="step-2" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Select Signature Venue Space</h4>
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
                            alignItems: "center",
                            transition: "all 0.3s"
                          }}
                        >
                          <img src={sp.image} alt="" style={{ width: "60px", height: "44px", borderRadius: "8px", objectFit: "cover" }} />
                          <div style={{ textAlign: "left" }}>
                            <strong style={{ fontSize: "0.85rem", display: "block", color: "#171717" }}>{sp.name}</strong>
                            <span style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>Price: ₹{sp.basePrice.toLocaleString()} | Capacity: {sp.capacity} Guests</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* STEP 3: GUEST SLIDER */}
                  {wizardStep === 3 && (
                    <div key="step-3" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Expected Guests Count</h4>
                      <input 
                        type="range" 
                        min="100" 
                        max="1000" 
                        value={wizGuests} 
                        onChange={(e) => setWizGuests(parseInt(e.target.value))} 
                        style={{ width: "100%", accentColor: "#C6A15B" }}
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
                    <div key="step-4" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Schedule Lock Date & Session</h4>
                      <div>
                        <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px", color: "#5A5A5A" }}>Session Time Slot</label>
                        <select 
                          value={wizSession} 
                          onChange={(e) => setWizSession(e.target.value as any)} 
                          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem", backgroundColor: "#FFFFFF", color: "#171717" }}
                        >
                          <option value="Morning">Morning Session (6:00 AM - 2:00 PM)</option>
                          <option value="Evening">Evening Sunset Gala (4:00 PM - 11:30 PM)</option>
                          <option value="Full Day">Full Day Grand Celebration</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px", color: "#5A5A5A" }}>Target Lock Date</label>
                        <input 
                          type="date" 
                          required
                          value={wizDate} 
                          onChange={(e) => setWizDate(e.target.value)} 
                          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem", backgroundColor: "#FFFFFF", color: "#171717" }}
                        />
                      </div>

                      {/* LIVE AVAILABILITY DEMAND HEATMAP */}
                      <div style={{
                        marginTop: "16px",
                        backgroundColor: "#FAF9F5",
                        border: "1px solid rgba(198, 161, 91, 0.25)",
                        borderRadius: "14px",
                        padding: "16px",
                        textAlign: "left"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "#171717" }}>Venue Demand Guide</span>
                          <span className="floral-badge" style={{ fontSize: "0.6rem", backgroundColor: "rgba(198, 161, 91, 0.15)" }}>Filling Fast</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", textAlign: "center", marginBottom: "12px" }}>
                          {[
                            { label: "Mon-Wed", state: "Low", color: "#28A745", bg: "rgba(40,167,69,0.06)" },
                            { label: "Thursday", state: "Medium", color: "#C6A15B", bg: "rgba(198,161,91,0.08)" },
                            { label: "Friday", state: "High", color: "#FD7E14", bg: "rgba(253,126,20,0.06)" },
                            { label: "Saturday", state: "Peak", color: "#DC3545", bg: "rgba(220,53,69,0.06)" }
                          ].map(d => (
                            <div key={d.label} style={{ padding: "8px 4px", borderRadius: "8px", backgroundColor: d.bg, border: `1px solid ${d.color}25` }}>
                              <span style={{ fontSize: "0.65rem", display: "block", color: "#5A5A5A", fontWeight: "600" }}>{d.label}</span>
                              <span style={{ fontSize: "0.7rem", color: d.color, fontWeight: "700" }}>{d.state}</span>
                            </div>
                          ))}
                        </div>

                        {wizDate && (() => {
                          const dateObj = new Date(wizDate);
                          const day = dateObj.getDay();
                          let level = "Low Demand";
                          let color = "#28A745";
                          let desc = "Great slot! Easy venue scheduling & complete vendor access verified.";

                          if (day === 6 || day === 0) { // Saturday, Sunday
                            level = "Peak Demand (Almost Booked)";
                            color = "#DC3545";
                            desc = "Weekend premium. Secure date now to reserve priority decoration setups.";
                          } else if (day === 5) { // Friday
                            level = "High Demand";
                            color = "#FD7E14";
                            desc = "Friday lock. Highly requested. Catering lines filling up.";
                          } else if (day === 4) { // Thursday
                            level = "Medium Demand";
                            color = "#C6A15B";
                            desc = "Moderate calendar density. Standard rates apply.";
                          }

                          return (
                            <div style={{ borderTop: "1px dashed rgba(198,161,91,0.25)", paddingTop: "12px", marginTop: "8px" }}>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color }} />
                                <strong style={{ fontSize: "0.75rem", color: "#171717" }}>Selected slot: <span style={{ color }}>{level}</span></strong>
                              </div>
                              <p style={{ fontSize: "0.7rem", color: "#5A5A5A", lineHeight: "1.3" }}>{desc}</p>
                            </div>
                          );
                        })()}

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", backgroundColor: "rgba(198,161,91,0.06)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(198,161,91,0.15)" }}>
                          <AlertTriangle size={14} color="#C6A15B" />
                          <span style={{ fontSize: "0.7rem", color: "#C6A15B", fontWeight: "700" }}>Book early — {wizEvent.toLowerCase()} season filling fast</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: ADDITIONAL SERVICES & DYNAMIC PACKAGE BUILDER */}
                  {wizardStep === 5 && (
                    <div key="step-5" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Append Custom Services</h4>

                      {/* SMART RECOMMENDATIONS BAR */}
                      <div style={{
                        backgroundColor: "rgba(198, 161, 91, 0.08)",
                        border: "1px solid rgba(198, 161, 91, 0.3)",
                        borderRadius: "14px",
                        padding: "16px",
                        textAlign: "left"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span className="floral-badge" style={{ backgroundColor: "#C6A15B", color: "#171717", border: "none", fontSize: "0.6rem" }}>
                            ★ Recommended for your event
                          </span>
                          <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#C6A15B" }}>SMART SUGGESTIONS</span>
                        </div>

                        {/* Custom mode atmosphere selector */}
                        {wizEvent === "Custom" && (
                          <div style={{ marginBottom: "12px" }}>
                            <span style={{ fontSize: "0.65rem", color: "#5A5A5A", display: "block", marginBottom: "6px", fontWeight: "700" }}>Choose atmosphere:</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {["Royal", "Modern", "Outdoor", "Traditional", "Minimal"].map(atm => (
                                <button
                                  key={atm}
                                  type="button"
                                  onClick={() => setCustomAtmosphere(atm)}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(198,161,91,0.3)",
                                    backgroundColor: customAtmosphere === atm ? "#171717" : "#FFFFFF",
                                    color: customAtmosphere === atm ? "#FFFFFF" : "#171717",
                                    fontSize: "0.65rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  {atm}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <p style={{ fontSize: "0.72rem", color: "#5A5A5A", marginBottom: "8px" }}>
                          {activeTheme === "custom" 
                            ? `Recommendations based on your custom ${customAtmosphere.toLowerCase()} vibe:` 
                            : `Our recommended selections for a premium ${wizEvent.toLowerCase()} setup:`}
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                          {(() => {
                            let suggestions: string[] = [];
                            if (activeTheme === "custom") {
                              if (customAtmosphere === "Luxury") {
                                suggestions = ["srv-decor", "srv-valet", "srv-bridal"];
                              } else if (customAtmosphere === "Traditional") {
                                suggestions = ["srv-decor", "srv-food"];
                              } else if (customAtmosphere === "Modern") {
                                suggestions = ["srv-led", "srv-drone"];
                              } else if (customAtmosphere === "Royal") {
                                suggestions = ["srv-decor", "srv-music", "srv-fire"];
                              } else if (customAtmosphere === "Outdoor") {
                                suggestions = ["srv-valet", "srv-drone"];
                              } else {
                                suggestions = ["srv-food", "srv-photo"];
                              }
                            } else {
                              suggestions = EVENT_THEMES[activeTheme]?.recommendedServices || [];
                            }

                            return suggestions.map(srvId => {
                              const matchingSrv = additionalServices.find(s => s.id === srvId);
                              if (!matchingSrv) return null;
                              const isSelected = wizServices.includes(matchingSrv.id);

                              return (
                                <div
                                  key={matchingSrv.id}
                                  onClick={() => handleWizServiceToggle(matchingSrv.id)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "30px",
                                    border: isSelected ? "2px solid #C6A15B" : "1px dashed rgba(198,161,91,0.4)",
                                    backgroundColor: isSelected ? "rgba(198,161,91,0.15)" : "#FFFFFF",
                                    color: "#171717",
                                    cursor: "pointer",
                                    fontSize: "0.68rem",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  <span>{matchingSrv.name}</span>
                                  <span style={{ color: "#C6A15B", fontWeight: "700" }}>
                                    {isSelected ? "✓ Added" : "+ Add"}
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Custom package cards showing savings */}
                      {wizServices.length > 0 && (
                        <div className="gold-accent-glow" style={{
                          backgroundColor: "#171717",
                          color: "#FFFFFF",
                          borderRadius: "16px",
                          padding: "20px",
                          border: "1px solid var(--accent-gold-bright)",
                          textAlign: "left",
                          position: "relative",
                          overflow: "hidden"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div>
                              <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#C6A15B", fontWeight: "700" }}>
                                Curated Luxury Package
                              </span>
                              <h5 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "#FFFFFF", marginTop: "2px" }}>
                                {activeTheme} Premium Package
                              </h5>
                            </div>
                            <span className="floral-badge" style={{ backgroundColor: "#C6A15B", color: "#171717", border: "none", fontSize: "0.6rem" }}>
                              ✓ Savings Applied
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "14px", fontSize: "0.7rem", color: "rgba(255,255,255,0.8)" }}>
                            <span>Space Lock: <strong>{activeSpaceObj.name}</strong></span>
                            <span>Selected Bundle Services ({wizServices.length}):</span>
                            {wizServices.map(srvId => {
                              const srv = additionalServices.find(s => s.id === srvId);
                              return (
                                <span key={srvId} style={{ color: "#FAF9F5", paddingLeft: "8px" }}>
                                  ✔ {srv?.name}
                                </span>
                              );
                            })}
                          </div>

                          <div style={{
                            borderTop: "1px dashed rgba(255, 255, 255, 0.15)",
                            paddingTop: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            <div>
                              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", display: "block" }}>Bundle Discount (12%)</span>
                              <strong style={{ fontSize: "0.8rem", color: "#28A745" }}>
                                Saved: ₹{Math.round(dynamicPricing.servicesCost * 0.12).toLocaleString()}
                              </strong>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", display: "block" }}>Curated Subtotal Price</span>
                              <strong style={{ fontSize: "1.1rem", color: "#C6A15B" }}>
                                ₹{dynamicPricing.total.toLocaleString()}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

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
                              alignItems: "center",
                              transition: "all 0.2s"
                            }}
                          >
                            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#171717" }}>{srv.name}</span>
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
                    <div key="step-6" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h4 style={{ fontSize: "1.6rem", fontFamily: "var(--font-serif)", color: "#171717", marginBottom: "8px" }}>Bespoke Requests & Customer Info</h4>
                      <textarea 
                        value={wizCustomReqs} 
                        onChange={(e) => setWizCustomReqs(e.target.value)} 
                        placeholder="Describe stage floral themes, specialized decorators, culinary briefs..." 
                        style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", color: "#171717" }}
                      />
                      <input type="text" required placeholder="Full Name" value={wizName} onChange={(e) => setWizName(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem", color: "#171717" }} />
                      <input type="tel" required placeholder="Phone Number" value={wizPhone} onChange={(e) => setWizPhone(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem", color: "#171717" }} />
                      <input type="email" required placeholder="Email Address" value={wizEmail} onChange={(e) => setWizEmail(e.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem", color: "#171717" }} />
                    </div>
                  )}

                  {/* STEP 7: LUXURY CHECKOUT EXPERIENCE */}
                  {wizardStep === 7 && (
                    <div key="step-7" className="wizard-step-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ textAlign: "center", marginBottom: "8px" }}>
                        <span className="floral-badge" style={{ animation: "drift 10s infinite linear" }}>Secure Reservation Lock</span>
                        <h4 style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)", color: "#171717", marginTop: "4px" }}>
                          Bespoke Invoice Splits Summary
                        </h4>
                      </div>

                      {/* Visual summary card */}
                      <div style={{
                        position: "relative",
                        borderRadius: "16px",
                        height: "120px",
                        overflow: "hidden",
                        border: "1px solid rgba(198,161,91,0.3)"
                      }}>
                        <img 
                          src={activePreviewImage} 
                          alt="" 
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} 
                        />
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85))",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end"
                        }}>
                          <span style={{ fontSize: "0.6rem", color: "#C6A15B", textTransform: "uppercase", fontWeight: "700" }}>
                            {wizEvent} Reservation • {wizGuests} Expected Guests
                          </span>
                          <h5 style={{ color: "#FFFFFF", fontSize: "1.15rem", fontFamily: "var(--font-serif)", marginTop: "2px" }}>
                            {activeSpaceObj.name}
                          </h5>
                        </div>
                      </div>

                      {/* Dynamic invoice details card */}
                      <div className="gold-accent-glow" style={{
                        backgroundColor: "#FFFFFF",
                        padding: "24px",
                        borderRadius: "20px",
                        border: "1px solid var(--accent-gold-bright)",
                        fontSize: "0.85rem",
                        boxShadow: "var(--shadow-gold)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#5A5A5A" }}>
                          <span>Base Space Layout ({wizSession}):</span>
                          <strong>₹{dynamicPricing.basePrice.toLocaleString()}</strong>
                        </div>

                        {wizServices.length > 0 && (
                          <div style={{ borderBottom: "1px dashed rgba(0,0,0,0.06)", paddingBottom: "10px", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.7rem", color: "#8A8A8A", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Included Services ({wizServices.length})</span>
                            {wizServices.map(srvId => {
                              const srv = additionalServices.find(s => s.id === srvId);
                              return (
                                <div key={srvId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#171717", marginLeft: "4px", marginBottom: "4px" }}>
                                  <span>• {srv?.name}</span>
                                  <span>{srv?.isPerGuest ? `₹${srv?.price}/G` : `₹${srv?.price.toLocaleString()}`}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#5A5A5A" }}>
                          <span>18% Government GST:</span>
                          <strong>₹{dynamicPricing.tax.toLocaleString()}</strong>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "12px", marginBottom: "16px" }}>
                          <strong style={{ fontSize: "1rem", color: "#171717" }}>Grand Total Amount:</strong>
                          <strong style={{ fontSize: "1.2rem", color: "#171717" }}>₹{dynamicPricing.total.toLocaleString()}</strong>
                        </div>

                        {/* Advance / Remaining splits */}
                        <div style={{
                          backgroundColor: "rgba(198,161,91,0.06)",
                          border: "1px solid rgba(198,161,91,0.2)",
                          borderRadius: "12px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px"
                        }}>
                          <div style={{ display: "flex", justifySelf: "space-between", fontSize: "0.8rem", color: "#171717" }}>
                            <span>Advance Lock Deposit:</span>
                            <strong style={{ color: "#C6A15B" }}>₹50,000.00</strong>
                          </div>
                          <div style={{ display: "flex", justifySelf: "space-between", fontSize: "0.8rem", color: "#171717" }}>
                            <span>Remaining Balance:</span>
                            <strong>₹{Math.max(0, dynamicPricing.total - 50000).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Booking Confidence Badges */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        margin: "4px 0"
                      }}>
                        {[
                          { text: "Secure Booking" },
                          { text: "Availability Verified" },
                          { text: "Flexible Support" },
                          { text: "Dedicated Event Team" }
                        ].map((badge, idx) => (
                          <div key={idx} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 12px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid rgba(0,0,0,0.05)",
                            borderRadius: "10px",
                            fontSize: "0.72rem",
                            color: "#171717",
                            fontWeight: "600"
                          }}>
                            <span style={{ color: "#C6A15B", fontWeight: "700" }}>✔</span>
                            <span>{badge.text}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button type="submit" onClick={() => setCheckoutPath("payment")} className="luxury-btn-primary" style={{ justifyContent: "center" }}>
                          Secure Lock with Deposit (₹50,000)
                        </button>
                        <button type="submit" onClick={() => setCheckoutPath("expert")} className="luxury-btn-secondary" style={{ justifyContent: "center" }}>
                          Direct Callback Inquiry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 8: SUCCESS DISPLAY */}
                  {wizardStep === 8 && (
                    <div key="step-8" className="wizard-step-container" style={{ textAlign: "center", padding: "20px 0" }}>
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

              {/* HORIZONTAL ROADMAP JOURNEY TIMELINE */}
              {wizardStep < 8 && (
                <div className="luxury-card" style={{ padding: "24px 20px", border: "1px solid rgba(198, 161, 91, 0.35)", backgroundColor: "#FFFFFF", position: "relative", zIndex: 25 }}>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <span className="floral-badge" style={{ fontSize: "0.6rem" }}>Operational Roadmap</span>
                    <h5 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginTop: "4px", color: "#171717" }}>Your Event Journey</h5>
                  </div>

                  <div style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "0 10px"
                  }}>
                    {/* Background Progress Connect Line */}
                    <div style={{
                      position: "absolute",
                      top: "14px",
                      left: "0",
                      width: "100%",
                      height: "2px",
                      backgroundColor: "rgba(0,0,0,0.06)",
                      zIndex: 0
                    }} />
                    
                    {/* Active Gold Progress Connect Line */}
                    <div style={{
                      position: "absolute",
                      top: "14px",
                      left: "0",
                      width: `${((wizardStep - 1) / 6) * 100}%`,
                      height: "2px",
                      backgroundColor: "#C6A15B",
                      zIndex: 1,
                      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                    }} />

                    {(EVENT_THEMES[activeTheme]?.timeline || EVENT_THEMES.wedding.timeline).map((stepName, stepIdx) => {
                      const totalSteps = (EVENT_THEMES[activeTheme]?.timeline || EVENT_THEMES.wedding.timeline).length;
                      const progressFraction = (wizardStep - 1) / 6;
                      const stepFraction = stepIdx / (totalSteps - 1);
                      const isCompleted = progressFraction >= stepFraction;
                      const isCurrent = Math.abs(progressFraction - stepFraction) < 0.05 || (wizardStep === 7 && stepIdx === totalSteps - 1);

                      return (
                        <div
                          key={stepIdx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 2,
                            width: `${100 / totalSteps}%`,
                            position: "relative"
                          }}
                        >
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: isCompleted ? "#C6A15B" : "#FFFFFF",
                            border: isCompleted ? "2px solid #C6A15B" : "2px solid rgba(0,0,0,0.1)",
                            color: isCompleted ? "#171717" : "#5A5A5A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            boxShadow: isCurrent ? "var(--shadow-gold)" : "none",
                            transform: isCurrent ? "scale(1.15)" : "scale(1)",
                            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}>
                            {isCompleted ? "✓" : stepIdx + 1}
                          </div>

                          <span style={{
                            fontSize: "0.56rem",
                            fontWeight: isCurrent || isCompleted ? "700" : "500",
                            color: isCurrent ? "#C6A15B" : isCompleted ? "#171717" : "#5A5A5A",
                            textAlign: "center",
                            marginTop: "8px",
                            lineHeight: "1.2",
                            maxWidth: "64px",
                            textTransform: "uppercase",
                            letterSpacing: "0.02em"
                          }}>
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STICKY BOTTOM CONTROL CTA BAR (Desktop Only) */}
              {wizardStep < 8 && (
                <div className="desktop-only" style={{
                  position: "sticky",
                  bottom: "20px",
                  backgroundColor: "#FFFFFF",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(198, 161, 91, 0.35)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  width: "100%",
                  marginTop: "24px",
                  zIndex: 40
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

            {/* RIGHT COLUMN: STICKY FLOATING PREVIEW (Desktop Only) */}
            <div className="desktop-only" style={{
              width: "320px",
              flexShrink: 0,
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              zIndex: 10
            }}>
              <LiveExperiencePanel
                wizEvent={wizEvent}
                activeTheme={activeTheme}
                activeSpaceObj={activeSpaceObj}
                wizGuests={wizGuests}
                wizServices={wizServices}
                additionalServices={additionalServices}
                dynamicPricing={dynamicPricing}
                customAtmosphere={customAtmosphere}
              />
            </div>
            
          </div>

          {/* MOBILE BOTTOM STICKY BAR & DRAWER TRIGGER */}
          {wizardStep < 8 && (
            <div className="mobile-only" style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
              backgroundColor: "#171717",
              borderTop: "1px solid rgba(198, 161, 91, 0.4)",
              padding: "16px 24px",
              display: "none", // Controlled via css media query in Navbar/globals
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 50,
              boxShadow: "0 -8px 30px rgba(0,0,0,0.15)"
            }}>
              <div>
                <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", display: "block", textTransform: "uppercase" }}>Estimated Total</span>
                <strong style={{ fontSize: "1.05rem", color: "#C6A15B" }}>₹{dynamicPricing.total.toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setMobileDrawerOpen(true)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#FFFFFF",
                    border: "1px solid rgba(198,161,91,0.5)",
                    borderRadius: "12px",
                    padding: "8px 14px",
                    fontSize: "0.7rem",
                    fontWeight: "600"
                  }}
                >
                  Live Preview
                </button>
                <button 
                  onClick={() => {
                    if (wizardStep === 4 && !wizDate) {
                      alert("Select a date lock first.");
                      return;
                    }
                    if (wizardStep < 7) {
                      setWizardStep(wizardStep + 1);
                    } else {
                      handleWizardSubmit(new Event('submit') as any);
                    }
                  }}
                  className="luxury-btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                >
                  {wizardStep === 7 ? "Lock Deposit" : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* MOBILE EXPANDABLE BOTTOM DRAWER SHEET */}
          {mobileDrawerOpen && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 100,
              display: "flex",
              alignItems: "flex-end",
              padding: "16px"
            }}>
              <div 
                className="fade-in-reveal"
                style={{
                  width: "100%",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "28px",
                  border: "2px solid #C6A15B",
                  padding: "24px",
                  maxHeight: "85vh",
                  overflowY: "auto",
                  position: "relative"
                }}
              >
                {/* Pull drawer handle bar */}
                <div style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: "2px",
                  margin: "-8px auto 16px auto"
                }} />

                <div style={{ display: "flex", justifySelf: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#171717" }}>Live Celebration Preview</h4>
                  <button 
                    onClick={() => setMobileDrawerOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#171717",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                  >
                    <X size={22} />
                  </button>
                </div>

                <LiveExperiencePanel
                  wizEvent={wizEvent}
                  activeTheme={activeTheme}
                  activeSpaceObj={activeSpaceObj}
                  wizGuests={wizGuests}
                  wizServices={wizServices}
                  additionalServices={additionalServices}
                  dynamicPricing={dynamicPricing}
                  customAtmosphere={customAtmosphere}
                />
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="luxury-btn-primary" 
                  style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}
                >
                  Return to Booking Flow
                </button>
              </div>
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

// ==========================================
// STICKY LIVE EVENT EXPERIENCE PREVIEW PANEL
// ==========================================

export function LiveExperiencePanel({ 
  activeTheme, 
  activeSpaceObj, 
  wizGuests, 
  wizServices, 
  additionalServices, 
  dynamicPricing, 
  customAtmosphere 
}: any) {
  const currentTheme = EVENT_THEMES[activeTheme] || EVENT_THEMES.wedding;
  
  const activePreviewImage = activeTheme === "custom"
    ? (CUSTOM_ATMOSPHERE_IMAGES[customAtmosphere] || EVENT_THEMES.custom.previewImage)
    : (EVENT_THEMES[activeTheme]?.previewImage || EVENT_THEMES.wedding.previewImage);

  return (
    <div className="luxury-card" style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid rgba(198, 161, 91, 0.35)",
      padding: "24px",
      borderRadius: "24px",
      boxShadow: "var(--shadow-elevated)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      {/* Aspect visual render */}
      <div style={{ position: "relative", borderRadius: "16px", height: "180px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
        <img 
          src={activePreviewImage} 
          alt={currentTheme.title} 
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)" }} 
        />
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          backgroundColor: "rgba(23,23,23,0.85)",
          color: "#C6A15B",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "0.6rem",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          border: "1px solid rgba(198,161,91,0.3)"
        }}>
          Live Render
        </div>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "24px 16px 12px 16px",
          background: "linear-gradient(to top, rgba(23,23,23,0.9), transparent)",
          color: "#FFFFFF"
        }}>
          <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "#C6A15B", letterSpacing: "0.05em", fontWeight: "700" }}>
            {currentTheme.mood}
          </span>
          <h4 style={{ color: "#FFFFFF", fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginTop: "2px" }}>
            {currentTheme.title} Setup
          </h4>
        </div>
      </div>

      {/* Main Preview Metadata */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem", color: "#171717", borderBottom: "1px dashed rgba(0,0,0,0.08)", paddingBottom: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#5A5A5A" }}>Atmosphere Mood:</span>
          <strong style={{ color: "#C6A15B", textTransform: "uppercase" }}>
            {activeTheme === "custom" ? customAtmosphere : currentTheme.atmosphere}
          </strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#5A5A5A" }}>Selected Venue:</span>
          <strong>{activeSpaceObj?.name || "Open Wedding Venue"}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#5A5A5A" }}>Expected Guests:</span>
          <strong>{wizGuests} Pax</strong>
        </div>
      </div>

      {/* Visual Highlights */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderBottom: "1px dashed rgba(0,0,0,0.08)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "#5A5A5A" }}>Visual Highlights</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(currentTheme.previewDetails || []).map((detail: string, idx: number) => (
            <span 
              key={idx} 
              style={{ 
                fontSize: "0.68rem", 
                backgroundColor: "rgba(198, 161, 91, 0.05)", 
                color: "#171717", 
                border: "1px solid rgba(198, 161, 91, 0.15)",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "600"
              }}
            >
              {detail}
            </span>
          ))}
        </div>
      </div>

      {/* Selected Add-ons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderBottom: "1px dashed rgba(0,0,0,0.08)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "#5A5A5A" }}>Selected Add-ons ({wizServices.length})</span>
        {wizServices.length === 0 ? (
          <span style={{ fontSize: "0.75rem", color: "#8A8A8A", fontStyle: "italic" }}>No services appended yet.</span>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {wizServices.map((srvId: string) => {
              const srv = additionalServices.find((s: any) => s.id === srvId);
              return (
                <span 
                  key={srvId} 
                  style={{ 
                    fontSize: "0.68rem", 
                    backgroundColor: "rgba(198,161,91,0.08)", 
                    color: "#C6A15B", 
                    border: "1px solid rgba(198,161,91,0.25)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontWeight: "600"
                  }}
                >
                  {srv?.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested Extras */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: "1px dashed rgba(0,0,0,0.08)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "#5A5A5A" }}>Suggested Extras</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {currentTheme.extras.slice(0, 4).map((ex: string, idx: number) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", color: "#5A5A5A" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#C6A15B" }} />
              <span>{ex}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Pricing Splits */}
      <div style={{
        marginTop: "6px",
        backgroundColor: "#FAF9F5",
        borderRadius: "16px",
        padding: "16px",
        border: "1px solid rgba(198,161,91,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#5A5A5A", marginBottom: "4px" }}>
          <span>Invoice Subtotal:</span>
          <span>₹{dynamicPricing.subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#5A5A5A", marginBottom: "8px" }}>
          <span>GST (18%):</span>
          <span>₹{dynamicPricing.tax.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "8px" }}>
          <strong style={{ fontSize: "0.85rem", color: "#171717" }}>Total Estimated:</strong>
          <strong style={{ fontSize: "1.1rem", color: "#C6A15B" }}>₹{dynamicPricing.total.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}

