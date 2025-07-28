// Comprehensive demo data for VELY platform showcasing

export const demoStylists = [
  {
    id: "sarah-demo",
    firstName: "Sarah",
    lastName: "Chen",
    profileImageUrl: "https://images.unsplash.com/photo-1594736797933-d0d4519d8e0a?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 247,
    bio: "Celebrity stylist with 8+ years experience. Specializes in modern cuts and color transformations.",
    specialties: ["Color", "Modern Cuts", "Balayage", "Bridal"],
    languages: ["English", "Mandarin", "Cantonese"],
    experience: "8 years",
    location: "Downtown Toronto",
    priceRange: "$85-$150",
    isAvailable: true,
    velyCount: 1247,
    verificationStatus: "verified",
    services: [
      { id: "precision-cut", name: "Precision Cut & Style", price: 85, duration: "90 min" },
      { id: "color-service", name: "Full Color", price: 150, duration: "180 min" },
      { id: "balayage", name: "Balayage Highlights", price: 180, duration: "210 min" }
    ]
  },
  {
    id: "priya-demo",
    firstName: "Priya",
    lastName: "Sharma",
    profileImageUrl: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 189,
    bio: "Curly hair specialist and natural texture expert. Creating beautiful styles that enhance your natural beauty.",
    specialties: ["Curly Hair", "Natural Textures", "Protective Styles", "Hair Health"],
    languages: ["English", "Hindi", "Punjabi"],
    experience: "6 years",
    location: "Midtown Toronto",
    priceRange: "$75-$120",
    isAvailable: true,
    velyCount: 892,
    verificationStatus: "verified",
    services: [
      { id: "curly-cut", name: "Curly Cut & Style", price: 75, duration: "75 min" },
      { id: "protective-style", name: "Protective Styling", price: 95, duration: "120 min" },
      { id: "hair-treatment", name: "Deep Treatment", price: 60, duration: "60 min" }
    ]
  },
  {
    id: "marcus-demo",
    firstName: "Marcus",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    rating: 4.7,
    reviewCount: 156,
    bio: "Men's grooming expert and beard specialist. Classic cuts with modern flair.",
    specialties: ["Men's Cuts", "Beard Styling", "Classic Styles", "Fade Cuts"],
    languages: ["English", "French"],
    experience: "5 years",
    location: "West Toronto",
    priceRange: "$65-$95",
    isAvailable: false, // Currently busy
    velyCount: 634,
    verificationStatus: "verified",
    services: [
      { id: "mens-cut", name: "Men's Cut & Style", price: 65, duration: "45 min" },
      { id: "beard-trim", name: "Beard Trim & Shape", price: 35, duration: "30 min" },
      { id: "full-service", name: "Cut + Beard Package", price: 85, duration: "75 min" }
    ]
  }
];

