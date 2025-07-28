import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, X, Check, MapPin, Star, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export default function NotificationCenter() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah M. requested a haircut for tomorrow at 2:00 PM',
      timestamp: '2025-01-28T10:30:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/bookings'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $85 for your service with Maria L.',
      timestamp: '2025-01-28T09:15:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/earnings'
    },
    {
      id: '3',
      type: 'review',
      title: 'New 5-Star Review!',
      message: '"Amazing service! Highly recommend." - Jennifer K.',
      timestamp: '2025-01-28T08:45:00Z',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'message',
      title: 'Client Message',
      message: 'Alex R. sent you a message about their upcoming appointment',
      timestamp: '2025-01-27T16:20:00Z',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'system',
      title: 'VELY Milestone Achieved!',
      message: 'Congratulations! You\'ve completed 100 cuts and earned $100 bonus',
      timestamp: '2025-01-27T14:10:00Z',
      read: false,
      priority: 'high'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['booking', 'payment', 'review', 'message'][Math.floor(Math.random() * 4)] as any,
          title: 'New Activity',
          message: 'You have a new update on your account',
          timestamp: new Date().toISOString(),
          read: false,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'system':
        return <Bell className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-headline font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-caption text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-headline font-medium text-gray-500 mb-2">
                  No notifications
                </h3>
                <p className="text-caption text-gray-400 text-center">
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'shadow-md' : 'opacity-75'
                    } transition-all hover:shadow-lg cursor-pointer`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full ml-2" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Mark read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}