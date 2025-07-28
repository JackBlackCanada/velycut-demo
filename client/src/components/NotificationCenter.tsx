import { useState, useEffect } from "react";
import { Bell, Check, X, Calendar, DollarSign, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationCenter() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your appointment with Sarah Johnson is confirmed for tomorrow at 2:00 PM',
      timestamp: '2025-01-28T14:30:00Z',
      isRead: false,
      actionUrl: '/bookings',
      priority: 'high'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Processed',
      message: 'Payment of $42 has been successfully processed',
      timestamp: '2025-01-28T13:15:00Z',
      isRead: false,
      actionUrl: '/bookings',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review',
      message: 'Marcus left you a 5-star review! "Amazing work, very professional"',
      timestamp: '2025-01-28T11:45:00Z',
      isRead: true,
      actionUrl: '/reviews',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Priya sent you a message about your upcoming appointment',
      timestamp: '2025-01-28T10:30:00Z',
      isRead: false,
      actionUrl: '/messages',
      priority: 'high'
    },
    {
      id: '5',
      type: 'promotion',
      title: 'Competition Ending Soon!',
      message: 'Cut of the Month competition ends in 4 days. Submit your entry now!',
      timestamp: '2025-01-28T09:00:00Z',
      isRead: true,
      actionUrl: '/competition',
      priority: 'low'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'message': return <MessageCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-purple-500';
    switch (type) {
      case 'booking': return 'text-blue-500';
      case 'payment': return 'text-green-500';
      case 'review': return 'text-yellow-500';
      case 'message': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'booking',
          title: 'New Booking Request',
          message: 'You have a new booking request from a client',
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/bookings',
          priority: 'high'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${getIconColor(notification.type, notification.priority)}`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium text-sm ${
                            !notification.isRead 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-4 w-4 opacity-50 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-purple-600 hover:text-purple-700"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}