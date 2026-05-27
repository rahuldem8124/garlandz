"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================

export interface VenueSpace {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  description: string;
  image: string;
  category: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  isPerGuest?: boolean;
}

export interface BookingChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface Booking {
  id: string;
  eventType: string;
  spaceId: string;
  guestCount: number;
  date: string; // YYYY-MM-DD
  sessionTime: "Morning" | "Evening" | "Full Day";
  services: string[]; // Selected service IDs
  customRequirements: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pricing: {
    basePrice: number;
    sessionSurcharge: number;
    weekendSurcharge: number;
    peakSeasonSurcharge: number;
    demandSurcharge: number;
    servicesCost: number;
    subtotal: number;
    tax: number;
    total: number;
    advancePaid: number;
    remainingBalance: number;
  };
  status: "Inquiry" | "Confirmed" | "Decor Planning" | "Event Preparation" | "Completed" | "Cancelled";
  checklist: BookingChecklistItem[];
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  customerName: string;
  customerPhone: string;
  purpose: "Wedding Tour" | "Corporate Tour" | "Family Visit";
  date: string;
  timeSlot: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  converted?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  preferredSpaceId: string;
  guestCount: number;
  preferredDate: string;
  preferredSession: "Morning" | "Evening" | "Full Day";
  requirements: string;
  source: string;
  status: "New" | "Contacted" | "Negotiating" | "Converted" | "Lost";
  followUpActions: string[];
  createdAt: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  category: "Decoration" | "Photography" | "Food" | "Kids" | "Accommodation" | "Lighting" | "Entertainment" | "Custom";
  assignedTeam: string;
  status: "Pending" | "Assigned" | "In Progress" | "Ready" | "Completed";
  bookingId: string;
  date: string;
  customerName: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: "Decor" | "Photography" | "Security" | "Support Staff" | "Drivers" | "Catering";
  availability: boolean;
  contact: string;
  assignedEvents: string[];
}

export interface Vendor {
  id: string;
  name: string;
  type: "Decorator" | "Catering" | "Photography" | "Lighting" | "Music" | "Rental";
  status: "Available" | "Busy" | "Assigned" | "Payment Pending";
  contact: string;
}

export interface DocumentFile {
  id: string;
  title: string;
  type: "Contract" | "Quotation" | "Invoice" | "Vendor Agreement";
  customerName: string;
  date: string;
  amount?: number;
  status: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  type: "Booking" | "Payment" | "Staff" | "Vendor" | "Alert";
  date: string;
  read: boolean;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  bookingId: string;
  actions: string[];
}

// ==========================================
// CONTEXT TYPE DECLARATION
// ==========================================

interface GaarlandzContextType {
  spaces: VenueSpace[];
  bookings: Booking[];
  leads: Lead[];
  siteVisits: SiteVisit[];
  additionalServices: BookingService[];
  operations: KanbanTask[];
  staff: StaffMember[];
  vendors: Vendor[];
  documents: DocumentFile[];
  budgets: BudgetCategory[];
  notifications: SystemAlert[];
  automationLogs: AutomationLog[];
  loading: boolean;
  
  // Handlers
  addBooking: (bookingData: Omit<Booking, "id" | "pricing" | "checklist" | "createdAt" | "status">, isAdvancePayment: boolean) => { success: boolean; bookingId?: string; error?: string; alternatives?: string[] };
  updateBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, newStatus: Booking["status"]) => void;
  updateBookingChecklist: (bookingId: string, taskId: string, completed: boolean) => void;
  addLead: (leadData: Omit<Lead, "id" | "status" | "followUpActions" | "createdAt">) => void;
  updateLeadStatus: (id: string, newStatus: Lead["status"]) => void;
  addLeadFollowUp: (id: string, action: string) => void;
  convertLeadToBooking: (leadId: string, advancePaid: number) => { success: boolean; bookingId?: string; error?: string };
  addSiteVisit: (visitData: Omit<SiteVisit, "id" | "status">) => void;
  updateSiteVisitStatus: (id: string, newStatus: SiteVisit["status"]) => void;
  updateSpacePricing: (spaceId: string, newBasePrice: number, newCapacity: number) => void;
  addSpace: (space: Omit<VenueSpace, "id">) => void;
  updateSpaceDetails: (spaceId: string, updatedFields: Partial<VenueSpace>) => void;
  
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  updateVendorStatus: (id: string, status: Vendor["status"]) => void;
  addStaff: (member: Omit<StaffMember, "id">) => void;
  updateStaffAvailability: (id: string, availability: boolean) => void;
  
  addKanbanTask: (task: Omit<KanbanTask, "id">) => void;
  updateKanbanTaskStatus: (id: string, status: KanbanTask["status"]) => void;
  assignKanbanTaskTeam: (id: string, team: string) => void;
  
  addDocument: (doc: Omit<DocumentFile, "id">) => void;
  addNotification: (alert: Omit<SystemAlert, "id" | "date" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  generateInvoice: (bookingId: string) => void;
  
  // Calculators
  calculateDynamicPrice: (spaceId: string, dateStr: string, guestCount: number, sessionTime: Booking["sessionTime"], selectedServiceIds: string[], themeBasePrice?: number) => Booking["pricing"];
  checkDateAvailability: (spaceId: string, dateStr: string) => { isAvailable: boolean; bookedEventName?: string };
  getAlternativeDates: (spaceId: string, dateStr: string) => string[];
  isPremiumDate: (dateStr: string) => boolean;
}

