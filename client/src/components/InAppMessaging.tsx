import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  messageType: 'text' | 'location' | 'arrival' | 'completion';
  read: boolean;
}

interface Conversation {
  bookingId: string;
  clientId: string;
  stylistId: string;
  clientName: string;
  stylistName: string;
  clientAvatar?: string;
  stylistAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  scheduledTime: string;
  serviceAddress: string;
}

interface InAppMessagingProps {
  userType: 'client' | 'stylist';
  userId: string;
  bookingId?: string; // Optional: open specific conversation
}

export default function InAppMessaging({ userType, userId, bookingId }: InAppMessagingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(bookingId || null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations list
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations', userType, userId],
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedConversation],
    enabled: !!selectedConversation,
    refetchInterval: 3000, // More frequent for active conversation
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { bookingId: string; message: string; messageType?: string }) => {
      return apiRequest('POST', '/api/messages', messageData);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', userType, userId] });
      toast({ title: "Message sent successfully" });
    },
    onError: () => {
      toast({ 
        title: "Failed to send message", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  });

  // Send location update for stylists
  const sendLocationMutation = useMutation({
    mutationFn: async (locationData: { bookingId: string; latitude: number; longitude: number; eta: number }) => {
      return apiRequest('POST', '/api/location-update', locationData);
    },
    onSuccess: () => {
      toast({ title: "Location shared with client" });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      bookingId: selectedConversation,
      message: newMessage.trim(),
      messageType: 'text'
    });
  };

  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocationMutation.mutate({
            bookingId: selectedConversation!,
            latitude,
            longitude,
            eta: 15 // Mock 15-minute ETA
          });
        },
        () => {
          toast({ 
            title: "Location access denied", 
            description: "Enable location access to share your position",
            variant: "destructive" 
          });
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (conversationsLoading) {
    return (
      <div className="app-container">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="app-header">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
            <h1 className="text-headline">Messages</h1>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200 overflow-y-auto`}>
            <div className="p-4 space-y-3">
              {(conversations as Conversation[] || []).map((conv) => (
                <Card 
                  key={conv.bookingId}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedConversation === conv.bookingId ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv.bookingId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={userType === 'client' ? conv.stylistAvatar : conv.clientAvatar} />
                        <AvatarFallback>
                          {userType === 'client' 
                            ? conv.stylistName.split(' ').map(n => n[0]).join('')
                            : conv.clientName.split(' ').map(n => n[0]).join('')
                          }
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {userType === 'client' ? conv.stylistName : conv.clientName}
                          </h3>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 truncate mb-1">
                          {conv.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(conv.bookingStatus)}`}>
                            {conv.bookingStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      ← Back
                    </Button>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={userType === 'client' ? 
                        conversations?.find(c => c.bookingId === selectedConversation)?.stylistAvatar :
                        conversations?.find(c => c.bookingId === selectedConversation)?.clientAvatar
                      } />
                      <AvatarFallback>
                        {userType === 'client' ? 'S' : 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {userType === 'client' ? 
                          conversations?.find(c => c.bookingId === selectedConversation)?.stylistName :
                          conversations?.find(c => c.bookingId === selectedConversation)?.clientName
                        }
                      </h3>
                      <p className="text-xs text-gray-600">
                        {conversations?.find(c => c.bookingId === selectedConversation)?.scheduledTime &&
                          `Appointment: ${new Date(conversations.find(c => c.bookingId === selectedConversation)?.scheduledTime!).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {userType === 'stylist' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareLocation}
                        disabled={sendLocationMutation.isPending}
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Share Location
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  (messages as Message[] || []).map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === userId 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.messageType === 'location' ? (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Shared location - ETA 15 min</span>
                          </div>
                        ) : message.messageType === 'arrival' ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">I've arrived at your location</span>
                          </div>
                        ) : message.messageType === 'completion' ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm">Service completed! Please review</span>
                          </div>
                        ) : (
                          <p className="text-sm">{message.message}</p>
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}