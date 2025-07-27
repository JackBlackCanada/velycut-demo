import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBannerProps {
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function NotificationBanner({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  const iconMap = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    error: AlertCircle,
  };

  const colorMap = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  };

  const Icon = iconMap[type];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full mx-4 sm:mx-0 border rounded-lg p-4 shadow-lg smooth-transition ${colorMap[type]}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto ml-2 hover:bg-black/10 dark:hover:bg-white/10"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "info" | "error";
      title: string;
      message: string;
    }>
  >([]);

  const addNotification = (
    type: "success" | "warning" | "info" | "error",
    title: string,
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (title: string, message: string) => addNotification("success", title, message),
    warning: (title: string, message: string) => addNotification("warning", title, message),
    info: (title: string, message: string) => addNotification("info", title, message),
    error: (title: string, message: string) => addNotification("error", title, message),
  };
}

// Notification container component
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationBanner
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}