const GaarlandzContext = createContext<GaarlandzContextType | undefined>(undefined);

// ==========================================
// CORE SEED DATABASES
// ==========================================

const INITIAL_SPACES: VenueSpace[] = [
  {
    id: "open-wedding",
    name: "Open Wedding Venue",
    capacity: 1000,
    basePrice: 150000,
    description: "An awe-inspiring open-air amphitheater enveloped in lush floral arches and magnificent warm lighting. Engineered specifically for timeless, grand royal weddings.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    category: "Outdoor Wedding"
  },
  {
    id: "corporate-hall",
    name: "Corporate Meeting Hall",
    capacity: 300,
    basePrice: 80000,
    description: "A meticulously customized banquet sanctuary supporting state-of-the-art acoustics, digital projection alignments, and grand business conference seating.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    category: "Indoor Corporate"
  },
  {
    id: "food-court",
    name: "Food Court / Mini Function Hall",
    capacity: 400,
    basePrice: 70000,
    description: "A gorgeous celebratory dining corridor. Houses catering sections, buffet structures, and elegant celebration spacing.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200",
    category: "Outdoor Buffet"
  },
  {
    id: "kids-play",
    name: "Kids Play Area",
    capacity: 150,
    basePrice: 30000,
    description: "An exquisite outdoor recreation playground complete with security supervisors, dynamic slides, and luxury custom kids catering counters.",
    image: "https://images.unsplash.com/photo-1571844307560-f55a55956a30?auto=format&fit=crop&q=80&w=1200",
    category: "Kids Zone"
  },
  {
    id: "photo-spots",
    name: "Photo Shoot Spots",
    capacity: 100,
    basePrice: 40000,
    description: "Curated trails featuring romantic sunset pavilions, classic golden-hour backdrops, cascading water steps, and floral swings.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    category: "Golden Shoots"
  },
  {
    id: "bride-groom-suite",
    name: "Luxurious Bride Groom Amenities",
    capacity: 50,
    basePrice: 25000,
    description: "Opulent private lounges styled with marble baths, five-star vanity bars, premium climate adjustments, and dedicated room-service operators.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
    category: "Royal Suites"
  }
];

const ADDITIONAL_SERVICES: BookingService[] = [
  { id: "srv-decor", name: "Premium Stage & Floral Decor", price: 45000 },
  { id: "srv-food", name: "Premium Food & Catering (per guest)", price: 800, isPerGuest: true },
  { id: "srv-photo", name: "Cinematic Photography & Film Pack", price: 35000 },
  { id: "srv-drone", name: "High-End Drone Filming Shoot", price: 15000 },
  { id: "srv-led", name: "High-Definition LED Backdrop Wall", price: 18000 },
  { id: "srv-kids", name: "Supervised Kids Area Activation", price: 12000 },
  { id: "srv-music", name: "Live Instrumental Band & DJ Sound System", price: 25000 },
  { id: "srv-entry", name: "Luxury Grand Custom Entry Setup", price: 15000 },
  { id: "srv-valet", name: "VIP Valet Parking Management", price: 8000 },
  { id: "srv-bridal", name: "Bridal Suite VIP Refreshment & Decor", price: 10000 },
  { id: "srv-groom", name: "Groom Suite Luxury Styling Amenity", price: 8000 },
  { id: "srv-fire", name: "Mid-Night Celebratory Fireworks", price: 20000 },
  { id: "srv-accom", name: "Luxury Guest Accommodations (10 Rooms)", price: 30000 }
];

const MOCK_CHECKLIST = [
  { id: "chk-1", task: "Stage Floral Theme Finalized", completed: true },
  { id: "chk-2", task: "Catering Menu Approved", completed: false },
  { id: "chk-3", task: "Audio-Acoustic Layout Synced", completed: false },
  { id: "chk-4", task: "Guest Table Placement Set", completed: true },
  { id: "chk-5", task: "Photography Brief Shared", completed: false }
];

const PREMIUM_DATES = [
  "2026-12-24", // Wedding Muhurtham
  "2026-12-25", // Christmas Holiday
  "2026-12-31", // New Year Eve Gala
  "2026-11-23", // Peak Auspicious Monday
  "2026-10-31", // Festival Muhurtham
  "2026-05-18", // Summer Royal Muhurtham
  "2026-06-15"
];

// ==========================================
// CONTEXT PROVIDER COMPONENT
// ==========================================

