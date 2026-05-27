"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGaarlandz, Booking, Lead, SiteVisit, KanbanTask, StaffMember, Vendor, VenueSpace, BookingService } from "@/context/GaarlandzContext";
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
  Smile
} from "lucide-react";

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
      <div style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ color: "#171717", fontFamily: "var(--font-serif)" }}>Validating Console Authorization...</h3>
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
    updateBookingStatus, 
    updateLeadStatus, 
    addLeadFollowUp, 
    convertLeadToBooking,
    updateSiteVisitStatus,
    updateSpacePricing,
    isPremiumDate,
    checkDateAvailability,
    addVendor,
    updateVendorStatus,
    addStaff,
    updateStaffAvailability,
    addKanbanTask,
    updateKanbanTaskStatus,
    assignKanbanTaskTeam,
    markNotificationAsRead,
    clearNotifications
  } = useGaarlandz();

  // Navigation Sidebar States (Exact 16 Subtabs)
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    "overview" | "calendar" | "bookings" | "leads" | "spaces" | "decor_team" | "catering_team" | 
    "photo_team" | "bridal_amenities" | "kids_area" | "orders" | "deadlines" | "payments" | 
    "calculator" | "reviews" | "settings"
  >("overview");

  const [sidebarCollapsible, setSidebarCollapsible] = useState(false);

  // Global search input state
  const [globalQuery, setGlobalQuery] = useState("");
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ bookings: Booking[]; leads: Lead[]; staff: StaffMember[]; vendors: Vendor[] }>({
    bookings: [], leads: [], staff: [], vendors: []
  });

  // Dynamic system notifications bell panel state
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // COST CALCULATOR STATE
  const [calcGuests, setCalcGuests] = useState(500);
  const [calcSpace, setCalcSpace] = useState("open-wedding");
  const [calcCatering, setCalcCatering] = useState(800); // price per guest
  const [calcDecor, setCalcDecor] = useState(45000);
  const [calcPhotography, setCalcPhotography] = useState(35000);
  const [calcServicesSelected, setCalcServicesSelected] = useState<string[]>(["srv-valet"]);

  // ORDERS & PROCUREMENT STATE
  const [procureOrders, setProcureOrders] = useState([
    { id: "ORD-3245", eventName: "Rahul Wedding", vendor: "Elite Florals", category: "Flowers", items: "White Roses + Orchids", qty: 250, date: "2026-06-15", status: "In Transit", payment: "Partial Paid", priority: "High" },
    { id: "ORD-3246", eventName: "TechCorp Meet", vendor: "Kovai Furnitures", category: "Chairs", items: "Gold Banquet Chairs", qty: 300, date: "2026-06-18", status: "Delivered", payment: "Paid", priority: "High" },
    { id: "ORD-3247", eventName: "Ananya Reception", vendor: "BrightGlow Lights", category: "Lighting", items: "Cascade LED Sparklers", qty: 45, date: "2026-06-22", status: "Ordered", payment: "Pending", priority: "Medium" }
  ]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrderVendor, setNewOrderVendor] = useState("");
  const [newOrderItems, setNewOrderItems] = useState("");
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderPrice, setNewOrderPrice] = useState(0);
  const [newOrderDate, setNewOrderDate] = useState("");
  const [newOrderPriority, setNewOrderPriority] = useState("Medium");
  const [newOrderNotes, setNewOrderNotes] = useState("");

  // DEADLINES & WORKFLOW STATE
  const [workflowTasks, setWorkflowTasks] = useState([
    { id: "DL-101", eventName: "Rahul Wedding", daysBefore: 30, desc: "Finalize catering menu layout", date: "2026-06-18", status: "Completed", urgency: "Normal" },
    { id: "DL-102", eventName: "Rahul Wedding", daysBefore: 20, desc: "Confirm decorator structural theme", date: "2026-06-28", status: "In Progress", urgency: "Urgent" },
    { id: "DL-103", eventName: "TechCorp Meet", daysBefore: 10, desc: "Order conference stage materials", date: "2026-06-10", status: "Waiting", urgency: "Overdue" },
    { id: "DL-104", eventName: "Ananya Reception", daysBefore: 5, desc: "Suite preparation & welcome packs", date: "2026-06-17", status: "Not Started", urgency: "Normal" }
  ]);

  // VENDOR PAYMENTS STATE
  const [vendorPayments, setVendorPayments] = useState([
    { id: "VP-401", vendor: "Elite Florals Decor", amount: 45000, deadline: "2026-06-25", status: "Partially Paid" },
    { id: "VP-402", vendor: "Kovai Royal Catering", amount: 150000, deadline: "2026-06-20", status: "Pending" },
    { id: "VP-403", vendor: "PixelPerfect Films", amount: 35000, deadline: "2026-06-28", status: "Paid" }
  ]);

  // INVOICE STATE
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  // DECORATION TEAM STATE
  const [decorTasks, setDecorTasks] = useState([
    { id: "DT-01", event: "Rahul Wedding", materials: "White Roses, Golden Mandap", deadline: "2026-06-24", budget: 45000, staff: "Ramesh Selvan + 4", progress: 65, status: "Preparing" },
    { id: "DT-02", event: "Corporate Banquet", materials: "Stage Backdrop Screen, Mic Stands", deadline: "2026-06-20", budget: 20000, staff: "Ramesh Selvan + 2", progress: 90, status: "Setup Started" }
  ]);

  // CATERING TEAM STATE
  const [cateringTasks, setCateringTasks] = useState([
    { id: "CT-01", event: "Rahul Wedding", guests: 500, menu: "Royal South Indian & Continental Buffet", chef: "Chef Murugan", stage: "Ingredients Procurement", readiness: 40 },
    { id: "CT-02", event: "Corporate Buffet", guests: 250, menu: "Executive Lunch & Evening High Tea", chef: "Chef Karthik", stage: "Menu Finalized", readiness: 15 }
  ]);

  // Sidebar link items (Exact 16 Items matching requirements)
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
    { id: "orders", label: "Orders & Procurement", icon: Package },
    { id: "deadlines", label: "Deadlines & Workflow", icon: Clock },
    { id: "payments", label: "Payments & Finance", icon: DollarSign },
    { id: "calculator", label: "Event Cost Calculator", icon: Calculator },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Sliders }
  ];

  // Search filter
  useEffect(() => {
    if (!globalQuery) {
      setSearchResults({ bookings: [], leads: [], staff: [], vendors: [] });
      return;
    }
    const q = globalQuery.toLowerCase();
    const filteredBookings = bookings.filter(b => b.id.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.eventType.toLowerCase().includes(q));
    const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.eventType.toLowerCase().includes(q));
    const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q));
    
    setSearchResults({ bookings: filteredBookings, leads: filteredLeads, staff: filteredStaff, vendors: filteredVendors });
  }, [globalQuery, bookings, leads, staff, vendors]);

  // Overview vitals calculations
  const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.pricing.total, 0);
  const totalPaymentsReceived = bookings.reduce((sum, b) => sum + b.pricing.advancePaid, 0);
  const totalPendingPayments = bookings.reduce((sum, b) => sum + b.pricing.remainingBalance, 0);

  // Cost calculator estimates
  const estBase = spaces.find(s => s.id === calcSpace)?.basePrice || 150000;
  const estFood = calcGuests * calcCatering;
  const estSubtotal = estBase + estFood + calcDecor + calcPhotography + (calcServicesSelected.length * 15000);
  const estTax = Math.round(estSubtotal * 0.18);
  const estTotal = estSubtotal + estTax;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderVendor || !newOrderItems) return;
    const newOrd = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      eventName: "Custom Event",
      vendor: newOrderVendor,
      category: "Material Setup",
      items: newOrderItems,
      qty: newOrderQty,
      date: newOrderDate || "2026-06-20",
      status: "Requested",
      payment: "Pending",
      priority: newOrderPriority
    };
    setProcureOrders([newOrd, ...procureOrders]);
    setShowOrderModal(false);
    setNewOrderVendor("");
    setNewOrderItems("");
    setNewOrderQty(1);
    setNewOrderPrice(0);
    setNewOrderDate("");
    setNewOrderNotes("");
    alert("New procurement order logged successfully! Dispatched callback to selected vendor.");
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setProcureOrders(procureOrders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-cream)", overflow: "hidden", width: "100%" }}>
      
      {/* ==============================================================
          LEFT SECURED GLASS SIDEBAR PANEL
          ============================================================== */}
      <aside style={{
        width: sidebarCollapsible ? "80px" : "280px",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
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
                  transition: "all 0.3s",
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
          <div style={{ position: "relative", maxWidth: "420px", width: "100%" }}>
            <input 
              type="text"
              value={globalQuery}
              onChange={(e) => {
                setGlobalQuery(e.target.value);
                setSearchOverlayOpen(true);
              }}
              placeholder="Search Inquiries, Bookings, Team..."
              style={{
                width: "100%",
                padding: "10px 16px 10px 42px",
                borderRadius: "30px",
                border: "1px solid rgba(198, 161, 91, 0.3)",
                backgroundColor: "var(--bg-cream)",
                fontSize: "0.8rem",
                outline: "none"
              }}
            />
            <Search size={16} color="#C6A15B" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
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
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Calendar size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Today's Events</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>1 Wedding Ceremony</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Sparkles size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Events This Week</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>3 Scheduled Galas</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <DollarSign size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Pending Payments</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>₹{totalPendingPayments.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Package size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Pending Procurement</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>2 Orders In Transit</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Clock size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Urgent Deadlines</span>
                    <strong style={{ fontSize: "1.1rem", color: "#F44336" }}>1 Task Overdue</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Paintbrush size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Decor Team Load</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>High (2 Active)</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <Coffee size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Catering Load</span>
                    <strong style={{ fontSize: "1.1rem", color: "#171717" }}>Medium (2 Menus)</strong>
                  </div>
                </div>

                <div className="luxury-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(198, 161, 91, 0.08)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center" }}>
                    <TrendingUp size={20} color="#C6A15B" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase", display: "block" }}>Revenue Trend</span>
                    <strong style={{ fontSize: "1.1rem", color: "#28A745" }}>+18% MoM Growth</strong>
                  </div>
                </div>
              </div>

              {/* Automation logs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "20px" }}>
                <div className="luxury-card">
                  <h3 style={{ fontSize: "1.2rem", borderBottom: "1px solid rgba(198,161,91,0.2)", paddingBottom: "10px", marginBottom: "16px" }}>Recent Activity Log</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {automationLogs.slice(0, 3).map(log => (
                      <div key={log.id} style={{ borderLeft: "2px solid #C6A15B", paddingLeft: "14px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>Booking ID: {log.bookingId} Setup Completed</span>
                        <p style={{ fontSize: "0.7rem", color: "#5A5A5A" }}>{log.actions.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="luxury-card">
                  <h3 style={{ fontSize: "1.2rem", borderBottom: "1px solid rgba(198,161,91,0.2)", paddingBottom: "10px", marginBottom: "16px" }}>Venue Occupancy Ratio</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "150px" }}>
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "3rem", color: "#C6A15B", display: "block" }}>84%</strong>
                      <span style={{ fontSize: "0.75rem", color: "#5A5A5A", textTransform: "uppercase" }}>Locked Bookings vs Slots Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              2. CELEBRATION CALENDAR
              ============================================================== */}
          {activeAdminSubTab === "calendar" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Celebration Calendar</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>View booked dates vs available dates for the venue spaces.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", textAlign: "center" }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <strong key={d} style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#5A5A5A" }}>{d}</strong>
                ))}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const day = idx + 1;
                  const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
                  const hasBooking = bookings.some(b => b.date === dateStr);
                  const isPremium = isPremiumDate(dateStr);
                  return (
                    <div key={idx} style={{
                      padding: "16px 8px",
                      borderRadius: "12px",
                      backgroundColor: hasBooking ? "rgba(244, 67, 54, 0.08)" : (isPremium ? "rgba(198, 161, 91, 0.15)" : "#FAF9F5"),
                      border: hasBooking ? "1px solid rgba(244, 67, 54, 0.2)" : (isPremium ? "1px solid #C6A15B" : "1px solid rgba(0,0,0,0.06)"),
                      minHeight: "80px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "left"
                    }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{day}</span>
                      {hasBooking ? (
                        <span style={{ fontSize: "0.55rem", backgroundColor: "#F44336", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>Blocked</span>
                      ) : (
                        isPremium ? (
                          <span style={{ fontSize: "0.55rem", backgroundColor: "#C6A15B", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>Premium</span>
                        ) : (
                          <span style={{ fontSize: "0.55rem", color: "#28A745" }}>Available</span>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==============================================================
              3. BOOKING MANAGEMENT
              ============================================================== */}
          {activeAdminSubTab === "bookings" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Booking Management Ledger</h3>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Booking ID</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Guests</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Total Price</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{b.id}</strong></td>
                        <td style={{ padding: "12px" }}>{b.customerName}</td>
                        <td style={{ padding: "12px" }}>{b.eventType}</td>
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
                        <td style={{ padding: "12px" }}>
                          <button onClick={() => updateBookingStatus(b.id, "Completed")} className="luxury-btn-outline" style={{ padding: "4px 8px", fontSize: "0.6rem" }}>Complete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              4. VENUE INQUIRIES
              ============================================================== */}
          {activeAdminSubTab === "leads" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Venue Inquiries CRM</h3>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Lead ID</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Desired Date</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Source</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{l.id}</strong></td>
                        <td style={{ padding: "12px" }}>{l.name}</td>
                        <td style={{ padding: "12px" }}>{l.preferredDate}</td>
                        <td style={{ padding: "12px" }}>{l.eventType}</td>
                        <td style={{ padding: "12px" }}>{l.source}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.65rem",
                            fontWeight: "700",
                            backgroundColor: "rgba(198,161,91,0.08)",
                            color: "#C6A15B"
                          }}>{l.status}</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button onClick={() => convertLeadToBooking(l.id, 50000)} className="luxury-btn-primary" style={{ padding: "4px 8px", fontSize: "0.65rem" }}>Convert to Booking</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              5. VENUE SPACES CONFIG
              ============================================================== */}
          {activeAdminSubTab === "spaces" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem" }}>Venue Spaces Configuration</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {spaces.map(sp => (
                  <div key={sp.id} className="luxury-card" style={{ padding: 0, overflow: "hidden" }}>
                    <img src={sp.image} alt={sp.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                    <div style={{ padding: "20px" }}>
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{sp.name}</h4>
                      <p style={{ fontSize: "0.75rem", color: "#5A5A5A", marginBottom: "16px" }}>{sp.description}</p>
                      <div style={{ display: "flex", justifySelf: "space-between", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "12px", fontSize: "0.8rem" }}>
                        <span>Capacity: <strong>{sp.capacity} Guests</strong></span>
                        <span>Base Price: <strong>₹{sp.basePrice.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              6. DECORATION TEAM
              ============================================================== */}
          {activeAdminSubTab === "decor_team" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Decoration Operations Dashboard</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Track assigned stages, floral setup progress, and materials checklists.</p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Required Materials</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Deadline</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Staff Assigned</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Setup Progress</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decorTasks.map(t => (
                      <tr key={t.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{t.event}</strong></td>
                        <td style={{ padding: "12px" }}>{t.materials}</td>
                        <td style={{ padding: "12px" }}>{t.deadline}</td>
                        <td style={{ padding: "12px" }}>{t.staff}</td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ width: "100%", backgroundColor: "rgba(0,0,0,0.06)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${t.progress}%`, backgroundColor: "#C6A15B", height: "8px" }} />
                          </div>
                          <span style={{ fontSize: "0.65rem", color: "#5A5A5A" }}>{t.progress}% completed</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.7rem", backgroundColor: "rgba(198,161,91,0.1)", color: "#C6A15B" }}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              7. CATERING TEAM
              ============================================================== */}
          {activeAdminSubTab === "catering_team" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Catering & Kitchen Dashboard</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Manage wedding menus, chefs, ingredient procurements, and readiness indexes.</p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Event Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Guests</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Menu Layout</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Assigned Chef</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Preparation Stage</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Readiness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cateringTasks.map(c => (
                      <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "12px" }}><strong>{c.event}</strong></td>
                        <td style={{ padding: "12px" }}>{c.guests} Guests</td>
                        <td style={{ padding: "12px" }}>{c.menu}</td>
                        <td style={{ padding: "12px" }}>{c.chef}</td>
                        <td style={{ padding: "12px" }}>{c.stage}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.7rem", backgroundColor: "rgba(40,167,69,0.1)", color: "#28A745", fontWeight: "700" }}>{c.readiness}% Ready</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              8. PHOTOGRAPHY TEAM
              ============================================================== */}
          {activeAdminSubTab === "photo_team" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Photography & Cinematic Team</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Drone permissions, sunset photoshoot alignments, and videography brief checks.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Assigned Shoots Schedule</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.8rem" }}>
                    <div>
                      <strong>Rahul Wedding Shoot</strong>
                      <span style={{ display: "block", color: "#5A5A5A" }}>24 June 2026 | Drone cinematic layout + 2 Candid Photographers</span>
                    </div>
                    <div>
                      <strong>TechCorp Executive Group Shoot</strong>
                      <span style={{ display: "block", color: "#5A5A5A" }}>20 June 2026 | Stage projection group layout</span>
                    </div>
                  </div>
                </div>
                <div className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Photoshoot Trails Status</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
                    <span>Sunset Pavilion Trail: <strong style={{ color: "#28A745" }}>Ready</strong></span>
                    <span>Cascading Floral Swing: <strong style={{ color: "#28A745" }}>Ready</strong></span>
                    <span>Lantern Walkway Spots: <strong style={{ color: "#C6A15B" }}>Setup In Progress</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              9. BRIDE & GROOM AMENITIES
              ============================================================== */}
          {activeAdminSubTab === "bridal_amenities" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Bride & Groom Luxurious Suites</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Manage 5-star dressing vanity suites, butler operations, and private lounges.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                {["Grand Bridal Suite Alpha", "Groom Suite Imperial", "Family Lounge Premium"].map((suite, idx) => (
                  <div key={idx} className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{suite}</h4>
                    <p style={{ fontSize: "0.75rem", color: "#5A5A5A" }}>Vanity lights, private bath alignment, welcome champagne basket.</p>
                    <span style={{ display: "inline-block", padding: "4px 8px", borderRadius: "6px", fontSize: "0.65rem", backgroundColor: "rgba(40,167,69,0.1)", color: "#28A745", fontWeight: "700", marginTop: "12px" }}>Suite Fully Prepared</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              10. KIDS AREA
              ============================================================== */}
          {activeAdminSubTab === "kids_area" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Kids Play Zone Activation</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Supervised recreation zone scheduling, nursery staff allocations, and kids buffet.</p>
              
              <div className="luxury-card" style={{ border: "1px solid rgba(198,161,91,0.2)" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Attendants On-Duty (Active Slots)</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem" }}>
                  <span>Nursery Supervisor: <strong>Prema Latha</strong></span>
                  <span>Mini Candy Buffet Setup: <strong style={{ color: "#28A745" }}>Completed</strong></span>
                  <span>Active Security Guards: <strong>Velu Swamy</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              11. ORDERS & PROCUREMENT
              ============================================================== */}
          {activeAdminSubTab === "orders" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", justifySelf: "space-between", alignItems: "center" }}>
                <div>
                  <span className="floral-badge" style={{ marginBottom: "8px" }}><Sparkles size={10} /> Supply Chain Manager</span>
                  <h2 style={{ fontSize: "2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Orders & Procurement Center</h2>
                </div>
                <button onClick={() => setShowOrderModal(true)} className="luxury-btn-primary"><Plus size={16} /> Add New Order</button>
              </div>

              {/* KPI metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <div className="luxury-card" style={{ padding: "20px" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Pending Orders</span>
                  <strong style={{ display: "block", fontSize: "1.5rem", marginTop: "4px" }}>{procureOrders.filter(o => o.status !== "Delivered").length} Active</strong>
                </div>
                <div className="luxury-card" style={{ padding: "20px" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Delivered Orders</span>
                  <strong style={{ display: "block", fontSize: "1.5rem", marginTop: "4px" }}>{procureOrders.filter(o => o.status === "Delivered").length} Units</strong>
                </div>
                <div className="luxury-card" style={{ padding: "20px" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Urgent Requirements</span>
                  <strong style={{ display: "block", fontSize: "1.5rem", color: "#F44336", marginTop: "4px" }}>2 High Priority</strong>
                </div>
              </div>

              {/* Orders Table */}
              <div className="luxury-card">
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Order ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Event Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Vendor</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Items</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Qty</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Expected Date</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Payment</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
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
                          <td style={{ padding: "12px" }}>
                            <select onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)} value={o.status} style={{ fontSize: "0.75rem", padding: "4px", borderRadius: "6px" }}>
                              <option value="Requested">Requested</option>
                              <option value="Vendor Contacted">Vendor Contacted</option>
                              <option value="Ordered">Ordered</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Ready for Event">Ready for Event</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NEW ORDER MODAL */}
              {showOrderModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <div className="luxury-card" style={{ maxWidth: "480px", width: "100%", padding: "30px", border: "1px solid #C6A15B" }}>
                    <div style={{ display: "flex", justifySelf: "end", marginBottom: "12px" }}>
                      <button onClick={() => setShowOrderModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                    </div>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Create Procurement Order</h3>
                    <form onSubmit={handleCreateOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <input type="text" required placeholder="Vendor Name" value={newOrderVendor} onChange={(e) => setNewOrderVendor(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      <input type="text" required placeholder="Items Details" value={newOrderItems} onChange={(e) => setNewOrderItems(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <input type="number" required placeholder="Quantity" value={newOrderQty} onChange={(e) => setNewOrderQty(parseInt(e.target.value))} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                        <input type="number" required placeholder="Estimated Price" value={newOrderPrice} onChange={(e) => setNewOrderPrice(parseInt(e.target.value))} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      </div>
                      <input type="date" required value={newOrderDate} onChange={(e) => setNewOrderDate(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                      <button type="submit" className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Deploy Procurement Order</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              12. DEADLINES & WORKFLOW
              ============================================================== */}
          {activeAdminSubTab === "deadlines" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div>
                <span className="floral-badge" style={{ marginBottom: "8px" }}><Sparkles size={10} /> Automated Timeline Engine</span>
                <h2 style={{ fontSize: "2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Deadlines & Workflow Center</h2>
                <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Auto-generated event schedules scaled to lock dates.</p>
              </div>

              {/* Deadline Dashboard */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div className="luxury-card" style={{ borderLeft: "4px solid #F44336" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Overdue Tasks</span>
                  <strong style={{ display: "block", fontSize: "1.8rem", color: "#F44336", marginTop: "4px" }}>1 Urgent Warning</strong>
                </div>
                <div className="luxury-card" style={{ borderLeft: "4px solid #C6A15B" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Upcoming Deadlines</span>
                  <strong style={{ display: "block", fontSize: "1.8rem", color: "#C6A15B", marginTop: "4px" }}>2 Active Schedules</strong>
                </div>
                <div className="luxury-card" style={{ borderLeft: "4px solid #28A745" }}>
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Completed Tasks</span>
                  <strong style={{ display: "block", fontSize: "1.8rem", color: "#28A745", marginTop: "4px" }}>1 Verified</strong>
                </div>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              13. PAYMENTS & FINANCE
              ============================================================== */}
          {activeAdminSubTab === "payments" && (
            <div className="fade-in-reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
              <div>
                <span className="floral-badge" style={{ marginBottom: "8px" }}><Sparkles size={10} /> Venue Audit Board</span>
                <h2 style={{ fontSize: "2rem", color: "#171717", fontFamily: "var(--font-serif)" }}>Payments & Finance Center</h2>
                <p style={{ color: "#5A5A5A", fontSize: "0.85rem" }}>Audit and generate invoices for wedding packages, chef assignments, and structural decorators.</p>
              </div>

              {/* KPI cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Total gross Revenue</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#171717", marginTop: "4px" }}>₹{totalGrossRevenue.toLocaleString()}</strong>
                </div>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Advance Deposit Received</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#C6A15B", marginTop: "4px" }}>₹{totalPaymentsReceived.toLocaleString()}</strong>
                </div>
                <div className="luxury-card">
                  <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Outstanding Balance</span>
                  <strong style={{ display: "block", fontSize: "1.6rem", color: "#F44336", marginTop: "4px" }}>₹{totalPendingPayments.toLocaleString()}</strong>
                </div>
              </div>

              {/* Customer payments table */}
              <div className="luxury-card">
                <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Customer Payments & Invoices</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Booking ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Total Amount</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Advance Paid</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Remaining Balance</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Due Date</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Invoice Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          <td style={{ padding: "12px" }}><strong>{b.id}</strong></td>
                          <td style={{ padding: "12px" }}>{b.customerName}</td>
                          <td style={{ padding: "12px" }}>₹{b.pricing.total.toLocaleString()}</td>
                          <td style={{ padding: "12px" }}>₹{b.pricing.advancePaid.toLocaleString()}</td>
                          <td style={{ padding: "12px" }}>₹{b.pricing.remainingBalance.toLocaleString()}</td>
                          <td style={{ padding: "12px" }}>{b.date}</td>
                          <td style={{ padding: "12px" }}>
                            <button onClick={() => setSelectedBookingForInvoice(b)} className="luxury-btn-outline" style={{ padding: "4px 8px", fontSize: "0.65rem" }}><FileText size={12} /> View Invoice</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vendor payouts tracker */}
              <div className="luxury-card">
                <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Vendor Payments Tracker</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(198,161,91,0.2)" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Vendor Team</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Services Details</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Amount Dispatched</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>payout status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPayments.map(vp => (
                        <tr key={vp.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          <td style={{ padding: "12px" }}><strong>{vp.vendor}</strong></td>
                          <td style={{ padding: "12px" }}>Royal Celebration Setup logistics</td>
                          <td style={{ padding: "12px" }}>₹{vp.amount.toLocaleString()}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.65rem", fontWeight: "700", backgroundColor: vp.status === "Paid" ? "rgba(40,167,69,0.1)" : "rgba(198,161,91,0.1)", color: vp.status === "Paid" ? "#28A745" : "#C6A15B" }}>{vp.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PREMIUM BRAND INVOICE OVERLAY PREVIEW */}
              {selectedBookingForInvoice && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                  <div className="luxury-card" style={{ maxWidth: "560px", width: "100%", padding: "40px", border: "2px solid #C6A15B", backgroundColor: "#FFFFFF", color: "#171717", position: "relative" }}>
                    <button onClick={() => setSelectedBookingForInvoice(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", cursor: "pointer" }}><X size={24} /></button>
                    
                    <div style={{ borderBottom: "1px solid rgba(198,161,91,0.3)", paddingBottom: "16px", marginBottom: "20px", textAlign: "left" }}>
                      <span style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)", color: "#171717", fontWeight: "700" }}>GAARLANDZ</span>
                      <span style={{ fontSize: "0.65rem", display: "block", color: "#5A5A5A", textTransform: "uppercase" }}>Luxury Garden Venue Platform</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "0.8rem", textAlign: "left", marginBottom: "24px" }}>
                      <div>
                        <span style={{ color: "#5A5A5A", textTransform: "uppercase", fontSize: "0.6rem" }}>Billed To:</span>
                        <strong style={{ display: "block", fontSize: "0.95rem" }}>{selectedBookingForInvoice.customerName}</strong>
                        <span>Phone: {selectedBookingForInvoice.customerPhone}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#5A5A5A", textTransform: "uppercase", fontSize: "0.6rem" }}>Invoice Details:</span>
                        <strong style={{ display: "block" }}>Booking ID: {selectedBookingForInvoice.id}</strong>
                        <span>Date Lock: {selectedBookingForInvoice.date}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "16px 0", fontSize: "0.8rem", textAlign: "left", marginBottom: "24px" }}>
                      <div style={{ display: "flex", justifySelf: "space-between", marginBottom: "8px" }}>
                        <span>Base venue space Booking:</span>
                        <strong>₹{selectedBookingForInvoice.pricing.basePrice.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: "flex", justifySelf: "space-between", marginBottom: "8px" }}>
                        <span>Catering & Premium Buffet:</span>
                        <strong>₹{selectedBookingForInvoice.pricing.servicesCost.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: "flex", justifySelf: "space-between", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "8px", marginBottom: "8px" }}>
                        <span>18% Government GST:</span>
                        <strong>₹{selectedBookingForInvoice.pricing.tax.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: "flex", justifySelf: "space-between", fontSize: "1.1rem", fontWeight: "700", color: "#171717", marginTop: "12px" }}>
                        <span>Subtotal Invoice Amount:</span>
                        <span>₹{selectedBookingForInvoice.pricing.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifySelf: "space-between", fontSize: "0.8rem", textAlign: "left", backgroundColor: "rgba(198, 161, 91, 0.08)", padding: "12px", borderRadius: "10px", marginBottom: "24px" }}>
                      <div>
                        <span>Advance Paid:</span>
                        <strong style={{ display: "block", color: "#28A745" }}>₹{selectedBookingForInvoice.pricing.advancePaid.toLocaleString()} Paid</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span>Outstanding Balance:</span>
                        <strong style={{ display: "block", color: "#F44336" }}>₹{selectedBookingForInvoice.pricing.remainingBalance.toLocaleString()} Outstanding</strong>
                      </div>
                    </div>

                    <button onClick={() => { alert("PDF download simulated successfully! Encrypted copy sent to client email."); setSelectedBookingForInvoice(null); }} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center" }}><Download size={16} /> Download Premium PDF Invoice</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              14. EVENT COST CALCULATOR
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
                    <span style={{ fontSize: "0.65rem", color: "#5A5A5A", textTransform: "uppercase" }}>Estimated Subtotal</span>
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
                      <span>Decor structure:</span>
                      <strong>₹{calcDecor.toLocaleString()}</strong>
                    </div>
                  </div>
                  
                  <button onClick={() => { alert("Calculation invoice generated successfully! Ready for operational log."); }} className="luxury-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "24px" }}>Lock Estimate Proposal</button>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              15. REVIEWS
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
              16. SETTINGS
              ============================================================== */}
          {activeAdminSubTab === "settings" && (
            <div className="luxury-card fade-in-reveal" style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Administrative Console Settings</h3>
              <p style={{ color: "#5A5A5A", fontSize: "0.85rem", marginBottom: "24px" }}>Configure database persistence, security permissions, and default operational hours.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>Operations Console Version</label>
                  <input type="text" disabled value="Gaarlandz ERP v2.4 (Strict Luxury)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#FAF9F5" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>Default Advance Deposit (₹)</label>
                  <input type="number" defaultValue={50000} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }} />
                </div>
                <button onClick={() => alert("Administrative parameters synced successfully.")} className="luxury-btn-primary" style={{ justifyContent: "center" }}>Save Configurations</button>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
