import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  Settings, 
  Menu,
  X,
  Sparkles,
  Heart,
  Star
} from 'lucide-react';

interface AnimatedNavMenuProps {
  userType?: 'client' | 'stylist' | null;
  className?: string;
}

export default function AnimatedNavMenu({ userType, className = '' }: AnimatedNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const [activeItem, setActiveItem] = useState('home');

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  const menuItems = userType === 'client' ? [
    { id: 'home', icon: Home, label: 'Home', path: '/client-dashboard', color: 'text-purple-600' },
    { id: 'book', icon: Calendar, label: 'Book Service', path: '/book-service', color: 'text-pink-600' },
    { id: 'search', icon: Search, label: 'Find Stylists', path: '/search-stylists', color: 'text-blue-600' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile', color: 'text-green-600' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-600' },
  ] : userType === 'stylist' ? [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/stylist-dashboard', color: 'text-purple-600' },
    { id: 'earnings', icon: Star, label: 'Earnings', path: '/earnings', color: 'text-yellow-600' },
    { id: 'bookings', icon: Calendar, label: 'Bookings', path: '/bookings', color: 'text-blue-600' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile', color: 'text-green-600' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-600' },
  ] : [
    { id: 'home', icon: Home, label: 'Home', path: '/', color: 'text-purple-600' },
    { id: 'about', icon: Heart, label: 'About', path: '/about', color: 'text-pink-600' },
    { id: 'contact', icon: Sparkles, label: 'Contact', path: '/contact', color: 'text-blue-600' },
  ];

  const handleNavigation = (path: string, id: string) => {
    setActiveItem(id);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className={`animated-nav-menu ${className}`}>
      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`menu-toggle ${isOpen ? 'menu-open' : ''}`}
      >
        <div className="menu-icon-wrapper">
          <Menu className={`menu-icon ${isOpen ? 'rotate-out' : 'rotate-in'}`} />
          <X className={`close-icon ${isOpen ? 'rotate-in' : 'rotate-out'}`} />
        </div>
      </Button>

      {/* Backdrop */}
      <div 
        className={`menu-backdrop ${isOpen ? 'backdrop-open' : 'backdrop-closed'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div className={`menu-panel ${isOpen ? 'panel-open' : 'panel-closed'}`}>
        {/* Menu Header */}
        <div className="menu-header">
          <div className="menu-logo">
            <div className="logo-icon">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <span className="logo-text">VELY</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'item-active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleNavigation(item.path, item.id)}
              >
                <div className="item-content">
                  <div className={`item-icon ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="item-label">{item.label}</span>
                </div>
                <div className="item-ripple" />
              </div>
            );
          })}
        </div>

        {/* Menu Footer */}
        <div className="menu-footer">
          <div className="footer-decoration">
            <div className="decoration-dot dot-1" />
            <div className="decoration-dot dot-2" />
            <div className="decoration-dot dot-3" />
          </div>
        </div>
      </div>
    </div>
  );
}