export const GaarlandzProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<VenueSpace[]>(INITIAL_SPACES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [operations, setOperations] = useState<KanbanTask[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [notifications, setNotifications] = useState<SystemAlert[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state helpers
  const syncToLocalStorage = (
    updatedSpaces: VenueSpace[],
    updatedBookings: Booking[],
    updatedLeads: Lead[],
    updatedSiteVisits: SiteVisit[],
    updatedOps: KanbanTask[],
    updatedStaff: StaffMember[],
    updatedVendors: Vendor[],
    updatedDocs: DocumentFile[],
    updatedBudgets: BudgetCategory[],
    updatedAlerts: SystemAlert[],
    updatedLogs: AutomationLog[]
  ) => {
    try {
      localStorage.setItem(
        "gaarlandz_storage_v1",
        JSON.stringify({
          spaces: updatedSpaces,
          bookings: updatedBookings,
          leads: updatedLeads,
          siteVisits: updatedSiteVisits,
          operations: updatedOps,
          staff: updatedStaff,
          vendors: updatedVendors,
          documents: updatedDocs,
          budgets: updatedBudgets,
          notifications: updatedAlerts,
          automationLogs: updatedLogs
        })
      );
    } catch (e) {
      console.error("Local storage sync error:", e);
    }
  };

  // Safe hydration loading
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gaarlandz_storage_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.spaces) setSpaces(parsed.spaces);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.siteVisits) setSiteVisits(parsed.siteVisits);
        if (parsed.operations) setOperations(parsed.operations);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.vendors) setVendors(parsed.vendors);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.automationLogs) setAutomationLogs(parsed.automationLogs);
      } else {
        // Core Mock Seeds
        const seedBookings: Booking[] = [
          {
            id: "GAAR1024",
            eventType: "Wedding",
            spaceId: "open-wedding",
            guestCount: 800,
            date: "2026-12-24",
            sessionTime: "Full Day",
            services: ["srv-decor", "srv-food", "srv-photo", "srv-drone", "srv-led", "srv-valet"],
            customRequirements: "Sunset wedding backdrop with rose gold stage layout. Drone cinematic shoot coordinated with wedding couple entrance.",
            customerName: "Rohan Kumar",
            customerPhone: "+91 80127 00700",
            customerEmail: "rohan@example.com",
            pricing: {
              basePrice: 150000,
              sessionSurcharge: 90000,
              weekendSurcharge: 0,
              peakSeasonSurcharge: 22500,
              demandSurcharge: 25000,
              servicesCost: 753000,
              subtotal: 1040500,
              tax: 187290,
              total: 1227790,
              advancePaid: 50000,
              remainingBalance: 1177790
            },
            status: "Confirmed",
            checklist: [
              { id: "chk-1", task: "Stage Floral Theme Finalized", completed: true },
              { id: "chk-2", task: "Catering Menu Approved", completed: false },
              { id: "chk-3", task: "Audio-Acoustic Layout Synced", completed: false },
              { id: "chk-4", task: "Guest Table Placement Set", completed: true },
              { id: "chk-5", task: "Photography Brief Shared", completed: false }
            ],
            createdAt: new Date("2026-05-15T10:00:00Z").toISOString()
          },
          {
            id: "GAAR1025",
            eventType: "Corporate",
            spaceId: "corporate-hall",
            guestCount: 250,
            date: "2026-06-20",
            sessionTime: "Morning",
            services: ["srv-food", "srv-music"],
            customRequirements: "High-speed corporate Wi-Fi layout, projection alignments, acoustic mics and stage setup.",
            customerName: "Anjali Sharma",
            customerPhone: "+91 98435 55700",
            customerEmail: "corporate@techcorp.com",
            pricing: {
              basePrice: 80000,
              sessionSurcharge: 0,
              weekendSurcharge: 20000,
              peakSeasonSurcharge: 0,
              demandSurcharge: 0,
              servicesCost: 225000,
              subtotal: 325000,
              tax: 58500,
              total: 383500,
              advancePaid: 50000,
              remainingBalance: 333500
            },
            status: "Event Preparation",
            checklist: [
              { id: "chk-1", task: "Acoustic System Tested", completed: true },
              { id: "chk-2", task: "Catering Menu Curated", completed: true },
              { id: "chk-3", task: "Stage Screens Positioned", completed: true },
              { id: "chk-4", task: "Guest Seats Positioned", completed: false }
            ],
            createdAt: new Date("2026-05-18T14:30:00Z").toISOString()
          }
        ];

        const seedLeads: Lead[] = [
          {
            id: "LD101",
            name: "Siddharth Sen",
            phone: "+91 88998 87766",
            email: "siddharth@gmail.com",
            eventType: "Wedding",
            preferredSpaceId: "open-wedding",
            guestCount: 650,
            preferredDate: "2026-11-23",
            preferredSession: "Evening",
            requirements: "Traditional south Indian theme stage, golden arches, grand entry with traditional instrumental music.",
            source: "Website Direct Inquiry",
            status: "Negotiating",
            followUpActions: [
              "Initial call May 20: Budget package customized.",
              "Site visit scheduled for May 28."
            ],
            createdAt: new Date("2026-05-20T11:00:00Z").toISOString()
          },
          {
            id: "LD102",
            name: "Meghna Nair",
            phone: "+91 99443 32211",
            email: "meghna@outlook.com",
            eventType: "Reception",
            preferredSpaceId: "food-court",
            guestCount: 300,
            preferredDate: "2026-08-15",
            preferredSession: "Full Day",
            requirements: "Sunset photoshoot spots combined with mini banquet celebration, high quality buffet requested.",
            source: "Instagram Lead",
            status: "New",
            followUpActions: ["Introductory packages brochure sent."],
            createdAt: new Date("2026-05-25T09:15:00Z").toISOString()
          }
        ];

        const seedSiteVisits: SiteVisit[] = [
          {
            id: "SV201",
            customerName: "Siddharth Sen",
            customerPhone: "+91 88998 87766",
            purpose: "Wedding Tour",
            date: "2026-05-28",
            timeSlot: "10:00 AM - 11:30 AM",
            status: "Scheduled",
            converted: false
          },
          {
            id: "SV202",
            customerName: "Karthik Raja",
            customerPhone: "+91 90090 09001",
            purpose: "Family Visit",
            date: "2026-05-30",
            timeSlot: "02:00 PM - 03:30 PM",
            status: "Scheduled",
            converted: false
          }
        ];

        const seedOperations: KanbanTask[] = [
          {
            id: "OP301",
            title: "Exquisite Stage Floral Setting",
            category: "Decoration",
            assignedTeam: "Decor Team Alpha",
            status: "In Progress",
            bookingId: "GAAR1024",
            date: "2026-12-24",
            customerName: "Rohan Kumar"
          },
          {
            id: "OP302",
            title: "Live Catering Counter Setup",
            category: "Food",
            assignedTeam: "Food Prep Crew",
            status: "Assigned",
            bookingId: "GAAR1024",
            date: "2026-12-24",
            customerName: "Rohan Kumar"
          },
          {
            id: "OP303",
            title: "Cinematic Film Shoot Scheduling",
            category: "Photography",
            assignedTeam: "PixelPerfect Photo",
            status: "Assigned",
            bookingId: "GAAR1024",
            date: "2026-12-24",
            customerName: "Rohan Kumar"
          },
          {
            id: "OP304",
            title: "Corporate Acoustics Mic Soundcheck",
            category: "Lighting",
            assignedTeam: "Soundwave Crew",
            status: "Ready",
            bookingId: "GAAR1025",
            date: "2026-06-20",
            customerName: "Anjali Sharma"
          },
          {
            id: "OP305",
            title: "VIP Bridal Suite Styling Prep",
            category: "Accommodation",
            assignedTeam: "Hospitality Prime",
            status: "Completed",
            bookingId: "GAAR1024",
            date: "2026-12-24",
            customerName: "Rohan Kumar"
          }
        ];

        const seedStaff: StaffMember[] = [
          { id: "ST501", name: "Ramesh Selvan", department: "Decor", availability: true, contact: "+91 94430 11223", assignedEvents: ["GAAR1024"] },
          { id: "ST502", name: "Karthi Murugan", department: "Catering", availability: true, contact: "+91 98420 55667", assignedEvents: ["GAAR1024", "GAAR1025"] },
          { id: "ST503", name: "Anish Nair", department: "Photography", availability: true, contact: "+91 99440 88990", assignedEvents: ["GAAR1024"] },
          { id: "ST504", name: "Velu Swamy", department: "Security", availability: true, contact: "+91 90030 44556", assignedEvents: ["GAAR1024", "GAAR1025"] },
          { id: "ST505", name: "Gopal Swamy", department: "Drivers", availability: true, contact: "+91 95001 22334", assignedEvents: ["GAAR1024"] },
          { id: "ST506", name: "Prema Latha", department: "Support Staff", availability: false, contact: "+91 91234 56789", assignedEvents: [] }
        ];

        const seedVendors: Vendor[] = [
          { id: "VN601", name: "Marigold Florists Coimbatore", type: "Decorator", status: "Assigned", contact: "+91 94435 99887" },
          { id: "VN602", name: "Kovai Royal Catering Services", type: "Catering", status: "Available", contact: "+91 98422 11223" },
          { id: "VN603", name: "Vibe Acoustic Sound Rentals", type: "Music", status: "Available", contact: "+91 90033 44556" },
          { id: "VN604", name: "PixelPerfect Film Studio", type: "Photography", status: "Assigned", contact: "+91 99440 22334" },
          { id: "VN605", name: "BrightGlow Venue Lights", type: "Lighting", status: "Payment Pending", contact: "+91 95000 66778" }
        ];

        const seedDocuments: DocumentFile[] = [
          { id: "DOC701", title: "Rohan Kumar - Wedding Reservation Contract.pdf", type: "Contract", customerName: "Rohan Kumar", date: "2026-05-15", amount: 1227790, status: "Signed" },
          { id: "DOC702", title: "Anjali Sharma - Corporate Booking Proposal.pdf", type: "Quotation", customerName: "Anjali Sharma", date: "2026-05-18", amount: 383500, status: "Approved" },
          { id: "DOC703", title: "GAAR1024 Invoice - Advance Deposit.pdf", type: "Invoice", customerName: "Rohan Kumar", date: "2026-05-15", amount: 50000, status: "Verified" },
          { id: "DOC704", title: "Marigold Florists Services Agreement.pdf", type: "Vendor Agreement", customerName: "Marigold Florists", date: "2026-05-20", amount: 45000, status: "Active" }
        ];

        const seedBudgets: BudgetCategory[] = [
          { id: "BDG801", name: "Venue Operations & Rentals", allocated: 500000, spent: 230000 },
          { id: "BDG802", name: "Stage Flower Decorations", allocated: 200000, spent: 45000 },
          { id: "BDG803", name: "Premium Kitchen & Catering", allocated: 600000, spent: 200000 },
          { id: "BDG804", name: "Photography & Cinematography", allocated: 150000, spent: 35000 },
          { id: "BDG805", name: "Acoustic DJ & Live Entertainment", allocated: 100000, spent: 25000 },
          { id: "BDG806", name: "VIP Amenities & Miscellaneous", allocated: 80000, spent: 18000 }
        ];

        const seedAlerts: SystemAlert[] = [
          { id: "ALT901", title: "New Booking Registered", description: "Advance paid for Rohan Kumar's wedding on Dec 24, 2026.", type: "Booking", date: new Date().toLocaleDateString(), read: false },
          { id: "ALT902", title: "Property Visit Scheduled", description: "Siddharth Sen scheduled wedding tour visit for May 28, 2026.", type: "Staff", date: new Date().toLocaleDateString(), read: false }
        ];

        const seedLogs: AutomationLog[] = [
          {
            id: "LOG101",
            timestamp: new Date("2026-05-15T10:00:00Z").toISOString(),
            bookingId: "GAAR1024",
            actions: [
              "Date Reserved: Locked December 24, 2026.",
              "Invoice Generated: DOC703 Invoice of ₹50,000 logged.",
              "Checklist Seeding: Placed 5 operational milestones.",
              "Kanban Setup: Pushed 4 operations board cards.",
              "Customer Notification: Confirmation mail sent to rohan@example.com."
            ]
          }
        ];

        setBookings(seedBookings);
        setLeads(seedLeads);
        setSiteVisits(seedSiteVisits);
        setOperations(seedOperations);
        setStaff(seedStaff);
        setVendors(seedVendors);
        setDocuments(seedDocuments);
        setBudgets(seedBudgets);
        setNotifications(seedAlerts);
        setAutomationLogs(seedLogs);

        syncToLocalStorage(
          INITIAL_SPACES,
          seedBookings,
          seedLeads,
          seedSiteVisits,
          seedOperations,
          seedStaff,
          seedVendors,
          seedDocuments,
          seedBudgets,
          seedAlerts,
          seedLogs
        );
      }
    } catch (e) {
      console.error("Local storage initialization failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // HEATMAP PARAMETERS HELPERS
  // ==========================================

  const isPremiumDate = (dateStr: string): boolean => {
    return PREMIUM_DATES.includes(dateStr);
  };

  const checkDateAvailability = (spaceId: string, dateStr: string): { isAvailable: boolean; bookedEventName?: string } => {
    const existing = bookings.find(
      (b) => b.spaceId === spaceId && b.date === dateStr && b.status !== "Cancelled"
    );
    if (existing) {
      return {
        isAvailable: false,
        bookedEventName: `${existing.customerName}'s ${existing.eventType}`
      };
    }
    return { isAvailable: true };
  };

  const getAlternativeDates = (spaceId: string, dateStr: string): string[] => {
    const alternatives: string[] = [];
    const baseDate = new Date(dateStr);
    const offsets = [-2, 2, -1, 1, -3, 3, 4, -4];

    for (const offset of offsets) {
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + offset);
      const targetStr = targetDate.toISOString().split("T")[0];

      const availability = checkDateAvailability(spaceId, targetStr);
      if (availability.isAvailable) {
        alternatives.push(targetStr);
      }
      if (alternatives.length >= 3) break;
    }

    return alternatives;
  };

  // ==========================================
  // DYNAMIC PRICING ENGINE
  // ==========================================

  const getThemeBasePrice = (eventType: string): number => {
    const key = eventType.toLowerCase().replace(" function", "");
    const prices: Record<string, number> = {
      wedding: 150000,
      birthday: 65000,
      corporate: 90000,
      engagement: 75000,
      photoshoot: 40000,
      family: 70000,
      custom: 100000
    };
    return prices[key] || 150000;
  };

  const calculateDynamicPrice = (
    spaceId: string,
    dateStr: string,
    guestCount: number,
    sessionTime: Booking["sessionTime"],
    selectedServiceIds: string[],
    themeBasePrice?: number
  ): Booking["pricing"] => {
    const space = spaces.find((s) => s.id === spaceId) || INITIAL_SPACES[0];
    const base = themeBasePrice !== undefined ? themeBasePrice : space.basePrice;

    // 1. Session Surcharges
    let sessionSurcharge = 0;
    if (sessionTime === "Evening") {
      sessionSurcharge = 25000;
    } else if (sessionTime === "Full Day") {
      sessionSurcharge = Math.round(base * 0.6);
    }

    // 2. Weekend Surcharge
    let weekendSurcharge = 0;
    if (dateStr) {
      const dateObj = new Date(dateStr);
      const day = dateObj.getDay();
      if (day === 0 || day === 5 || day === 6) {
        weekendSurcharge = 20000;
      }
    }

    // 3. Peak Season Surcharge (Nov, Dec, Jan, Feb, May)
    let peakSeasonSurcharge = 0;
    if (dateStr) {
      const dateObj = new Date(dateStr);
      const month = dateObj.getMonth();
      if ([0, 1, 4, 10, 11].includes(month)) {
        peakSeasonSurcharge = Math.round(base * 0.15);
      }
    }

    // 4. Auspicious Peak Demand Flat Surcharge
    let demandSurcharge = 0;
    if (dateStr && isPremiumDate(dateStr)) {
      demandSurcharge = 25000;
    }

    // 5. Additional Services
    let servicesCost = 0;
    selectedServiceIds.forEach((srvId) => {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === srvId);
      if (service) {
        if (service.isPerGuest) {
          servicesCost += service.price * guestCount;
        } else {
          servicesCost += service.price;
        }
      }
    });

    // Guest Size Scaling
    if (guestCount > 300 && guestCount <= 600) {
      servicesCost += 15000;
    } else if (guestCount > 600) {
      servicesCost += 30000;
    }

    const subtotal = base + sessionSurcharge + weekendSurcharge + peakSeasonSurcharge + demandSurcharge + servicesCost;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;
    const advancePaid = 50000;
    const remainingBalance = total - advancePaid;

    return {
      basePrice: base,
      sessionSurcharge,
      weekendSurcharge,
      peakSeasonSurcharge,
      demandSurcharge,
      servicesCost,
      subtotal,
      tax,
      total,
      advancePaid,
      remainingBalance
    };
  };

  // ==========================================
  // BOOKING HANDLERS
  // ==========================================

  const addBooking = (
    bookingData: Omit<Booking, "id" | "pricing" | "checklist" | "createdAt" | "status">,
    isAdvancePayment: boolean
  ) => {
    const availability = checkDateAvailability(bookingData.spaceId, bookingData.date);
    if (!availability.isAvailable) {
      const alternatives = getAlternativeDates(bookingData.spaceId, bookingData.date);
      return {
        success: false,
        error: `Conflict! Date already secured by ${availability.bookedEventName}.`,
        alternatives
      };
    }

    const pricing = calculateDynamicPrice(
      bookingData.spaceId,
      bookingData.date,
      bookingData.guestCount,
      bookingData.sessionTime,
      bookingData.services,
      getThemeBasePrice(bookingData.eventType)
    );

    const generatedId = `GAAR${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      ...bookingData,
      id: generatedId,
      pricing,
      status: isAdvancePayment ? "Confirmed" : "Inquiry",
      checklist: MOCK_CHECKLIST.map((item) => ({ ...item, completed: false })),
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);

    // Automation: create doc, create operations tasks, assign staff, budget update
    const generatedDoc: DocumentFile = {
      id: `DOC${Math.floor(700 + Math.random() * 300)}`,
      title: `${bookingData.customerName} - ${bookingData.eventType} Confirmation.pdf`,
      type: isAdvancePayment ? "Contract" : "Quotation",
      customerName: bookingData.customerName,
      date: new Date().toISOString().split("T")[0],
      amount: pricing.total,
      status: isAdvancePayment ? "Signed" : "Draft"
    };
    const updatedDocs = [generatedDoc, ...documents];
    setDocuments(updatedDocs);

    // Auto-create Kanban tasks
    const newTasks: KanbanTask[] = [
      {
        id: `OP${Math.floor(300 + Math.random() * 700)}`,
        title: `${bookingData.eventType} Floral Mandap stage prep`,
        category: "Decoration",
        assignedTeam: "Decor Team Alpha",
        status: isAdvancePayment ? "Assigned" : "Pending",
        bookingId: generatedId,
        date: bookingData.date,
        customerName: bookingData.customerName
      },
      {
        id: `OP${Math.floor(300 + Math.random() * 700)}`,
        title: `${bookingData.eventType} Kitchen Buffet menu lines`,
        category: "Food",
        assignedTeam: "Food Prep Crew",
        status: isAdvancePayment ? "Assigned" : "Pending",
        bookingId: generatedId,
        date: bookingData.date,
        customerName: bookingData.customerName
      }
    ];
    const updatedOps = [...newTasks, ...operations];
    setOperations(updatedOps);

    // Auto-assign staff events
    const updatedStaff = staff.map((s) => {
      if (s.department === "Decor" || s.department === "Catering") {
        return {
          ...s,
          assignedEvents: [...s.assignedEvents, generatedId]
        };
      }
      return s;
    });
    setStaff(updatedStaff);

    // Auto-add alert notification
    const newAlert: SystemAlert = {
      id: `ALT${Math.floor(900 + Math.random() * 100)}`,
      title: isAdvancePayment ? "Premium Booking Confirmed" : "Callback Inquiry Lodged",
      description: `${bookingData.customerName} requested ${bookingData.eventType} for ${bookingData.date}.`,
      type: "Booking",
      date: new Date().toLocaleDateString(),
      read: false
    };
    const updatedAlerts = [newAlert, ...notifications];
    setNotifications(updatedAlerts);

    // Automation Log history
    const newLog: AutomationLog = {
      id: `LOG${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      bookingId: generatedId,
      actions: [
        `Date Lock: ${bookingData.date} successfully blocked on calendar.`,
        `Invoice Generation: dynamic quote generated. ID ${generatedDoc.id} logged.`,
        `Checklist Spawned: Placed 5 operational planning milestones.`,
        `Kanban Boards updated: Created 2 operational tasks.`,
        `Customer notification: Confirmation email scheduled for ${bookingData.customerEmail}.`
      ]
    };
    const updatedLogs = [newLog, ...automationLogs];
    setAutomationLogs(updatedLogs);

    // Lead sync
    let updatedLeads = [...leads];
    if (!isAdvancePayment) {
      const newLead: Lead = {
        id: `LD${Math.floor(200 + Math.random() * 800)}`,
        name: bookingData.customerName,
        phone: bookingData.customerPhone,
        email: bookingData.customerEmail,
        eventType: bookingData.eventType,
        preferredSpaceId: bookingData.spaceId,
        guestCount: bookingData.guestCount,
        preferredDate: bookingData.date,
        preferredSession: bookingData.sessionTime,
        requirements: bookingData.customRequirements || `Requested expert callback.`,
        source: "Mobile Booking Wizard",
        status: "New",
        followUpActions: ["Initial callback auto-scheduled on date lock."],
        createdAt: new Date().toISOString()
      };
      updatedLeads = [newLead, ...leads];
      setLeads(updatedLeads);
    }

    syncToLocalStorage(
      spaces,
      updatedBookings,
      updatedLeads,
      siteVisits,
      updatedOps,
      updatedStaff,
      vendors,
      updatedDocs,
      budgets,
      updatedAlerts,
      updatedLogs
    );

    return {
      success: true,
      bookingId: generatedId
    };
  };

  const updateBooking = (booking: Booking) => {
    const updated = bookings.map((b) => (b.id === booking.id ? booking : b));
    setBookings(updated);
    syncToLocalStorage(
      spaces,
      updated,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateBookingStatus = (id: string, newStatus: Booking["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    syncToLocalStorage(
      spaces,
      updated,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateBookingChecklist = (bookingId: string, taskId: string, completed: boolean) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const updatedChecklist = b.checklist.map((item) =>
          item.id === taskId ? { ...item, completed } : item
        );
        return { ...b, checklist: updatedChecklist };
      }
      return b;
    });
    setBookings(updated);
    syncToLocalStorage(
      spaces,
      updated,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  // ==========================================
  // LEADS & SITE VISITS HANDLERS
  // ==========================================

  const addLead = (leadData: Omit<Lead, "id" | "status" | "followUpActions" | "createdAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: `LD${Math.floor(200 + Math.random() * 800)}`,
      status: "New",
      followUpActions: ["Initial callback registered."],
      createdAt: new Date().toISOString()
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      updated,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateLeadStatus = (id: string, newStatus: Lead["status"]) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    setLeads(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      updated,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const addLeadFollowUp = (id: string, action: string) => {
    const updated = leads.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          followUpActions: [...l.followUpActions, `${new Date().toLocaleDateString()}: ${action}`]
        };
      }
      return l;
    });
    setLeads(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      updated,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const convertLeadToBooking = (leadId: string, advancePaid: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    const availability = checkDateAvailability(lead.preferredSpaceId, lead.preferredDate);
    if (!availability.isAvailable) {
      return { success: false, error: `Conflict on date!` };
    }

    const generatedId = `GAAR${Math.floor(1000 + Math.random() * 9000)}`;
    const pricing = calculateDynamicPrice(
      lead.preferredSpaceId,
      lead.preferredDate,
      lead.guestCount,
      lead.preferredSession || "Morning",
      [],
      getThemeBasePrice(lead.eventType)
    );

    pricing.advancePaid = advancePaid;
    pricing.remainingBalance = pricing.total - advancePaid;

    const newBooking: Booking = {
      id: generatedId,
      eventType: lead.eventType,
      spaceId: lead.preferredSpaceId,
      guestCount: lead.guestCount,
      date: lead.preferredDate,
      sessionTime: lead.preferredSession || "Morning",
      services: [],
      customRequirements: lead.requirements,
      customerName: lead.name,
      customerPhone: lead.phone,
      customerEmail: lead.email,
      pricing,
      status: "Confirmed",
      checklist: MOCK_CHECKLIST.map((c) => ({ ...c, completed: false })),
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    const updatedLeads = leads.map((l) => (l.id === leadId ? { ...l, status: "Converted" as const } : l));

    setBookings(updatedBookings);
    setLeads(updatedLeads);

    // Auto Invoice doc
    const newDoc: DocumentFile = {
      id: `DOC${Math.floor(700 + Math.random() * 300)}`,
      title: `${lead.name} - Converted Booking Invoice.pdf`,
      type: "Invoice",
      customerName: lead.name,
      date: new Date().toISOString().split("T")[0],
      amount: pricing.total,
      status: "Advance Confirmed"
    };
    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);

    // Alerts
    const newAlert: SystemAlert = {
      id: `ALT${Math.floor(900 + Math.random() * 100)}`,
      title: "Lead Converted to Event",
      description: `${lead.name}'s callback successfully converted to Booking ID: ${generatedId}.`,
      type: "Payment",
      date: new Date().toLocaleDateString(),
      read: false
    };
    const updatedAlerts = [newAlert, ...notifications];
    setNotifications(updatedAlerts);

    syncToLocalStorage(
      spaces,
      updatedBookings,
      updatedLeads,
      siteVisits,
      operations,
      staff,
      vendors,
      updatedDocs,
      budgets,
      updatedAlerts,
      automationLogs
    );

    return {
      success: true,
      bookingId: generatedId
    };
  };

  const addSiteVisit = (visitData: Omit<SiteVisit, "id" | "status">) => {
    const newVisit: SiteVisit = {
      ...visitData,
      id: `SV${Math.floor(300 + Math.random() * 700)}`,
      status: "Scheduled",
      converted: false
    };
    const updatedVisits = [newVisit, ...siteVisits];
    setSiteVisits(updatedVisits);

    // Seed lead
    const newLead: Lead = {
      id: `LD${Math.floor(200 + Math.random() * 800)}`,
      name: visitData.customerName,
      phone: visitData.customerPhone,
      email: `${visitData.customerName.toLowerCase().replace(/\s/g, "")}@example.com`,
      eventType: "Site Tour Inquiry",
      preferredSpaceId: "open-wedding",
      guestCount: 5,
      preferredDate: visitData.date,
      preferredSession: "Morning",
      requirements: `Scheduled physical ${visitData.purpose} at slot ${visitData.timeSlot}.`,
      source: "Public Website Visit Scheduler",
      status: "New",
      followUpActions: [`Site tour visit scheduled for ${visitData.date}`],
      createdAt: new Date().toISOString()
    };
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);

    syncToLocalStorage(
      spaces,
      bookings,
      updatedLeads,
      updatedVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateSiteVisitStatus = (id: string, newStatus: SiteVisit["status"]) => {
    const updated = siteVisits.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          status: newStatus,
          converted: newStatus === "Completed" ? true : v.converted
        };
      }
      return v;
    });
    setSiteVisits(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      updated,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateSpacePricing = (spaceId: string, newBasePrice: number, newCapacity: number) => {
    const updatedSpaces = spaces.map((s) =>
      s.id === spaceId ? { ...s, basePrice: newBasePrice, capacity: newCapacity } : s
    );
    setSpaces(updatedSpaces);
    syncToLocalStorage(
      updatedSpaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const addSpace = (spaceData: Omit<VenueSpace, "id">) => {
    const newSpace: VenueSpace = {
      ...spaceData,
      id: `sp-${spaceData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Math.floor(Math.random() * 1000)}`
    };
    const updatedSpaces = [...spaces, newSpace];
    setSpaces(updatedSpaces);
    syncToLocalStorage(
      updatedSpaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateSpaceDetails = (spaceId: string, updatedFields: Partial<VenueSpace>) => {
    const updatedSpaces = spaces.map((s) =>
      s.id === spaceId ? { ...s, ...updatedFields } : s
    );
    setSpaces(updatedSpaces);
    syncToLocalStorage(
      updatedSpaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  // ==========================================
  // STAFF & VENDOR MANAGEMENT
  // ==========================================

  const addVendor = (vendor: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `VN${Math.floor(600 + Math.random() * 400)}`
    };
    const updated = [newVendor, ...vendors];
    setVendors(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      updated,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateVendorStatus = (id: string, status: Vendor["status"]) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, status } : v));
    setVendors(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      updated,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const addStaff = (member: Omit<StaffMember, "id">) => {
    const newMember: StaffMember = {
      ...member,
      id: `ST${Math.floor(500 + Math.random() * 500)}`
    };
    const updated = [newMember, ...staff];
    setStaff(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      updated,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateStaffAvailability = (id: string, availability: boolean) => {
    const updated = staff.map((s) => (s.id === id ? { ...s, availability } : s));
    setStaff(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      updated,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  // ==========================================
  // KANBAN OPERATIONS BOARD HANDLERS
  // ==========================================

  const addKanbanTask = (task: Omit<KanbanTask, "id">) => {
    const newTask: KanbanTask = {
      ...task,
      id: `OP${Math.floor(300 + Math.random() * 700)}`
    };
    const updated = [newTask, ...operations];
    setOperations(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      updated,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const updateKanbanTaskStatus = (id: string, status: KanbanTask["status"]) => {
    const updated = operations.map((o) => (o.id === id ? { ...o, status } : o));
    setOperations(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      updated,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  const assignKanbanTaskTeam = (id: string, team: string) => {
    const updated = operations.map((o) => (o.id === id ? { ...o, assignedTeam: team, status: "Assigned" as const } : o));
    setOperations(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      updated,
      staff,
      vendors,
      documents,
      budgets,
      notifications,
      automationLogs
    );
  };

  // ==========================================
  // DOCUMENTS & NOTIFICATIONS SERVICES
  // ==========================================

  const addDocument = (doc: Omit<DocumentFile, "id">) => {
    const newDoc: DocumentFile = {
      ...doc,
      id: `DOC${Math.floor(700 + Math.random() * 300)}`
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      updated,
      budgets,
      notifications,
      automationLogs
    );
  };

  const addNotification = (alert: Omit<SystemAlert, "id" | "date" | "read">) => {
    const newAlert: SystemAlert = {
      ...alert,
      id: `ALT${Math.floor(900 + Math.random() * 100)}`,
      date: new Date().toLocaleDateString(),
      read: false
    };
    const updated = [newAlert, ...notifications];
    setNotifications(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      updated,
      automationLogs
    );
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      updated,
      automationLogs
    );
  };

  const clearNotifications = () => {
    const updated: SystemAlert[] = [];
    setNotifications(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      documents,
      budgets,
      updated,
      automationLogs
    );
  };

  const generateInvoice = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newDoc: DocumentFile = {
      id: `DOC${Math.floor(700 + Math.random() * 300)}`,
      title: `Invoice_${bookingId}_Reciept.pdf`,
      type: "Invoice",
      customerName: booking.customerName,
      date: new Date().toISOString().split("T")[0],
      amount: booking.pricing.total,
      status: "Logged & Verified"
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    syncToLocalStorage(
      spaces,
      bookings,
      leads,
      siteVisits,
      operations,
      staff,
      vendors,
      updated,
      budgets,
      notifications,
      automationLogs
    );
    alert(`dynamic Invoice PDF generated successfully for booking ${bookingId}! File logged under Document Center folder.`);
  };

  return (
    <GaarlandzContext.Provider
      value={{
        spaces,
        bookings,
        leads,
        siteVisits,
        additionalServices: ADDITIONAL_SERVICES,
        operations,
        staff,
        vendors,
        documents,
        budgets,
        notifications,
        automationLogs,
        loading,
        addBooking,
        updateBooking,
        updateBookingStatus,
        updateBookingChecklist,
        addLead,
        updateLeadStatus,
        addLeadFollowUp,
        convertLeadToBooking,
        addSiteVisit,
        updateSiteVisitStatus,
        updateSpacePricing,
        addSpace,
        updateSpaceDetails,
        addVendor,
        updateVendorStatus,
        addStaff,
        updateStaffAvailability,
        addKanbanTask,
        updateKanbanTaskStatus,
        assignKanbanTaskTeam,
        addDocument,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        generateInvoice,
        calculateDynamicPrice,
        checkDateAvailability,
        getAlternativeDates,
        isPremiumDate
      }}
    >
      {children}
    </GaarlandzContext.Provider>
  );
};

export const useGaarlandz = () => {
  const context = useContext(GaarlandzContext);
  if (!context) {
    throw new Error("useGaarlandz must be used within a GaarlandzProvider");
  }
  return context;
};
