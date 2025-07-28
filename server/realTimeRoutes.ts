import type { Express } from "express";
import { WebSocketServer } from 'ws';
import type { Server } from "http";

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  messageType: 'text' | 'location' | 'arrival' | 'completion';
  read: boolean;
}

interface LocationUpdate {
  bookingId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  eta: number;
  status: 'on_way' | 'arrived' | 'in_service' | 'completed';
}

// In-memory storage for demo
const messages: Message[] = [];
const conversations: any[] = [
  {
    bookingId: 'booking_1',
    clientId: 'client_1',
    stylistId: 'stylist_1',
    clientName: 'Sarah Johnson',
    stylistName: 'Maria Rodriguez',
    clientAvatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100',
    stylistAvatar: 'https://images.unsplash.com/photo-1594824363779-c1c13e7e87f5?w=100',
    lastMessage: 'I\'ll be there in 15 minutes!',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    bookingStatus: 'confirmed',
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    serviceAddress: '123 Main St, Toronto, ON'
  },
  {
    bookingId: 'booking_2',
    clientId: 'client_2',
    stylistId: 'stylist_1',
    clientName: 'Jennifer Lee',
    stylistName: 'Maria Rodriguez',
    clientAvatar: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=100',
    stylistAvatar: 'https://images.unsplash.com/photo-1594824363779-c1c13e7e87f5?w=100',
    lastMessage: 'Thank you for the amazing service!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    bookingStatus: 'completed',
    scheduledTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    serviceAddress: '456 Oak Ave, Toronto, ON'
  }
];

const locationUpdates: { [bookingId: string]: LocationUpdate } = {};
const availableServices = [
  {
    id: 'haircut',
    name: 'Professional Haircut',
    duration: 45,
    price: 65,
    description: 'Precision cut with wash and style'
  },
  {
    id: 'color',
    name: 'Hair Coloring',
    duration: 120,
    price: 150,
    description: 'Full color treatment with professional products'
  },
  {
    id: 'highlights',
    name: 'Highlights',
    duration: 90,
    price: 120,
    description: 'Partial or full highlights'
  },
  {
    id: 'blowdry',
    name: 'Wash & Blow Dry',
    duration: 30,
    price: 35,
    description: 'Professional wash and styling'
  },
  {
    id: 'treatment',
    name: 'Hair Treatment',
    duration: 60,
    price: 85,
    description: 'Deep conditioning and repair treatment'
  }
];

