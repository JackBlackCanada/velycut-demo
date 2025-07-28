import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  Menu,
  X,
  Home,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface FloatingNavButtonProps {
  showHome?: boolean;
  showBack?: boolean;
  backPath?: string;
  className?: string;
}

export default function FloatingNavButton({ 
  showHome = true, 
  showBack = false, 
  backPath,
  className = '' 
}: FloatingNavButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, navigate] = useLocation();

  const handleHome = () => {
    navigate('/');
    setIsExpanded(false);
  };

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      window.history.back();
    }
    setIsExpanded(false);
  };

  return (
    <div className={`floating-nav-container ${className}`}>
      {/* Background Actions */}
      <div className={`floating-actions ${isExpanded ? 'actions-expanded' : 'actions-collapsed'}`}>
        {showHome && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHome}
            className="floating-action home-action"
          >
            <Home className="w-5 h-5" />
          </Button>
        )}
        
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="floating-action back-action"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Main Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`floating-main-button ${isExpanded ? 'main-expanded' : ''}`}
      >
        <div className="floating-icon-wrapper">
          <Sparkles className={`sparkles-icon ${isExpanded ? 'icon-out' : 'icon-in'}`} />
          <X className={`close-icon ${isExpanded ? 'icon-in' : 'icon-out'}`} />
        </div>
      </Button>
    </div>
  );
}