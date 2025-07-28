import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function DemoButton() {
  const activateDemo = () => {
    // Add demo=true to URL and reload
    const url = new URL(window.location.href);
    url.searchParams.set('demo', 'true');
    window.location.href = url.toString();
  };

  return (
    <Button
      onClick={activateDemo}
      variant="outline"
      className="border-purple-600 text-purple-600 hover:bg-purple-50"
    >
      <Eye className="w-4 h-4 mr-2" />
      Demo Mode
    </Button>
  );
}