export function setupRealTimeRoutes(app: Express, httpServer: Server) {
  // WebSocket setup for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Conversations API
  app.get('/api/conversations/:userType/:userId', (req, res) => {
    try {
      const { userType, userId } = req.params;
      
      // Filter conversations for the user
      const userConversations = conversations.filter(conv => 
        userType === 'client' ? conv.clientId === userId : conv.stylistId === userId
      );
      
      res.json(userConversations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  // Messages API
  app.get('/api/messages/:bookingId', (req, res) => {
    try {
      const { bookingId } = req.params;
      
      const bookingMessages = messages.filter(msg => msg.bookingId === bookingId);
      
      // Add some mock messages for demo
      if (bookingMessages.length === 0 && bookingId === 'booking_1') {
        const mockMessages = [
          {
            id: 'msg_1',
            bookingId,
            senderId: 'stylist_1',
            senderName: 'Maria Rodriguez',
            message: 'Hi! I\'m confirmed for your appointment today. Looking forward to it!',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            messageType: 'text' as const,
            read: true
          },
          {
            id: 'msg_2',
            bookingId,
            senderId: 'client_1',
            senderName: 'Sarah Johnson',
            message: 'Great! I\'m excited. Do you need me to prepare anything?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            messageType: 'text' as const,
            read: true
          },
          {
            id: 'msg_3',
            bookingId,
            senderId: 'stylist_1',
            senderName: 'Maria Rodriguez',
            message: 'Just have clean, dry hair. I\'ll bring everything else!',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            messageType: 'text' as const,
            read: true
          },
          {
            id: 'msg_4',
            bookingId,
            senderId: 'stylist_1',
            senderName: 'Maria Rodriguez',
            message: 'I\'m on my way! ETA 15 minutes.',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            messageType: 'location' as const,
            read: false
          }
        ];
        
        messages.push(...mockMessages);
        res.json(mockMessages);
      } else {
        res.json(bookingMessages);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Send message API
  app.post('/api/messages', (req, res) => {
    try {
      const { bookingId, message, messageType = 'text' } = req.body;
      
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        bookingId,
        senderId: 'demo_user', // In production, get from auth
        senderName: 'Demo User',
        message,
        timestamp: new Date().toISOString(),
        messageType,
        read: false
      };
      
      messages.push(newMessage);
      
      // Broadcast via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'new_message',
            data: newMessage
          }));
        }
      });
      
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Location tracking API
  app.get('/api/tracking/:bookingId', (req, res) => {
    try {
      const { bookingId } = req.params;
      
      // Return mock location data or stored location
      const location = locationUpdates[bookingId] || {
        latitude: 43.6532,
        longitude: -79.3832,
        timestamp: new Date().toISOString(),
        eta: 12,
        status: 'on_way' as const
      };
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get location' });
    }
  });

  // Update location API
  app.post('/api/booking/:bookingId/location', (req, res) => {
    try {
      const { bookingId } = req.params;
      const { latitude, longitude, status } = req.body;
      
      const locationUpdate: LocationUpdate = {
        bookingId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        eta: Math.floor(Math.random() * 20) + 5, // Mock ETA
        status
      };
      
      locationUpdates[bookingId] = locationUpdate;
      
      // Broadcast location update via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'location_update',
            data: locationUpdate
          }));
        }
      });
      
      res.json(locationUpdate);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update location' });
    }
  });

  // Enhanced booking APIs
  app.get('/api/stylist/:stylistId/services', (req, res) => {
    try {
      res.json(availableServices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  app.get('/api/stylist/:stylistId/availability/:date', (req, res) => {
    try {
      const { date } = req.params;
      
      // Generate mock time slots with dynamic pricing
      const timeSlots = [
        { time: '09:00', available: true, price: 0.9 }, // 10% discount for early
        { time: '10:00', available: true, price: 1.0 },
        { time: '11:00', available: false, price: 1.0 },
        { time: '12:00', available: true, price: 1.2 }, // 20% premium for lunch
        { time: '13:00', available: true, price: 1.2 },
        { time: '14:00', available: true, price: 1.0 },
        { time: '15:00', available: true, price: 1.0 },
        { time: '16:00', available: true, price: 1.1 }, // 10% premium for peak
        { time: '17:00', available: true, price: 1.1 },
        { time: '18:00', available: false, price: 1.1 },
        { time: '19:00', available: true, price: 1.3 }, // 30% premium for evening
        { time: '20:00', available: true, price: 1.3 }
      ];
      
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch availability' });
    }
  });

  // Booking creation API
  app.post('/api/bookings', (req, res) => {
    try {
      const bookingData = req.body;
      
      const newBooking = {
        id: `booking_${Date.now()}`,
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Create initial conversation
      const newConversation = {
        bookingId: newBooking.id,
        clientId: 'demo_client',
        stylistId: bookingData.stylistId,
        clientName: 'Demo Client',
        stylistName: 'Demo Stylist',
        lastMessage: 'Booking created - stylist will confirm shortly',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        bookingStatus: 'pending',
        scheduledTime: `${bookingData.scheduledDate}T${bookingData.scheduledTime}`,
        serviceAddress: bookingData.address
      };
      
      conversations.push(newConversation);
      
      // Broadcast new booking via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'new_booking',
            data: newBooking
          }));
        }
      });
      
      res.json(newBooking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  // Booking details API
  app.get('/api/booking/:bookingId', (req, res) => {
    try {
      const { bookingId } = req.params;
      
      // Mock booking details
      const booking = {
        id: bookingId,
        clientName: 'Sarah Johnson',
        stylistName: 'Maria Rodriguez',
        clientAvatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100',
        stylistAvatar: 'https://images.unsplash.com/photo-1594824363779-c1c13e7e87f5?w=100',
        serviceAddress: '123 Main St, Toronto, ON M5V 2T6',
        scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        services: ['Professional Haircut', 'Wash & Blow Dry'],
        totalAmount: 100,
        status: 'confirmed',
        estimatedDuration: 75
      };
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch booking details' });
    }
  });

  return wss;
}