export const demoBookings = [
  {
    id: "booking-001",
    clientId: "demo-client",
    stylistId: "sarah-demo",
    status: "confirmed",
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    services: ["precision-cut"],
    addOnServices: ["deep-conditioning", "blow-dry-finish"],
    address: "123 Queen St W, Toronto, ON M5H 2M9",
    totalAmount: 140,
    estimatedDuration: "120 min",
    notes: "Please focus on layers and volume",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "booking-002",
    clientId: "demo-client",
    stylistId: "priya-demo",
    status: "completed",
    scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    services: ["curly-cut"],
    addOnServices: ["hair-treatment"],
    address: "456 College St, Toronto, ON M6G 1A4",
    totalAmount: 135,
    estimatedDuration: "135 min",
    rating: 5,
    review: "Amazing work! Priya really understands curly hair. Best cut I've ever had!",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "booking-003",
    clientId: "demo-client",
    stylistId: "marcus-demo",
    status: "on_way",
    scheduledAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    services: ["full-service"],
    addOnServices: [],
    address: "789 King St E, Toronto, ON M5A 1M2",
    totalAmount: 100,
    estimatedDuration: "75 min",
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const demoMessages = [
  {
    id: "msg-001",
    bookingId: "booking-001",
    senderId: "sarah-demo",
    senderType: "stylist",
    message: "Hi! I'm confirming our appointment for 2 PM today. I'll be bringing my premium color line for your highlights!",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: "msg-002",
    bookingId: "booking-003",
    senderId: "marcus-demo",
    senderType: "stylist",
    message: "On my way! Should be there in about 15 minutes. Traffic is light.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: "msg-003",
    bookingId: "booking-003",
    senderId: "demo-client",
    senderType: "client",
    message: "Perfect! I'll be ready. Buzzer is #304.",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    isRead: true
  }
];

export const demoNotifications = [
  {
    id: "notif-001",
    type: "booking_reminder",
    title: "Appointment Reminder",
    message: "Your appointment with Sarah is in 2 hours",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "high",
    bookingId: "booking-001"
  },
  {
    id: "notif-002",
    type: "stylist_arrival",
    title: "Stylist En Route",
    message: "Marcus is on his way! ETA: 15 minutes",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "high",
    bookingId: "booking-003"
  },
  {
    id: "notif-003",
    type: "review_request",
    title: "How was your experience?",
    message: "Please rate your recent appointment with Priya",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: "medium",
    bookingId: "booking-002"
  },
  {
    id: "notif-004",
    type: "competition",
    title: "Cut of the Month",
    message: "Upload your fresh cut for a chance to win $100!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "low"
  }
];

export const demoCompetitionEntries = [
  {
    id: "entry-001",
    userId: "demo-client",
    userName: "Jessica M.",
    stylistId: "sarah-demo",
    stylistName: "Sarah Chen",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0b29430803?w=400&h=400&fit=crop",
    description: "Amazing balayage transformation by Sarah! Love the natural-looking highlights.",
    votes: 47,
    status: "approved",
    category: "Color Transformation",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "entry-002",
    userId: "user-002",
    userName: "Michael R.",
    stylistId: "marcus-demo",
    stylistName: "Marcus Johnson",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3847688a4d32?w=400&h=400&fit=crop",
    description: "Clean fade and beard trim. Marcus always delivers perfection!",
    votes: 33,
    status: "approved",
    category: "Men's Styling",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "entry-003",
    userId: "user-003",
    userName: "Aisha K.",
    stylistId: "priya-demo",
    stylistName: "Priya Sharma",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    description: "First time getting my curls professionally cut. Priya is a curl magician!",
    votes: 52,
    status: "featured",
    category: "Curl Specialist",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const demoClient = {
  id: "demo-client",
  firstName: "Alex",
  lastName: "Thompson",
  email: "alex.thompson@email.com",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  totalBookings: 12,
  memberSince: "2023-03-15",
  loyaltyPoints: 340,
  preferredServices: ["Cut & Style", "Color", "Deep Conditioning"],
  favoriteStylists: ["sarah-demo", "priya-demo"],
  location: "Toronto, ON",
  phone: "+1 (416) 555-0123"
};

export const demoAnalytics = {
  monthlyBookings: 23,
  averageRating: 4.8,
  totalEarnings: 2847,
  topServices: ["Precision Cut", "Color", "Balayage"],
  clientRetention: 87,
  responseTime: "< 5 min",
  badges: ["5-Star Pro", "Quick Responder", "Client Favorite"]
};

// Demo mode state management
export const isDemoMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vely_demo_mode') === 'true' || 
           window.location.search.includes('demo=true');
  }
  return false;
};

export const enableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vely_demo_mode', 'true');
  }
};

export const disableDemoMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vely_demo_mode');
  }
};

// Demo data getters with realistic delays
export const getDemoData = {
  stylists: async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return demoStylists;
  },
  
  bookings: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return demoBookings.filter(b => !userId || b.clientId === userId);
  },
  
  messages: async (bookingId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return demoMessages.filter(m => !bookingId || m.bookingId === bookingId);
  },
  
  notifications: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return demoNotifications;
  },
  
  competitionEntries: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return demoCompetitionEntries;
  },
  
  client: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return demoClient;
  },
  
  analytics: async (stylistId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return demoAnalytics;
  }
};