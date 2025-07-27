import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserTypeModalProps {
  open: boolean;
  onClose: () => void;
  onClientSelect: () => void;
  onStylistSelect: () => void;
}

export default function UserTypeModal({ open, onClose, onClientSelect, onStylistSelect }: UserTypeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-2">Join VELY</DialogTitle>
          <p className="text-center text-gray-600">Choose how you'd like to get started</p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button
            onClick={onClientSelect}
            className="w-full p-6 h-auto text-left border-2 border-gray-200 bg-white text-gray-900 hover:border-primary hover:bg-primary hover:text-white transition-colors group"
            variant="outline"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary group-hover:bg-white rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-user text-white group-hover:text-primary text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg">I need hair services</h4>
                <p className="text-gray-600 group-hover:text-pink-100">Book professional stylists</p>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={onStylistSelect}
            className="w-full p-6 h-auto text-left border-2 border-gray-200 bg-white text-gray-900 hover:border-secondary hover:bg-secondary hover:text-white transition-colors group"
            variant="outline"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary group-hover:bg-white rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-cut text-white group-hover:text-secondary text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg">I'm a hair professional</h4>
                <p className="text-gray-600 group-hover:text-pink-100">Start earning with VELY</p>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}