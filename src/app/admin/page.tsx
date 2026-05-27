"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGaarlandz, Booking, Lead, VenueSpace, KanbanTask, StaffMember, Vendor } from "@/context/GaarlandzContext";
import { 
  Users, 
  Flower,
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  Edit3, 
  Plus, 
  TrendingUp, 
  Clock, 
  X,
  FileText,
  DollarSign,
  Briefcase,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Bell,
  Sliders,
  Play,
  ClipboardList,
  ArrowRight,
  Download,
  FolderOpen,
  Image,
  CheckCircle,
  HelpCircle,
  Eye,
  LogOut,
  ListTodo,
  Package,
  Calculator,
  Star,
  Paintbrush,
  Coffee,
  Camera,
  Smile,
  Trash2
} from "lucide-react";

// ==============================================================
// DRAGGABLE MODAL COMPONENT WRAPPER (NO DEPENDENCIES)
// ==============================================================
interface DraggableModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

function DraggableModal({ onClose, title, children, maxWidth = "520px" }: DraggableModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Drag only with left-click on the header handle
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "transparent",
      backdropFilter: "none",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }}>
      <div style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 10px 50px rgba(0,0,0,0.2)",
        border: "2px solid #C6A15B",
        width: "90%",
        maxWidth: maxWidth,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto"
      }}>
        {/* Header Drag Handle */}
        <div 
          onMouseDown={handleMouseDown}
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(198, 161, 91, 0.2)",
            cursor: "move",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(90deg, rgba(198,161,91,0.05), transparent)",
            borderRadius: "18px 18px 0 0"
          }}
        >
          <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "#171717" }}>{title}</strong>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}>
            <X size={20} color="#171717" />
          </button>
        </div>
        {/* Modal Body */}
        <div style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SecuredVenueOSPortal() {
  const router = useRouter();
  
  // Hydration security validation
  const [authorized, setAuthorized] = useState(false);
  const [validatingSession, setValidatingSession] = useState(true);

  useEffect(() => {
    const sessionActive = localStorage.getItem("gaarlandz_session_active");
    if (sessionActive === "true") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setValidatingSession(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gaarlandz_session_active");
    router.push("/admin-login");
  };

  if (validatingSession) {
    return (
      <div style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <h3 className="cinematic-text-reveal" style={{ color: "#171717", fontFamily: "var(--font-serif)", fontSize: "1.45rem", letterSpacing: "0.02em" }}>Validating Console Authorization</h3>
        <div style={{ width: "220px", height: "3px" }} className="luxury-skeleton">
          <div className="luxury-skeleton-accent" style={{ margin: 0, height: "100%", width: "70px" }} />
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
        <div style={{ maxWidth: "460px", padding: "40px" }} className="luxury-card">
          <AlertTriangle size={48} color="#C6A15B" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1.6rem", marginBottom: "12px", fontFamily: "var(--font-serif)" }}>Authorization Required</h3>
          <p style={{ color: "#5A5A5A", fontSize: "0.9rem", marginBottom: "24px" }}>
            The Venue Operating System is locked and protected. Please log in using the administrative credentials first.
          </p>
          <button onClick={() => router.push("/admin-login")} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return <GaarlandzSidebarConsole onLogout={handleLogout} />;
}

// ==========================================
// CORE SIDEBAR OS PANEL INTERACTION
// ==========================================

interface SidebarConsoleProps {
  onLogout: () => void;
}

function GaarlandzSidebarConsole({ onLogout }: SidebarConsoleProps) {
  const { 
    spaces, 
    bookings, 
    leads, 
    siteVisits, 
    operations,
    staff,
    vendors,
    notifications,
    automationLogs,
    additionalServices,
    addBooking,
    updateBooking,
    deleteBooking,
    updateBookingStatus, 
    addLead,
    updateLeadStatus, 
    deleteLead,
    addLeadFollowUp, 
    convertLeadToBooking,
    updateSiteVisitStatus,
    updateSpacePricing,
    addSpace,
    updateSpaceDetails,
    deleteSpace,
    isPremiumDate,
    checkDateAvailability
  } = useGaarlandz();

  // Navigation Sidebar States
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    "overview" | "calendar" | "bookings" | "leads" | "spaces" | "decor_team" | "catering_team" | 
    "photo_team" | "bridal_amenities" | "kids_area" | "deadlines" | "payments" | 
    "calculator" | "reviews" | "settings"
  >("overview");

  const [sidebarCollapsible, setSidebarCollapsible] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  // ==========================================
  // STATE MANAGEMENT UPGRADES
  // ==========================================

  // 1. Celebration Calendar Manual Blocks
  const [customBlockedDates, setCustomBlockedDates] = useState<{ date: string; label: string }[]>([
    { date: "2026-06-15", label: "Structural Rebuilding Block" },
    { date: "2026-06-28", label: "Premium VIP Prep Window" }
  ]);
  const [premiumDates, setPremiumDates] = useState<string[]>(["2026-06-07", "2026-06-14", "2026-06-21"]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockLabel, setBlockLabel] = useState("");

  // 2. Booking CRUD forms
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingCustName, setBookingCustName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingGuests, setBookingGuests] = useState(300);
  const [bookingSpaceId, setBookingSpaceId] = useState("open-wedding");
  const [bookingType, setBookingType] = useState("Wedding");
  const [bookingSession, setBookingSession] = useState<"Morning" | "Evening" | "Full Day">("Full Day");

  // 3. Leads/Inquiries CRUD forms
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadCustName, setLeadCustName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadDate, setLeadDate] = useState("");
  const [leadGuests, setLeadGuests] = useState(150);
  const [leadType, setLeadType] = useState("Wedding");
  const [leadSpaceId, setLeadSpaceId] = useState("open-wedding");
  const [leadSession, setLeadSession] = useState<"Morning" | "Evening" | "Full Day">("Evening");
  const [leadRequirements, setLeadRequirements] = useState("");

  // 4. Venue Space CRUD forms
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState<VenueSpace | null>(null);
  const [spaceName, setSpaceName] = useState("");
  const [spaceCapacity, setSpaceCapacity] = useState(500);
  const [spacePrice, setSpacePrice] = useState(120000);
  const [spaceDesc, setSpaceDesc] = useState("");
  const [spaceImg, setSpaceImg] = useState("https://images.unsplash.com/photo-1519741497674-611481863552");
  const [spaceCategory, setSpaceCategory] = useState("wedding");

  // 5. Deadlines & Workflow tasks
  const [workflowTasks, setWorkflowTasks] = useState([
    { id: "DL-101", eventName: "Rahul Wedding", daysBefore: 30, desc: "Finalize catering menu layout", date: "2026-06-18", status: "Completed", urgency: "Normal" },
    { id: "DL-102", eventName: "Rahul Wedding", daysBefore: 20, desc: "Confirm decorator structural theme", date: "2026-06-28", status: "In Progress", urgency: "Urgent" },
    { id: "DL-103", eventName: "TechCorp Meet", daysBefore: 10, desc: "Order conference stage materials", date: "2026-06-10", status: "Waiting", urgency: "Overdue" },
    { id: "DL-104", eventName: "Ananya Reception", daysBefore: 5, desc: "Suite preparation & welcome packs", date: "2026-06-17", status: "Not Started", urgency: "Normal" }
  ]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [wfEvent, setWfEvent] = useState("");
  const [wfDays, setWfDays] = useState(15);
  const [wfDesc, setWfDesc] = useState("");
  const [wfDate, setWfDate] = useState("");
  const [wfStatus, setWfStatus] = useState("Not Started");
  const [wfUrgency, setWfUrgency] = useState("Normal");
  const [editingWfId, setEditingWfId] = useState<string | null>(null);

  // 6. Bride & Groom Suites Management
  const [bridalSuites, setBridalSuites] = useState([
    { id: "BS-01", name: "Grand Bridal Suite Alpha", conditionStatus: "Prepared", roomsBooked: 2, butler: "Prema Latha", notes: "Champagne on ice" },
    { id: "BS-02", name: "Groom Suite Imperial", conditionStatus: "Occupied", roomsBooked: 1, butler: "Velu Swamy", notes: "Acoustic layout request" },
    { id: "BS-03", name: "Family Premium Lounge", conditionStatus: "Cleaning", roomsBooked: 4, butler: "Gopal Swamy", notes: "Premium flower alignments" }
  ]);
  const [showBridalModal, setShowBridalModal] = useState(false);
  const [editingBridalId, setEditingBridalId] = useState<string | null>(null);
  const [bridalName, setBridalName] = useState("");
  const [bridalCondition, setBridalCondition] = useState("Prepared");
  const [bridalRooms, setBridalRooms] = useState(1);
  const [bridalButler, setBridalButler] = useState("");
  const [bridalNotes, setBridalNotes] = useState("");

  // 7. Kids Play Zone Management
  const [kidsZones, setKidsZones] = useState([
    { id: "KZ-01", activityName: "Attendants On-Duty (Recreation Zone)", attendantName: "Prema Latha", capacity: 45, safetyStatus: "Certified", status: "Active", notes: "Requires nursery license validation" },
    { id: "KZ-02", activityName: "Mini Candy Buffet & Ice Cream Stall", attendantName: "Gopal Swamy", capacity: 30, safetyStatus: "Certified", status: "Active", notes: "Setup completed on arrival" },
    { id: "KZ-03", activityName: "Ball Pit & Balloon Inflatable Castle", attendantName: "Velu Swamy", capacity: 50, safetyStatus: "Pending", status: "Closed", notes: "Structural integrity soundness review pending" }
  ]);
  const [showKidsModal, setShowKidsModal] = useState(false);
  const [editingKidsId, setEditingKidsId] = useState<string | null>(null);
  const [kidsActivity, setKidsActivity] = useState("");
  const [kidsAttendant, setKidsAttendant] = useState("");
  const [kidsCapacity, setKidsCapacity] = useState(30);
  const [kidsSafety, setKidsSafety] = useState("Certified");
  const [kidsStatus, setKidsStatus] = useState("Active");
  const [kidsNotes, setKidsNotes] = useState("");

  // 8. Procurement & Orders (Merged inside Decorator tab)
  const [procureOrders, setProcureOrders] = useState([
    { id: "ORD-3245", eventName: "Rahul Wedding", vendor: "Elite Florals", category: "Flowers", items: "White Roses + Orchids", qty: 250, date: "2026-06-15", status: "In Transit", payment: "Partial Paid", priority: "High" },
    { id: "ORD-3246", eventName: "TechCorp Meet", vendor: "Kovai Furnitures", category: "Chairs", items: "Gold Banquet Chairs", qty: 300, date: "2026-06-18", status: "Delivered", payment: "Paid", priority: "High" },
    { id: "ORD-3247", eventName: "Ananya Reception", vendor: "BrightGlow Lights", category: "Lighting", items: "Cascade LED Sparklers", qty: 45, date: "2026-06-22", status: "Ordered", payment: "Pending", priority: "Medium" }
  ]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrderVendor, setNewOrderVendor] = useState("");
  const [newOrderItems, setNewOrderItems] = useState("");
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderDate, setNewOrderDate] = useState("");
  const [newOrderPriority, setNewOrderPriority] = useState("Medium");
  const [newOrderCategory, setNewOrderCategory] = useState("Flowers");
  const [newOrderEvent, setNewOrderEvent] = useState("");
  const [newOrderPayment, setNewOrderPayment] = useState("Pending");

  // 9. Detailed Payments & Finance
  const [detailedPayments, setDetailedPayments] = useState([
    { id: "TXN-9081", bookingId: "GAAR1024", customerName: "Rohan Kumar", amount: 50000, mode: "UPI Transfer", referenceId: "UPI908234812", date: "2026-05-24", status: "Successful" },
    { id: "TXN-9082", bookingId: "GAAR1025", customerName: "Anjali Sharma", amount: 150000, mode: "Net Banking", referenceId: "NET98342342", date: "2026-05-25", status: "Successful" },
    { id: "TXN-9083", bookingId: "GAAR1026", customerName: "Siddharth Sen", amount: 35000, mode: "Credit Card", referenceId: "CC89234871", date: "2026-05-26", status: "Pending" }
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payBookingId, setPayBookingId] = useState("");
  const [payCustName, setPayCustName] = useState("");
  const [payAmount, setPayAmount] = useState(0);
  const [payMode, setPayMode] = useState("UPI Transfer");
  const [payRef, setPayRef] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payStatus, setPayStatus] = useState("Successful");

  // Payment detailed modal view
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<any>(null);

  // Decorator page sub-tabs: Projects vs Procurement Supply
  const [decorViewSubTab, setDecorViewSubTab] = useState<"projects" | "procurement">("projects");

  const [decorTasks, setDecorTasks] = useState([
    { id: "DT-01", event: "Rahul Wedding", materials: "White Roses, Golden Mandap", deadline: "2026-06-24", budget: 45000, staff: "Ramesh Selvan + 4", progress: 65, status: "Preparing" },
    { id: "DT-02", event: "Corporate Banquet", materials: "Stage Backdrop Screen, Mic Stands", deadline: "2026-06-20", budget: 20000, staff: "Ramesh Selvan + 2", progress: 90, status: "Setup Started" }
  ]);
  const [showDecorModal, setShowDecorModal] = useState(false);
  const [newDecorEvent, setNewDecorEvent] = useState("");
  const [newDecorMaterials, setNewDecorMaterials] = useState("");
  const [newDecorDeadline, setNewDecorDeadline] = useState("");
  const [newDecorBudget, setNewDecorBudget] = useState(0);
  const [newDecorStaff, setNewDecorStaff] = useState("");
  const [newDecorProgress, setNewDecorProgress] = useState(0);
  const [newDecorStatus, setNewDecorStatus] = useState("Preparing");

  // Other pre-existing subtab states
  const [cateringTasks, setCateringTasks] = useState([
    { id: "CT-01", event: "Rahul Wedding", guests: 500, menu: "Royal South Indian & Continental Buffet", chef: "Chef Murugan", stage: "Ingredients Procurement", readiness: 40 },
    { id: "CT-02", event: "Corporate Buffet", guests: 250, menu: "Executive Lunch & Evening High Tea", chef: "Chef Karthik", stage: "Menu Finalized", readiness: 15 }
  ]);
  const [showCateringModal, setShowCateringModal] = useState(false);
  const [newCateringEvent, setNewCateringEvent] = useState("");
  const [newCateringGuests, setNewCateringGuests] = useState(100);
  const [newCateringMenu, setNewCateringMenu] = useState("");
  const [newCateringChef, setNewCateringChef] = useState("");
  const [newCateringStage, setNewCateringStage] = useState("Menu Finalized");
  const [newCateringReadiness, setNewCateringReadiness] = useState(0);

  const [photoShoots, setPhotoShoots] = useState([
    { id: "PS-01", title: "Rahul Wedding Shoot", date: "2026-06-24", details: "Drone cinematic layout + 2 Candid Photographers", type: "Wedding" },
    { id: "PS-02", title: "TechCorp Executive Group Shoot", date: "2026-06-20", details: "Stage projection group layout", type: "Corporate" }
  ]);
  const [showPhotoShootModal, setShowPhotoShootModal] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoDate, setNewPhotoDate] = useState("");
  const [newPhotoDetails, setNewPhotoDetails] = useState("");
  const [newPhotoType, setNewPhotoType] = useState("Wedding");

  const [calcGuests, setCalcGuests] = useState(500);
  const [calcSpace, setCalcSpace] = useState("open-wedding");
  const [calcCatering, setCalcCatering] = useState(800); // price per guest
  const [calcDecor, setCalcDecor] = useState(45000);
  const [calcPhotography, setCalcPhotography] = useState(35000);
  const [calcServicesSelected, setCalcServicesSelected] = useState<string[]>(["srv-valet"]);

  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  // Sidebar link items (Exact 15 Items now that orders is merged)
  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: Sliders },
    { id: "calendar", label: "Celebration Calendar", icon: Calendar },
    { id: "bookings", label: "Booking Management", icon: ClipboardList },
    { id: "leads", label: "Venue Inquiries", icon: Briefcase },
    { id: "spaces", label: "Venue Spaces", icon: MapPin },
    { id: "decor_team", label: "Decoration Team", icon: Paintbrush },
    { id: "catering_team", label: "Catering Team", icon: Coffee },
    { id: "photo_team", label: "Photography Team", icon: Camera },
    { id: "bridal_amenities", label: "Bride & Groom Amenities", icon: Sparkles },
    { id: "kids_area", label: "Kids Area", icon: Smile },
    { id: "deadlines", label: "Deadlines & Workflow", icon: Clock },
    { id: "payments", label: "Payments & Finance", icon: DollarSign },
    { id: "calculator", label: "Event Cost Calculator", icon: Calculator },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Sliders }
  ];

  // Overview calculations
  const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.pricing.total, 0) + detailedPayments.reduce((s, p) => s + p.amount, 0) * 0.18;
  const totalPaymentsReceived = bookings.reduce((sum, b) => sum + b.pricing.advancePaid, 0) + detailedPayments.reduce((s, p) => s + p.amount, 0);
  const totalPendingPayments = bookings.reduce((sum, b) => sum + b.pricing.remainingBalance, 0);

  // Cost calculator estimates
  const estBase = spaces.find(s => s.id === calcSpace)?.basePrice || 150000;
  const estFood = calcGuests * calcCatering;
  const estSubtotal = estBase + estFood + calcDecor + calcPhotography + (calcServicesSelected.length * 15000);
  const estTax = Math.round(estSubtotal * 0.18);
  const estTotal = estSubtotal + estTax;

  // Actions handlers
  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockLabel) return;
    setCustomBlockedDates([...customBlockedDates, { date: blockDate, label: blockLabel }]);
    setBlockDate("");
    setBlockLabel("");
    setShowBlockModal(false);
    alert("Administrative calendar date blockage locked and synced successfully!");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCustName || !bookingPhone || !bookingEmail || !bookingDate) return;

    if (editingBooking) {
      const updated: Booking = {
        ...editingBooking,
        customerName: bookingCustName,
        customerPhone: bookingPhone,
        customerEmail: bookingEmail,
        date: bookingDate,
        guestCount: bookingGuests,
        spaceId: bookingSpaceId,
        eventType: bookingType,
        sessionTime: bookingSession
      };
      updateBooking(updated);
      setEditingBooking(null);
      alert("Booking details updated successfully!");
    } else {
      const result = addBooking({
        customerName: bookingCustName,
        customerPhone: bookingPhone,
        customerEmail: bookingEmail,
        date: bookingDate,
        guestCount: bookingGuests,
        spaceId: bookingSpaceId,
        eventType: bookingType,
        sessionTime: bookingSession,
        services: [],
        customRequirements: "Console generated booking entry."
      }, true);

      if (result.success) {
        alert(`New operational booking successfully secured! Locked with Booking ID: ${result.bookingId}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    }

    setShowBookingModal(false);
    // Reset
    setBookingCustName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingDate("");
  };

  const startEditBooking = (b: Booking) => {
    setEditingBooking(b);
    setBookingCustName(b.customerName);
    setBookingPhone(b.customerPhone);
    setBookingEmail(b.customerEmail);
    setBookingDate(b.date);
    setBookingGuests(b.guestCount);
    setBookingSpaceId(b.spaceId);
    setBookingType(b.eventType);
    setBookingSession(b.sessionTime);
    setShowBookingModal(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCustName || !leadPhone || !leadEmail || !leadDate) return;

    if (editingLead) {
      // Modify Lead in place
      const updated = leads.map(l => l.id === editingLead.id ? {
        ...l,
        name: leadCustName,
        phone: leadPhone,
        email: leadEmail,
        preferredDate: leadDate,
        guestCount: leadGuests,
        eventType: leadType,
        preferredSpaceId: leadSpaceId,
        preferredSession: leadSession,
        requirements: leadRequirements
      } : l);
      alert("Lead updated successfully!");
      setEditingLead(null);
    } else {
      addLead({
        name: leadCustName,
        phone: leadPhone,
        email: leadEmail,
        preferredDate: leadDate,
        guestCount: leadGuests,
        eventType: leadType,
        preferredSpaceId: leadSpaceId,
        preferredSession: leadSession,
        requirements: leadRequirements || "Expert callback requested.",
        source: "Administrative CRM Portal"
      });
      alert("New operational lead inquiry logged successfully!");
    }

    setShowLeadModal(false);
    setLeadCustName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadDate("");
    setLeadRequirements("");
  };

  const startEditLead = (l: Lead) => {
    setEditingLead(l);
    setLeadCustName(l.name);
    setLeadPhone(l.phone);
    setLeadEmail(l.email);
    setLeadDate(l.preferredDate);
    setLeadGuests(l.guestCount);
    setLeadType(l.eventType);
    setLeadSpaceId(l.preferredSpaceId);
    setLeadSession(l.preferredSession);
    setLeadRequirements(l.requirements);
    setShowLeadModal(true);
  };

  const handleSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceName || !spaceDesc) return;

    if (editingSpace) {
      updateSpaceDetails(editingSpace.id, {
        name: spaceName,
        capacity: spaceCapacity,
        basePrice: spacePrice,
        description: spaceDesc,
        image: spaceImg,
        category: spaceCategory
      });
      setEditingSpace(null);
      alert("Venue space details successfully updated and propagated!");
    } else {
      addSpace({
        name: spaceName,
        capacity: spaceCapacity,
        basePrice: spacePrice,
        description: spaceDesc,
        image: spaceImg,
        category: spaceCategory
      });
      alert("New luxury venue space successfully created!");
    }
    setShowSpaceModal(false);
    setSpaceName("");
    setSpaceDesc("");
    setSpacePrice(120000);
  };

  const startEditSpace = (s: VenueSpace) => {
    setEditingSpace(s);
    setSpaceName(s.name);
    setSpaceCapacity(s.capacity);
    setSpacePrice(s.basePrice);
    setSpaceDesc(s.description);
    setSpaceImg(s.image);
    setSpaceCategory(s.category);
    setShowSpaceModal(true);
  };

  const handleWfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfEvent || !wfDesc || !wfDate) return;

    if (editingWfId) {
      setWorkflowTasks(workflowTasks.map(t => t.id === editingWfId ? {
        ...t, eventName: wfEvent, daysBefore: wfDays, desc: wfDesc, date: wfDate, status: wfStatus, urgency: wfUrgency
      } : t));
      setEditingWfId(null);
      alert("Workflow milestone task successfully updated!");
    } else {
      setWorkflowTasks([...workflowTasks, {
        id: `DL-${Math.floor(105 + Math.random() * 900)}`,
        eventName: wfEvent,
        daysBefore: wfDays,
        desc: wfDesc,
        date: wfDate,
        status: wfStatus,
        urgency: wfUrgency
      }]);
      alert("New critical deadline milestone logged in dispatcher timeline!");
    }
    setShowWorkflowModal(false);
    setWfEvent("");
    setWfDesc("");
    setWfDate("");
  };

  const startEditWf = (t: any) => {
    setEditingWfId(t.id);
    setWfEvent(t.eventName);
    setWfDays(t.daysBefore);
    setWfDesc(t.desc);
    setWfDate(t.date);
    setWfStatus(t.status);
    setWfUrgency(t.urgency);
    setShowWorkflowModal(true);
  };

  const handleBridalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bridalName || !bridalButler) return;

    if (editingBridalId) {
      setBridalSuites(bridalSuites.map(s => s.id === editingBridalId ? {
        ...s, name: bridalName, conditionStatus: bridalCondition, roomsBooked: bridalRooms, butler: bridalButler, notes: bridalNotes
      } : s));
      setEditingBridalId(null);
      alert("Bridal Suite operational details successfully updated!");
    } else {
      setBridalSuites([...bridalSuites, {
        id: `BS-${Math.floor(104 + Math.random() * 900)}`,
        name: bridalName,
        conditionStatus: bridalCondition,
        roomsBooked: bridalRooms,
        butler: bridalButler,
        notes: bridalNotes
      }]);
      alert("New 5-star Bridal Suite alignment successfully logged!");
    }
    setShowBridalModal(false);
    setBridalName("");
    setBridalButler("");
    setBridalNotes("");
  };

  const startEditBridal = (s: any) => {
    setEditingBridalId(s.id);
    setBridalName(s.name);
    setBridalCondition(s.conditionStatus);
    setBridalRooms(s.roomsBooked);
    setBridalButler(s.butler);
    setBridalNotes(s.notes);
    setShowBridalModal(true);
  };

  const handleKidsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidsActivity || !kidsAttendant) return;

    if (editingKidsId) {
      setKidsZones(kidsZones.map(z => z.id === editingKidsId ? {
        ...z, activityName: kidsActivity, attendantName: kidsAttendant, capacity: kidsCapacity, safetyStatus: kidsSafety, status: kidsStatus, notes: kidsNotes
      } : z));
      setEditingKidsId(null);
      alert("Kids zone attendant registry successfully updated!");
    } else {
      setKidsZones([...kidsZones, {
        id: `KZ-${Math.floor(104 + Math.random() * 900)}`,
        activityName: kidsActivity,
        attendantName: kidsAttendant,
        capacity: kidsCapacity,
        safetyStatus: kidsSafety,
        status: kidsStatus,
        notes: kidsNotes
      }]);
      alert("New Kids play zone registry logged successfully!");
    }
    setShowKidsModal(false);
    setKidsActivity("");
    setKidsAttendant("");
    setKidsNotes("");
  };

  const startEditKids = (z: any) => {
    setEditingKidsId(z.id);
    setKidsActivity(z.activityName);
    setKidsAttendant(z.attendantName);
    setKidsCapacity(z.capacity);
    setKidsSafety(z.safetyStatus);
    setKidsStatus(z.status);
    setKidsNotes(z.notes);
    setShowKidsModal(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCustName || !payAmount || !payDate) return;

    setDetailedPayments([...detailedPayments, {
      id: `TXN-${Math.floor(9084 + Math.random() * 9000)}`,
      bookingId: payBookingId || "CUSTOM-LOG",
      customerName: payCustName,
      amount: payAmount,
      mode: payMode,
      referenceId: payRef || `REF${Math.floor(100000 + Math.random() * 900000)}`,
      date: payDate,
      status: payStatus
    }]);

    setShowPaymentModal(false);
    setPayCustName("");
    setPayBookingId("");
    setPayAmount(0);
    setPayRef("");
    alert("New payment transaction successfully logged in financial ledgers!");
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderVendor || !newOrderItems) return;
    const newOrd = {
      id: `ORD-${Math.floor(3248 + Math.random() * 9000)}`,
      eventName: newOrderEvent || "Custom Setup",
      vendor: newOrderVendor,
      category: newOrderCategory,
      items: newOrderItems,
      qty: newOrderQty,
      date: newOrderDate || "2026-06-20",
      status: "Ordered",
      payment: newOrderPayment,
      priority: newOrderPriority
    };
    setProcureOrders([newOrd, ...procureOrders]);
    setShowOrderModal(false);
    setNewOrderVendor("");
    setNewOrderItems("");
    setNewOrderQty(1);
    setNewOrderDate("");
    alert("New procurement order dispatched and logged inside Decor Supply Chain!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-cream)", overflow: "hidden", width: "100%" }}>
      
      {/* ==============================================================
          LEFT SECURED GLASS SIDEBAR PANEL
          ============================================================== */}
      <aside style={{
        width: sidebarCollapsible ? "80px" : "280px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        color: "#171717",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        borderRight: "1px solid rgba(198, 161, 91, 0.35)",
        flexShrink: 0,
        zIndex: 30,
        position: "relative",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)"
      }}>
        {/* Header Title */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(198, 161, 91, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          overflow: "hidden",
          whiteSpace: "nowrap"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #C6A15B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Flower size={18} color="#C6A15B" />
          </div>
          {!sidebarCollapsible && (
            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", letterSpacing: "0.05em", color: "#171717" }}>GAARLANDZ OS</span>
              <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "#C6A15B", letterSpacing: "0.15em", fontWeight: "700" }}>Secured Operations</span>
            </div>
          )}
        </div>

        {/* Navigation Sidebar List */}
        <nav style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          {sidebarLinks.map((link) => {
            const isActive = activeAdminSubTab === link.id;
            const LinkIcon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => setActiveAdminSubTab(link.id as any)}
                className="sidebar-nav-btn"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "none",
                  borderLeft: isActive ? "4px solid #C6A15B" : "4px solid transparent",
                  backgroundColor: isActive ? "rgba(198, 161, 91, 0.08)" : "transparent",
                  color: isActive ? "#171717" : "#5A5A5A",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                title={link.label}
              >
                <LinkIcon size={18} color={isActive ? "#C6A15B" : "#5A5A5A"} style={{ flexShrink: 0 }} />
                {!sidebarCollapsible && (
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: isActive ? "700" : "500",
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {link.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer controls & Collapsible Switch */}
        <div style={{
          padding: "16px",
          borderTop: "1px solid rgba(198, 161, 91, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <button
            onClick={() => setSidebarCollapsible(!sidebarCollapsible)}
            style={{
              background: "none",
              border: "none",
              color: "#5A5A5A",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              fontWeight: "600",
              opacity: 0.8
            }}
          >
            {sidebarCollapsible ? <ArrowRight size={16} /> : <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><ChevronLeft size={16} /> Collapse Menu</span>}
          </button>
          
          <button
            onClick={onLogout}
            style={{
              backgroundColor: "rgba(244, 67, 54, 0.08)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              color: "#F44336",
              padding: "10px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              fontWeight: "700"
            }}
          >
            <LogOut size={14} color="#F44336" />
            {!sidebarCollapsible && "Exit Console"}
          </button>
        </div>
      </aside>

      {/* ==============================================================
          MAIN CONTENT AREA
          ============================================================= */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        height: "100vh"
      }}>
        
        {/* Top Control Bar */}
        <header style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid rgba(198, 161, 91, 0.2)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 25
        }}>
          <div>
            <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#C6A15B", letterSpacing: "0.15em", fontWeight: "700" }}>Secured Gateway</span>
            <h2 style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)" }}>Operations Dashboard Console</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#C6A15B",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.95rem"
              }}>
                G
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#171717" }}>Gaarlandz Expert</span>
                <span style={{ fontSize: "0.55rem", color: "#5A5A5A", textTransform: "uppercase" }}>Console Manager</span>
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: "40px", flex: 1, width: "100%" }}>
          
          {/* ==============================================================
              1. OVERVIEW DASHBOARD
              ============================================================== */}
          {activeAdminSubTab === "overview" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div>
                <span className="floral-badge" style={{ marginBottom: "8px" }}><Sparkles size={10} /> Operational Vitals</span>
                <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", color: "#171717" }}>Dashboard Overview</h2>
              </div>

              {/* KPI Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Secured Bookings</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>{bookings.length} Locked Events</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Briefcase size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Open Inquiries</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>{leads.length} Active Leads</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DollarSign size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Outstanding Receivables</span>
                    <strong style={{ fontSize: "1.1rem", color: "#F44336" }}>₹{totalPendingPayments.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Occupancy and Activities log */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div className="luxury-card">
                  <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid rgba(198,161,91,0.2)", paddingBottom: "10px", marginBottom: "16px" }}>Automation Log</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto" }}>
                    {automationLogs.map(log => (
                      <div key={log.id} style={{ borderLeft: "2px solid #C6A15B", paddingLeft: "14px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>Booking ID: {log.bookingId} Sync</span>
                        <p style={{ fontSize: "0.7rem", color: "#5A5A5A", margin: "2px 0 0 0" }}>{log.actions.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <strong style={{ fontSize: "3.2rem", color: "#C6A15B", fontFamily: "var(--font-serif)" }}>84%</strong>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#5A5A5A", letterSpacing: "0.05em" }}>Operational Capacity Occupied</span>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              2. CELEBRATION CALENDAR
              ============================================================== */}
          {activeAdminSubTab === "calendar" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Celebration Calendar</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Review locked dates, manually block administrative slots, and configure premium pricing dates.</p>
                </div>
                <button onClick={() => setShowBlockModal(true)} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Block Custom Date
                </button>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", textAlign: "center", marginBottom: "32px" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <strong key={d} style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#5A5A5A" }}>{d}</strong>
                ))}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const day = idx + 1;
                  const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
                  const hasBooking = bookings.some(b => b.date === dateStr);
                  const isCustomBlocked = customBlockedDates.some(cbd => cbd.date === dateStr);
                  const isPremium = premiumDates.includes(dateStr);
                  
                  return (
                    <div key={idx} style={{
                      padding: "16px 8px",
                      borderRadius: "12px",
                      backgroundColor: hasBooking || isCustomBlocked ? "rgba(244, 67, 54, 0.08)" : (isPremium ? "rgba(198, 161, 91, 0.15)" : "#FAF9F5"),
                      border: hasBooking || isCustomBlocked ? "1px solid rgba(244, 67, 54, 0.2)" : (isPremium ? "1px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)"),
                      minHeight: "90px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      if (premiumDates.includes(dateStr)) {
                        setPremiumDates(premiumDates.filter(d => d !== dateStr));
                      } else {
                        setPremiumDates([...premiumDates, dateStr]);
                      }
                    }}
                    title="Click to toggle premium date status"
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{day}</span>
                      {hasBooking && <span style={{ fontSize: "0.55rem", backgroundColor: "#C6A15B", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>Secured</span>}
                      {isCustomBlocked && <span style={{ fontSize: "0.55rem", backgroundColor: "#F44336", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>Blocked</span>}
                      {isPremium && !hasBooking && !isCustomBlocked && <span style={{ fontSize: "0.55rem", backgroundColor: "#E0A96D", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>Premium</span>}
                    </div>
                  );
                })}
              </div>

              {/* Blocked and Premium Management Panels */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div className="luxury-card">
                  <h4 style={{ fontSize: "1rem", marginBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "8px" }}>Active Custom Blocks</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {customBlockedDates.map(cbd => (
                      <div key={cbd.date} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", backgroundColor: "#FAF9F5", padding: "10px 14px", borderRadius: "10px" }}>
                        <div>
                          <strong>{cbd.date}</strong> - <span style={{ color: "#5A5A5A" }}>{cbd.label}</span>
                        </div>
                        <button onClick={() => setCustomBlockedDates(customBlockedDates.filter(c => c.date !== cbd.date))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="luxury-card">
                  <h4 style={{ fontSize: "1rem", marginBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "8px" }}>Premium Pricing Calendar Slots</h4>
                  <p style={{ fontSize: "0.75rem", color: "#5A5A5A", marginBottom: "12px" }}>These dates will automatically trigger the auspicious peak pricing surcharge inside the booking engine.</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {premiumDates.map(pd => (
                      <span key={pd} style={{ fontSize: "0.75rem", padding: "6px 12px", borderRadius: "20px", backgroundColor: "rgba(198,161,91,0.12)", color: "#C6A15B", fontWeight: "700" }}>
                        {pd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* DRAGGABLE MANUAL BLOCK DATE MODAL */}
              {showBlockModal && (
                <DraggableModal title="Block Date Administratively" onClose={() => setShowBlockModal(false)} maxWidth="440px">
                  <form onSubmit={handleBlockDate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Select Block Target Date</label>
                      <input type="date" required value={blockDate} onChange={e => setBlockDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Block Description/Notes</label>
                      <input type="text" required value={blockLabel} onChange={e => setBlockLabel(e.target.value)} placeholder="e.g. Garden structural works" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.85rem" }} />
                    </div>
                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>Dispatch Block Lock</button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              3. BOOKING MANAGEMENT LEDGER
              ============================================================== */}
          {activeAdminSubTab === "bookings" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Booking Management Ledger</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Administrative register to control locked bookings, edit client schedules, and discharge accounts.</p>
                </div>
                <button onClick={() => { setEditingBooking(null); setShowBookingModal(true); }} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Create Booking
                </button>
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Booking ID</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event details</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Date locked</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Guests</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Total balance</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{b.id}</strong></td>
                        <td style={{ padding: "12px" }}>
                          <div><strong>{b.customerName}</strong></div>
                          <div style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>{b.customerPhone}</div>
                        </td>
                        <td style={{ padding: "12px" }}>{b.eventType} ({b.sessionTime})</td>
                        <td style={{ padding: "12px" }}>{b.date}</td>
                        <td style={{ padding: "12px" }}>{b.guestCount}</td>
                        <td style={{ padding: "12px" }}>₹{b.pricing.total.toLocaleString()}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.65rem",
                            fontWeight: "700",
                            backgroundColor: b.status === "Confirmed" ? "rgba(198, 161, 91, 0.12)" : "rgba(0,0,0,0.06)",
                            color: b.status === "Confirmed" ? "#C6A15B" : "#171717"
                          }}>{b.status}</span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button onClick={() => startEditBooking(b)} className="luxury-btn-outline" style={{ padding: "4px 8px", fontSize: "0.65rem", display: "inline-flex", gap: "4px", alignItems: "center" }}>
                              <Edit3 size={12} /> Edit
                            </button>
                            <button onClick={() => deleteBooking(b.id)} style={{ padding: "4px 8px", fontSize: "0.65rem", backgroundColor: "rgba(244,67,54,0.1)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", display: "inline-flex", gap: "4px", alignItems: "center" }}>
                              <Trash2 size={12} /> Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DRAGGABLE BOOKING MODAL FORM */}
              {showBookingModal && (
                <DraggableModal title={editingBooking ? "Edit Booking Details" : "Create New Event Booking"} onClose={() => setShowBookingModal(false)} maxWidth="560px">
                  <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Client Full Name *</label>
                        <input required type="text" value={bookingCustName} onChange={e => setBookingCustName(e.target.value)} placeholder="e.g. Rahul Sharma" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Contact Phone *</label>
                        <input required type="text" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="+91 99887 76655" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Email Address *</label>
                      <input required type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} placeholder="client@example.com" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Lock Target Date *</label>
                        <input required type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Total Guests *</label>
                        <input required type="number" value={bookingGuests} onChange={e => setBookingGuests(parseInt(e.target.value) || 100)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Venue Space Selection</label>
                        <select value={bookingSpaceId} onChange={e => setBookingSpaceId(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Session Slot</label>
                        <select value={bookingSession} onChange={e => setBookingSession(e.target.value as any)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option value="Morning">Morning Function</option>
                          <option value="Evening">Evening Gala</option>
                          <option value="Full Day">Full Day Block</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Theme Category</label>
                      <select value={bookingType} onChange={e => setBookingType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                        <option>Wedding</option>
                        <option>Corporate Expo</option>
                        <option>Engagement Meet</option>
                        <option>Photoshoot Shoot</option>
                      </select>
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingBooking ? "Save Alignment Sync" : "Deploy Operational Booking"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              4. VENUE INQUIRIES CRM
              ============================================================== */}
          {activeAdminSubTab === "leads" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Venue Inquiries CRM</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Monitor client-side website callback logs, negotiate contract deals, and sync reservations.</p>
                </div>
                <button onClick={() => { setEditingLead(null); setShowLeadModal(true); }} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Log New Inquiry
                </button>
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Lead ID</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Customer Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Target Date</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event Category</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Source Channel</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Current Status</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{l.id}</strong></td>
                        <td style={{ padding: "12px" }}>
                          <div><strong>{l.name}</strong></div>
                          <div style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>{l.phone}</div>
                        </td>
                        <td style={{ padding: "12px" }}>{l.preferredDate}</td>
                        <td style={{ padding: "12px" }}>{l.eventType}</td>
                        <td style={{ padding: "12px" }}>{l.source}</td>
                        <td style={{ padding: "12px" }}>
                          <select value={l.status} onChange={e => updateLeadStatus(l.id, e.target.value as any)} style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.12)", outline: "none" }}>
                            <option value="New">New Lead</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Negotiating">Negotiating</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {l.status !== "Converted" && (
                              <button onClick={() => convertLeadToBooking(l.id, 50000)} className="luxury-btn-primary" style={{ padding: "4px 8px", fontSize: "0.65rem" }}>
                                Convert
                              </button>
                            )}
                            <button onClick={() => startEditLead(l)} className="sidebar-nav-btn" style={{ padding: "4px 8px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", cursor: "pointer", display: "inline-flex", gap: "2px", alignItems: "center" }}>
                              <Edit3 size={11} /> Edit
                            </button>
                            <button onClick={() => deleteLead(l.id)} style={{ padding: "4px 8px", backgroundColor: "rgba(244,67,54,0.1)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", display: "inline-flex", gap: "2px", alignItems: "center" }}>
                              <Trash2 size={11} /> Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DRAGGABLE INQUIRY MODAL CRM */}
              {showLeadModal && (
                <DraggableModal title={editingLead ? "Edit Inquiry Log" : "Log Manual Enquiry CRM"} onClose={() => setShowLeadModal(false)} maxWidth="560px">
                  <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Name *</label>
                        <input required type="text" value={leadCustName} onChange={e => setLeadCustName(e.target.value)} placeholder="Meghna Nair" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Phone *</label>
                        <input required type="text" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+91 90909 09090" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Email *</label>
                      <input required type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="meghna@outlook.com" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Target Date *</label>
                        <input required type="date" value={leadDate} onChange={e => setLeadDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Total Guests</label>
                        <input required type="number" value={leadGuests} onChange={e => setLeadGuests(parseInt(e.target.value) || 100)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Space Selection</label>
                        <select value={leadSpaceId} onChange={e => setLeadSpaceId(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Type</label>
                        <select value={leadType} onChange={e => setLeadType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Wedding</option>
                          <option>Reception</option>
                          <option>Corporate</option>
                          <option>Engagement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Acoustics & Theme Requirements</label>
                      <textarea value={leadRequirements} onChange={e => setLeadRequirements(e.target.value)} placeholder="Specify details..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem", height: "80px", resize: "none" }} />
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingLead ? "Save CRM Log Sync" : "Deploy Inquiry Log"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              5. VENUE SPACES CONFIG
              ============================================================== */}
          {activeAdminSubTab === "spaces" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Venue Spaces Configuration</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Add, configure, and align property pricing structures dynamically propagated to client booking paths.</p>
                </div>
                <button onClick={() => { setEditingSpace(null); setShowSpaceModal(true); }} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Create Space
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {spaces.map(sp => (
                  <div key={sp.id} className="luxury-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifySelf: "space-between" }}>
                    <div>
                      <img src={sp.image} alt={sp.name} style={{ width: "100%", height: "190px", objectFit: "cover" }} />
                      <div style={{ padding: "20px" }}>
                        <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{sp.name}</h4>
                        <p style={{ fontSize: "0.75rem", color: "#5A5A5A", marginBottom: "16px" }}>{sp.description}</p>
                      </div>
                    </div>

                    <div style={{ padding: "20px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "16px" }}>
                        <span>Capacity: <strong>{sp.capacity} Guests</strong></span>
                        <span>Base price: <strong>₹{sp.basePrice.toLocaleString()}</strong></span>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => startEditSpace(sp)} className="luxury-btn-outline" style={{ flex: 1, padding: "6px 0", fontSize: "0.75rem", justifyContent: "center" }}>
                          Edit Specs
                        </button>
                        <button onClick={() => deleteSpace(sp.id)} style={{ flex: 1, padding: "6px 0", backgroundColor: "rgba(244,67,54,0.08)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "0.75rem", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DRAGGABLE SPACE CRU MODAL */}
              {showSpaceModal && (
                <DraggableModal title={editingSpace ? "Modify Space Layout Specs" : "Add Luxury Venue Space"} onClose={() => setShowSpaceModal(false)} maxWidth="520px">
                  <form onSubmit={handleSpaceSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Space Layout Name *</label>
                      <input required type="text" value={spaceName} onChange={e => setSpaceName(e.target.value)} placeholder="e.g. Royal Meadow Sunset" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Base pricing (₹) *</label>
                        <input required type="number" value={spacePrice} onChange={e => setSpacePrice(parseInt(e.target.value) || 50000)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Max Guest Capacity *</label>
                        <input required type="number" value={spaceCapacity} onChange={e => setSpaceCapacity(parseInt(e.target.value) || 200)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Description Details</label>
                      <textarea required value={spaceDesc} onChange={e => setSpaceDesc(e.target.value)} placeholder="Structure brief..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem", height: "80px", resize: "none" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Theme Category</label>
                        <select value={spaceCategory} onChange={e => setSpaceCategory(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option value="wedding">Wedding Gala</option>
                          <option value="indoor">Indoor Banquet</option>
                          <option value="reception">Open Lawn Reception</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Preview Image URL</label>
                        <input type="text" value={spaceImg} onChange={e => setSpaceImg(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingSpace ? "Save Space Configuration" : "Deploy Luxury Space"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              6. DECORATION TEAM (Including Merged Orders & Procurement Tab)
              ============================================================== */}
          {activeAdminSubTab === "decor_team" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "28px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-serif)", color: "#171717" }}>Decorator Operations & Materials Procurement</h2>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginTop: "4px" }}>Examine structures layout timeline progress side-by-side with material procurement ledgers.</p>
                </div>
              </div>

              {/* DUAL SUB-TAB SELECTION */}
              <div style={{ display: "flex", gap: "14px", borderBottom: "1px solid rgba(198,161,91,0.2)", paddingBottom: "1px" }}>
                <button onClick={() => setDecorViewSubTab("projects")} style={{
                  padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem",
                  color: decorViewSubTab === "projects" ? "#C6A15B" : "#5A5A5A", borderBottom: decorViewSubTab === "projects" ? "3px solid #C6A15B" : "3px solid transparent"
                }}>
                  Decor Projects & Tasks
                </button>
                <button onClick={() => setDecorViewSubTab("procurement")} style={{
                  padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem",
                  color: decorViewSubTab === "procurement" ? "#C6A15B" : "#5A5A5A", borderBottom: decorViewSubTab === "procurement" ? "3px solid #C6A15B" : "3px solid transparent"
                }}>
                  Orders & Material Procurement
                </button>
              </div>

              {decorViewSubTab === "projects" ? (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowDecorModal(true)} className="luxury-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Plus size={15} /> Add Decor Project Task
                    </button>
                  </div>
                  {/* Task Register Table */}
                  <div className="luxury-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "rgba(198,161,91,0.04)", borderBottom: "1px solid rgba(198,161,91,0.15)" }}>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Event</th>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Materials</th>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Deadline</th>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Staff</th>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Progress</th>
                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {decorTasks.map(t => (
                            <tr key={t.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                              <td style={{ padding: "14px 16px" }}><strong>{t.event}</strong></td>
                              <td style={{ padding: "14px 16px", color: "#5A5A5A" }}>{t.materials}</td>
                              <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{t.deadline}</td>
                              <td style={{ padding: "14px 16px" }}>{t.staff}</td>
                              <td style={{ padding: "14px 16px", minWidth: "140px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.07)", height: "7px", borderRadius: "4px", overflow: "hidden" }}>
                                    <div style={{ width: `${t.progress}%`, background: "linear-gradient(90deg, #C6A15B, #D4AF37)", height: "7px", borderRadius: "4px" }} />
                                  </div>
                                  <span style={{ fontSize: "0.7rem", fontWeight: "700" }}>{t.progress}%</span>
                                </div>
                              </td>
                              <td style={{ padding: "14px 16px" }}>
                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: "700", backgroundColor: t.status === "Setup Started" ? "rgba(40,167,69,0.1)" : "rgba(198,161,91,0.1)", color: t.status === "Setup Started" ? "#28A745" : "#C6A15B" }}>{t.status}</span>
                              </td>
                              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                <button onClick={() => setDecorTasks(decorTasks.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Embedded Orders and Procurement */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "1.1rem" }}>Decor Materials Procurement Ledger</h4>
                    <button onClick={() => setShowOrderModal(true)} className="luxury-btn-primary" style={{ flexShrink: 0 }}><Plus size={16} /> Deploy Procurement Order</button>
                  </div>
                  <div className="luxury-card" style={{ padding: 0 }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                            <th style={{ padding: "12px", textAlign: "left" }}>Order ID</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Event Name</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Vendor</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Materials Items</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Qty</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Expected Date</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Payment</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {procureOrders.map(o => (
                            <tr key={o.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                              <td style={{ padding: "12px" }}><strong>{o.id}</strong></td>
                              <td style={{ padding: "12px" }}>{o.eventName}</td>
                              <td style={{ padding: "12px" }}>{o.vendor}</td>
                              <td style={{ padding: "12px" }}>{o.items}</td>
                              <td style={{ padding: "12px" }}>{o.qty}</td>
                              <td style={{ padding: "12px" }}>{o.date}</td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.7rem", backgroundColor: o.status === "Delivered" ? "rgba(40,167,69,0.1)" : "rgba(198,161,91,0.1)", color: o.status === "Delivered" ? "#28A745" : "#C6A15B" }}>{o.status}</span>
                              </td>
                              <td style={{ padding: "12px" }}>{o.payment}</td>
                              <td style={{ padding: "12px", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                                  <select onChange={(e) => {
                                    setProcureOrders(procureOrders.map(x => x.id === o.id ? { ...x, status: e.target.value } : x));
                                  }} value={o.status} style={{ fontSize: "0.75rem", padding: "4px", borderRadius: "6px" }}>
                                    <option value="Ordered">Ordered</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                  <button onClick={() => setProcureOrders(procureOrders.filter(x => x.id !== o.id))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* DRAGGABLE ADD DECOR TASK MODAL */}
              {showDecorModal && (
                <DraggableModal title="Add Decoration Project Task" onClose={() => setShowDecorModal(false)} maxWidth="520px">
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (!newDecorEvent || !newDecorMaterials) return;
                    setDecorTasks([...decorTasks, {
                      id: `DT-${String(Date.now()).slice(-4)}`,
                      event: newDecorEvent, materials: newDecorMaterials, deadline: newDecorDeadline,
                      budget: newDecorBudget, staff: newDecorStaff, progress: newDecorProgress, status: newDecorStatus
                    }]);
                    setNewDecorEvent(""); setNewDecorMaterials(""); setNewDecorDeadline(""); setNewDecorBudget(0); setNewDecorStaff(""); setNewDecorProgress(0);
                    setShowDecorModal(false);
                  }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Name *</label>
                        <input required value={newDecorEvent} onChange={e => setNewDecorEvent(e.target.value)} placeholder="e.g. Ananya Reception" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Deadline</label>
                        <input type="date" value={newDecorDeadline} onChange={e => setNewDecorDeadline(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    </div>
                    <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Required Materials *</label>
                      <input required value={newDecorMaterials} onChange={e => setNewDecorMaterials(e.target.value)} placeholder="White Roses, LED Pillars..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Staff Assigned</label>
                        <input value={newDecorStaff} onChange={e => setNewDecorStaff(e.target.value)} placeholder="Ramesh + 3" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Budget (₹)</label>
                        <input type="number" value={newDecorBudget} onChange={e => setNewDecorBudget(parseInt(e.target.value)||0)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    </div>
                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "4px" }}>Add to Decor Roster</button>
                  </form>
                </DraggableModal>
              )}

              {/* DRAGGABLE NEW PROCUREMENT ORDER MODAL */}
              {showOrderModal && (
                <DraggableModal title="Log Procurement Order" onClose={() => setShowOrderModal(false)} maxWidth="480px">
                  <form onSubmit={handleCreateOrder} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <input type="text" required placeholder="Vendor Name" value={newOrderVendor} onChange={(e) => setNewOrderVendor(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                    <input type="text" required placeholder="Associated Event Name" value={newOrderEvent} onChange={(e) => setNewOrderEvent(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                    <input type="text" required placeholder="Items Details (White Roses, Gold Chairs...)" value={newOrderItems} onChange={(e) => setNewOrderItems(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input type="number" required placeholder="Quantity" value={newOrderQty} onChange={(e) => setNewOrderQty(parseInt(e.target.value))} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      <select value={newOrderCategory} onChange={e => setNewOrderCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
                        <option>Flowers</option>
                        <option>Lighting</option>
                        <option>Stage Chairs</option>
                        <option>Backdrop</option>
                      </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input type="date" required value={newOrderDate} onChange={(e) => setNewOrderDate(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      <select value={newOrderPayment} onChange={e => setNewOrderPayment(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Partial Paid</option>
                      </select>
                    </div>
                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Deploy Procurement Order</button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              7. CATERING TEAM — Kitchen Ops
              ============================================================== */}
          {activeAdminSubTab === "catering_team" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "28px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-serif)", color: "#171717" }}>Catering & Kitchen Dashboard</h2>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginTop: "4px" }}>Manage wedding menus, chefs, ingredient procurements, and readiness indexes.</p>
                </div>
                <button onClick={() => setShowCateringModal(true)} className="luxury-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <Plus size={15} /> Add Catering Entry
                </button>
              </div>

              {/* Main Table */}
              <div className="luxury-card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "rgba(198,161,91,0.04)", borderBottom: "1px solid rgba(198,161,91,0.15)" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Event</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Guests</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Menu Layout</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Chef</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Stage</th>
                        <th style={{ padding: "12px 16px", textAlign: "left" }}>Readiness</th>
                        <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cateringTasks.map(c => (
                        <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "14px 16px" }}><strong>{c.event}</strong></td>
                          <td style={{ padding: "14px 16px" }}>{c.guests}</td>
                          <td style={{ padding: "14px 16px", color: "#5A5A5A" }}>{c.menu}</td>
                          <td style={{ padding: "14px 16px" }}>{c.chef}</td>
                          <td style={{ padding: "14px 16px", color: "#5A5A5A" }}>{c.stage}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.07)", height: "7px", borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: `${c.readiness}%`, backgroundColor: c.readiness >= 75 ? "#28A745" : c.readiness >= 40 ? "#C6A15B" : "#F44336", height: "7px", borderRadius: "4px" }} />
                              </div>
                              <span style={{ fontSize: "0.7rem", fontWeight: "700" }}>{c.readiness}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <button onClick={() => setCateringTasks(cateringTasks.filter(x => x.id !== c.id))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DRAGGABLE ADD CATERING MODAL */}
              {showCateringModal && (
                <DraggableModal title="Add Catering Entry" onClose={() => setShowCateringModal(false)} maxWidth="520px">
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (!newCateringEvent || !newCateringMenu) return;
                    setCateringTasks([...cateringTasks, {
                      id: `CT-${String(Date.now()).slice(-4)}`,
                      event: newCateringEvent, guests: newCateringGuests, menu: newCateringMenu,
                      chef: newCateringChef, stage: newCateringStage, readiness: newCateringReadiness
                    }]);
                    setNewCateringEvent(""); setNewCateringGuests(100); setNewCateringMenu(""); setNewCateringChef(""); setNewCateringStage("Menu Finalized"); setNewCateringReadiness(0);
                    setShowCateringModal(false);
                  }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Name *</label>
                        <input required value={newCateringEvent} onChange={e => setNewCateringEvent(e.target.value)} placeholder="e.g. Sharma Wedding" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Guest Count</label>
                        <input type="number" value={newCateringGuests} onChange={e => setNewCateringGuests(parseInt(e.target.value)||0)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    </div>
                    <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Menu Layout *</label>
                      <input required value={newCateringMenu} onChange={e => setNewCateringMenu(e.target.value)} placeholder="Royal Buffet + Live Counters" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Assigned Chef</label>
                        <input value={newCateringChef} onChange={e => setNewCateringChef(e.target.value)} placeholder="Chef Rajan" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Preparation Stage</label>
                        <select value={newCateringStage} onChange={e => setNewCateringStage(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Menu Finalized</option><option>Ingredients Procurement</option><option>Pre-Cooking</option><option>Ready</option>
                        </select></div>
                    </div>
                    <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Readiness % (0–100)</label>
                      <input type="number" min={0} max={100} value={newCateringReadiness} onChange={e => setNewCateringReadiness(parseInt(e.target.value)||0)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "4px" }}>Add to Kitchen Roster</button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              8. PHOTOGRAPHY TEAM — Cinematic Spot Check
              ============================================================== */}
          {activeAdminSubTab === "photo_team" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "28px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-serif)", color: "#171717" }}>Photography & Cinematic Team</h2>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginTop: "4px" }}>Drone permissions, sunset photoshoot alignments, and videography brief checks.</p>
                </div>
                <button onClick={() => setShowPhotoShootModal(true)} className="luxury-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <Plus size={15} /> Add Shoot
                </button>
              </div>

              {/* Table */}
              <div className="luxury-card" style={{ padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)", backgroundColor: "rgba(198,161,91,0.03)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Shoot ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Shoot Date</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Details Layout</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {photoShoots.map(s => (
                        <tr key={s.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          <td style={{ padding: "12px" }}><strong>{s.id}</strong></td>
                          <td style={{ padding: "12px" }}><strong>{s.title}</strong></td>
                          <td style={{ padding: "12px" }}>{s.date}</td>
                          <td style={{ padding: "12px" }}>{s.details}</td>
                          <td style={{ padding: "12px" }}>{s.type}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <button onClick={() => setPhotoShoots(photoShoots.filter(x => x.id !== s.id))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DRAGGABLE ADD SHOOT MODAL */}
              {showPhotoShootModal && (
                <DraggableModal title="Add Photo Shoot" onClose={() => setShowPhotoShootModal(false)} maxWidth="480px">
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (!newPhotoTitle) return;
                    setPhotoShoots([...photoShoots, { id: `PS-${String(Date.now()).slice(-4)}`, title: newPhotoTitle, date: newPhotoDate, details: newPhotoDetails, type: newPhotoType }]);
                    setNewPhotoTitle(""); setNewPhotoDate(""); setNewPhotoDetails("");
                    setShowPhotoShootModal(false);
                  }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Shoot Title *</label>
                      <input required value={newPhotoTitle} onChange={e => setNewPhotoTitle(e.target.value)} placeholder="e.g. Nair Wedding Shoot" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Date</label>
                        <input type="date" value={newPhotoDate} onChange={e => setNewPhotoDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                      <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Type</label>
                        <select value={newPhotoType} onChange={e => setNewPhotoType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Wedding</option><option>Corporate</option><option>Engagement</option><option>Birthday</option>
                        </select></div>
                    </div>
                    <div><label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Details / Layout</label>
                      <input value={newPhotoDetails} onChange={e => setNewPhotoDetails(e.target.value)} placeholder="Drone + 2 Candid Photographers" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} /></div>
                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "4px" }}>Add Shoot</button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              9. BRIDE & GROOM AMENITIES (Full Stateful CRUD Management)
              ============================================================== */}
          {activeAdminSubTab === "bridal_amenities" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Bride & Groom Luxurious Suites Register</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Configure dressing room keys, valet allocations, VIP hospitality services and suite preparation readiness indicators.</p>
                </div>
                <button onClick={() => { setEditingBridalId(null); setShowBridalModal(true); }} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Add Suite
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {bridalSuites.map((suite) => (
                  <div key={suite.id} className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)", display: "flex", flexDirection: "column", justifySelf: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                        <h4 style={{ fontSize: "1.1rem", margin: 0 }}>{suite.name}</h4>
                        <span style={{
                          padding: "4px 8px", borderRadius: "8px", fontSize: "0.65rem", fontWeight: "700",
                          backgroundColor: suite.conditionStatus === "Prepared" ? "rgba(40,167,69,0.1)" : (suite.conditionStatus === "Occupied" ? "rgba(198,161,91,0.12)" : "rgba(244,67,54,0.08)"),
                          color: suite.conditionStatus === "Prepared" ? "#28A745" : (suite.conditionStatus === "Occupied" ? "#C6A15B" : "#F44336")
                        }}>{suite.conditionStatus}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#5A5A5A", marginBottom: "14px" }}>{suite.notes}</p>
                      
                      <div style={{ fontSize: "0.8rem", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span>Rooms Blocked: <strong>{suite.roomsBooked} VIP Chambers</strong></span>
                        <span>Personal Butler: <strong>{suite.butler}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                      <button onClick={() => startEditBridal(suite)} className="luxury-btn-outline" style={{ flex: 1, padding: "5px 0", fontSize: "0.7rem", justifyContent: "center" }}>
                        Edit Specs
                      </button>
                      <button onClick={() => setBridalSuites(bridalSuites.filter(s => s.id !== suite.id))} style={{ padding: "5px 12px", backgroundColor: "rgba(244,67,54,0.08)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "0.7rem" }}>
                        Checkout
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DRAGGABLE BRIDAL SUITE MODAL */}
              {showBridalModal && (
                <DraggableModal title={editingBridalId ? "Edit Suite Alignment" : "Add Luxury Suite Roster"} onClose={() => setShowBridalModal(false)} maxWidth="500px">
                  <form onSubmit={handleBridalSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Suite / Room Name *</label>
                      <input required type="text" value={bridalName} onChange={e => setBridalName(e.target.value)} placeholder="e.g. Groom suite Imperial" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Condition Status</label>
                        <select value={bridalCondition} onChange={e => setBridalCondition(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option value="Prepared">Fully Prepared</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Cleaning">Cleaning Required</option>
                          <option value="Maintenance">Maintenance Hold</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Number of Rooms Booked</label>
                        <input required type="number" value={bridalRooms} onChange={e => setBridalRooms(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Personal Butler Assigned *</label>
                      <input required type="text" value={bridalButler} onChange={e => setBridalButler(e.target.value)} placeholder="e.g. Prema Latha" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>VIP Hospitality Notes</label>
                      <textarea value={bridalNotes} onChange={e => setBridalNotes(e.target.value)} placeholder="Welcome basket, specific temperature setting..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem", height: "70px", resize: "none" }} />
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingBridalId ? "Save Roster Alignment" : "Register Suite Layout"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              10. KIDS PLAY AREA (Full Stateful CRUD Management)
              ============================================================== */}
          {activeAdminSubTab === "kids_area" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem" }}>Kids Zone Recreation Register</h3>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Monitor attendants, child safety certifications, candy buffet lines, and recreation active zones.</p>
                </div>
                <button onClick={() => { setEditingKidsId(null); setShowKidsModal(true); }} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Add Kids Zone Setup
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {kidsZones.map((zone) => (
                  <div key={zone.id} className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)", display: "flex", flexDirection: "column", justifySelf: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                        <h4 style={{ fontSize: "1.1rem", margin: 0 }}>{zone.activityName}</h4>
                        <span style={{
                          padding: "4px 8px", borderRadius: "8px", fontSize: "0.65rem", fontWeight: "700",
                          backgroundColor: zone.status === "Active" ? "rgba(40,167,69,0.1)" : "rgba(244,67,54,0.08)",
                          color: zone.status === "Active" ? "#28A745" : "#F44336"
                        }}>{zone.status}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#5A5A5A", marginBottom: "14px" }}>{zone.notes}</p>
                      
                      <div style={{ fontSize: "0.8rem", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span>Zone Attendant: <strong>{zone.attendantName}</strong></span>
                        <span>Guest Capacity: <strong>{zone.capacity} Kids</strong></span>
                        <span>Safety Index: <strong style={{ color: zone.safetyStatus === "Certified" ? "#28A745" : "#C6A15B" }}>{zone.safetyStatus}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                      <button onClick={() => startEditKids(zone)} className="luxury-btn-outline" style={{ flex: 1, padding: "5px 0", fontSize: "0.7rem", justifyContent: "center" }}>
                        Edit Details
                      </button>
                      <button onClick={() => setKidsZones(kidsZones.filter(z => z.id !== zone.id))} style={{ padding: "5px 12px", backgroundColor: "rgba(244,67,54,0.08)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "0.7rem" }}>
                        Dismantle
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DRAGGABLE KIDS ZONE MODAL */}
              {showKidsModal && (
                <DraggableModal title={editingKidsId ? "Edit Kids Activity Zone" : "Add Kids Play Zone Activity"} onClose={() => setShowKidsModal(false)} maxWidth="500px">
                  <form onSubmit={handleKidsSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Activity / Setup Name *</label>
                      <input required type="text" value={kidsActivity} onChange={e => setKidsActivity(e.target.value)} placeholder="e.g. Balloon Inflatable Castle" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Zone Attendant Name *</label>
                        <input required type="text" value={kidsAttendant} onChange={e => setKidsAttendant(e.target.value)} placeholder="e.g. Gopal Swamy" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Max Capacity</label>
                        <input required type="number" value={kidsCapacity} onChange={e => setKidsCapacity(parseInt(e.target.value) || 20)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Safety Status</label>
                        <select value={kidsSafety} onChange={e => setKidsSafety(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Certified</option>
                          <option>Pending</option>
                          <option>Under Review</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Active Status</label>
                        <select value={kidsStatus} onChange={e => setKidsStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Active</option>
                          <option>Closed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Specific Setup Notes</label>
                      <textarea value={kidsNotes} onChange={e => setKidsNotes(e.target.value)} placeholder="Attendant shift timing, candy types detail..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem", height: "70px", resize: "none" }} />
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingKidsId ? "Save Zone Alignment" : "Register Play Zone Layout"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              11. DEADLINES & WORKFLOW Timeline dispatcher
              ============================================================== */}
          {activeAdminSubTab === "deadlines" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Deadlines & Workflow Center</h2>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Auto-generated event schedules scaled to lock dates.</p>
                </div>
                <button onClick={() => { setEditingWfId(null); setShowWorkflowModal(true); }} className="luxury-btn-primary" style={{ flexShrink: 0 }}><Plus size={16} /> Add Critical Deadline</button>
              </div>

              {/* Workflow Tasks Table */}
              <div className="luxury-card">
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Event Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Timeline Gap</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Task Details</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Target Date</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Workflow Progress</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Urgency</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflowTasks.map(t => (
                        <tr key={t.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          <td style={{ padding: "12px" }}><strong>{t.eventName}</strong></td>
                          <td style={{ padding: "12px" }}>{t.daysBefore} Days Before</td>
                          <td style={{ padding: "12px" }}>{t.desc}</td>
                          <td style={{ padding: "12px" }}>{t.date}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "8px",
                              fontSize: "0.7rem",
                              backgroundColor: t.status === "Completed" ? "rgba(40,167,69,0.1)" : "rgba(0,0,0,0.06)",
                              color: t.status === "Completed" ? "#28A745" : "#171717"
                            }}>{t.status}</span>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.7rem", backgroundColor: t.urgency === "Overdue" ? "rgba(244,67,54,0.1)" : "rgba(198,161,91,0.08)", color: t.urgency === "Overdue" ? "#F44336" : "#C6A15B" }}>{t.urgency}</span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button onClick={() => startEditWf(t)} className="luxury-btn-outline" style={{ padding: "4px 8px", fontSize: "0.65rem", display: "inline-flex", gap: "4px", alignItems: "center" }}>
                                <Edit3 size={11} /> Edit
                              </button>
                              <button onClick={() => setWorkflowTasks(workflowTasks.filter(x => x.id !== t.id))} style={{ padding: "4px 8px", fontSize: "0.65rem", backgroundColor: "rgba(244,67,54,0.08)", color: "#F44336", border: "1px solid rgba(244,67,54,0.2)", borderRadius: "8px", cursor: "pointer", display: "inline-flex", gap: "4px", alignItems: "center" }}>
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DRAGGABLE TIMELINE TASK MODAL */}
              {showWorkflowModal && (
                <DraggableModal title={editingWfId ? "Edit Critical Deadline" : "Add Critical Deadline Milestone"} onClose={() => setShowWorkflowModal(false)} maxWidth="500px">
                  <form onSubmit={handleWfSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Event Target Association *</label>
                      <input required type="text" value={wfEvent} onChange={e => setWfEvent(e.target.value)} placeholder="e.g. Rahul Wedding" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Timeline Gap Days</label>
                        <input required type="number" value={wfDays} onChange={e => setWfDays(parseInt(e.target.value) || 10)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Target Deadline Date *</label>
                        <input required type="date" value={wfDate} onChange={e => setWfDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Current Progress Status</label>
                        <select value={wfStatus} onChange={e => setWfStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Not Started</option>
                          <option>In Progress</option>
                          <option>Waiting</option>
                          <option>Completed</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Urgency Level</label>
                        <select value={wfUrgency} onChange={e => setWfUrgency(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Normal</option>
                          <option>Urgent</option>
                          <option>Overdue</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Task Description Details *</label>
                      <textarea required value={wfDesc} onChange={e => setWfDesc(e.target.value)} placeholder="Finalize structural decorator alignment details..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem", height: "70px", resize: "none" }} />
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      {editingWfId ? "Save Timeline Sync" : "Deploy critical milestone"}
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              12. PAYMENTS & FINANCE CENTER (Full Detailed History Upgrades)
              ============================================================== */}
          {activeAdminSubTab === "payments" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "2.1rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Payments & Finance Center</h2>
                  <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Examine financial balance status, verify transaction reference indexes, and log manual payments.</p>
                </div>
                <button onClick={() => setShowPaymentModal(true)} className="luxury-btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                  <Plus size={16} /> Record Client Payment
                </button>
              </div>

              {/* Gross calculations info row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Estimated Gross Revenue</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#171717", marginTop: "4px" }}>₹{totalGrossRevenue.toLocaleString()}</strong>
                </div>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Advance Deposits Received</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#C6A15B", marginTop: "4px" }}>₹{totalPaymentsReceived.toLocaleString()}</strong>
                </div>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Pending Receivables</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#F44336", marginTop: "4px" }}>₹{totalPendingPayments.toLocaleString()}</strong>
                </div>
              </div>

              {/* Transactions History Ledger - BASIC TABLE AS REQUESTED */}
              <div className="luxury-card">
                <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>Detailed Transactions History Ledger (Click row to see details)</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Transaction ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Customer Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Amount Logged</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedPayments.map(p => (
                        <tr key={p.id} onClick={() => setSelectedPaymentDetail(p)} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", transition: "background-color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(198,161,91,0.05)"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = ""}
                        >
                          <td style={{ padding: "12px" }}><strong>{p.id}</strong></td>
                          <td style={{ padding: "12px" }}><strong>{p.customerName}</strong></td>
                          <td style={{ padding: "12px" }}>₹{p.amount.toLocaleString()}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              padding: "4px 8px", borderRadius: "8px", fontSize: "0.68rem", fontWeight: "700",
                              backgroundColor: p.status === "Successful" ? "rgba(40,167,69,0.1)" : "rgba(198,161,91,0.1)",
                              color: p.status === "Successful" ? "#28A745" : "#C6A15B"
                            }}>{p.status}</span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setDetailedPayments(detailedPayments.filter(x => x.id !== p.id))} style={{ background: "none", border: "none", color: "#F44336", cursor: "pointer" }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DRAGGABLE PAYMENT DETAILS POP-OUT */}
              {selectedPaymentDetail && (
                <DraggableModal title={`Transaction Details: ${selectedPaymentDetail.id}`} onClose={() => setSelectedPaymentDetail(null)} maxWidth="480px">
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Customer:</span>
                      <strong>{selectedPaymentDetail.customerName}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Booking ID:</span>
                      <strong>{selectedPaymentDetail.bookingId}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Date Paid:</span>
                      <strong>{selectedPaymentDetail.date}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Payment Mode:</span>
                      <strong>{selectedPaymentDetail.mode}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Reference / Txn ID:</span>
                      <strong>{selectedPaymentDetail.referenceId}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Amount Logged:</span>
                      <strong style={{ color: "#C6A15B", fontSize: "1.1rem" }}>₹{selectedPaymentDetail.amount.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px" }}>
                      <span style={{ color: "#5A5A5A" }}>Transaction Status:</span>
                      <span style={{
                        padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700",
                        backgroundColor: selectedPaymentDetail.status === "Successful" ? "rgba(40,167,69,0.1)" : "rgba(198,161,91,0.1)",
                        color: selectedPaymentDetail.status === "Successful" ? "#28A745" : "#C6A15B"
                      }}>{selectedPaymentDetail.status}</span>
                    </div>
                  </div>
                </DraggableModal>
              )}

              {/* DRAGGABLE RECORD NEW PAYMENT MODAL */}
              {showPaymentModal && (
                <DraggableModal title="Record Client Package Payment" onClose={() => setShowPaymentModal(false)} maxWidth="500px">
                  <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Customer Name *</label>
                      <input required type="text" value={payCustName} onChange={e => setPayCustName(e.target.value)} placeholder="e.g. Rohan Kumar" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Associated Booking ID</label>
                        <input type="text" value={payBookingId} onChange={e => setPayBookingId(e.target.value)} placeholder="GAAR1024" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Transaction Date *</label>
                        <input required type="date" value={payDate} onChange={e => setPayDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Amount Received (₹) *</label>
                        <input required type="number" value={payAmount} onChange={e => setPayAmount(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Payment Mode</label>
                        <select value={payMode} onChange={e => setPayMode(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>UPI Transfer</option>
                          <option>Net Banking</option>
                          <option>Credit Card</option>
                          <option>Cash Receipt</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Bank Reference/Txn ID</label>
                        <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="UPI90823..." style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Transaction Status</label>
                        <select value={payStatus} onChange={e => setPayStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "0.85rem" }}>
                          <option>Successful</option>
                          <option>Pending</option>
                          <option>Failed</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                      Record Transaction
                    </button>
                  </form>
                </DraggableModal>
              )}
            </div>
          )}

          {/* ==============================================================
              13. EVENT COST CALCULATOR
              ============================================================== */}
          {activeAdminSubTab === "calculator" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Event Cost Calculator Widget</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Estimate dynamic costs instantly. No external spreadsheets needed.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Select Venue Space</label>
                    <select value={calcSpace} onChange={(e) => setCalcSpace(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>
                      {spaces.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Base Price: ₹{s.basePrice.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Expected Guest Count</label>
                    <input type="number" value={calcGuests} onChange={(e) => setCalcGuests(parseInt(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Catering Tier (Price per Guest)</label>
                    <select value={calcCatering} onChange={(e) => setCalcCatering(parseInt(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>
                      <option value="800">Classic Buffet (₹800/Guest)</option>
                      <option value="1200">Imperial Buffet (₹1,200/Guest)</option>
                      <option value="1800">Grand Royal Sovereign (₹1,800/Guest)</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Decor Package</label>
                      <input type="number" value={calcDecor} onChange={(e) => setCalcDecor(parseInt(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Photography Package</label>
                      <input type="number" value={calcPhotography} onChange={(e) => setCalcPhotography(parseInt(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                    </div>
                  </div>
                </form>

                {/* Estimate Result Panel */}
                <div style={{ backgroundColor: "#FAF9F5", padding: "30px", borderRadius: "20px", border: "2px solid #C6A15B", display: "flex", flexDirection: "column", justifySelf: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Estimated Total Cost Proposal</span>
                    <strong style={{ display: "block", fontSize: "2rem", color: "#171717", marginTop: "4px" }}>₹{estTotal.toLocaleString()}</strong>
                    <span style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>Includes 18% GST (₹{estTax.toLocaleString()})</span>
                  </div>

                  <div style={{ borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "16px", marginTop: "20px", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifySelf: "space-between" }}>
                      <span>Base space layout:</span>
                      <strong>₹{estBase.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifySelf: "space-between" }}>
                      <span>Food catering split:</span>
                      <strong>₹{estFood.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifySelf: "space-between" }}>
                      <span>Decor package structure:</span>
                      <strong>₹{calcDecor.toLocaleString()}</strong>
                    </div>
                  </div>
                  
                  <button onClick={() => { alert("Calculation invoice generated successfully! Ready for operational log."); }} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "24px" }}>Lock Estimate Proposal</button>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              14. REVIEWS
              ============================================================== */}
          {activeAdminSubTab === "reviews" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Customer Reviews & Testimonials</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Live testimonials posted by grand wedding families and business organizers.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { name: "Rahul S. (Wedding July 2026)", stars: 5, review: "An exceptional, world-class experience. The open wedding venue sunset backdrop was breathtaking. Our guests are still talking about it!" },
                  { name: "Siddharth Sen (Engagement May 2026)", stars: 5, review: "High-end luxury wedding broker indeed. The cost calculator matched our budget down to the rupee. Highly recommended!" }
                ].map((r, idx) => (
                  <div key={idx} className="luxury-card" style={{ borderLeft: "4px solid #C6A15B" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                      {Array.from({ length: r.stars }).map((_, sIdx) => (
                        <Star key={sIdx} size={14} fill="#C6A15B" color="#C6A15B" />
                      ))}
                    </div>
                    <strong>{r.name}</strong>
                    <p style={{ fontSize: "0.8rem", color: "#5A5A5A", marginTop: "4px" }}>"{r.review}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              15. SETTINGS
              ============================================================== */}
          {activeAdminSubTab === "settings" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Administrative Console Settings</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Configure database persistence, security permissions, and default operational hours.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>Operations Console Version</label>
                  <input type="text" disabled value="Gaarlandz ERP v2.6 (Strict Luxury)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#FAF9F5" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>Default Advance Deposit (₹)</label>
                  <input type="number" defaultValue={50000} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                </div>
                <button onClick={() => alert("Administrative parameters synced with primary server!")} className="luxury-btn-primary" style={{ justifyContent: "center", marginTop: "12px" }}>
                  Save Parameters Sync
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
