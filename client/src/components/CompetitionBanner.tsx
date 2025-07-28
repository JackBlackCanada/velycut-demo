import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, X, Heart, Upload } from 'lucide-react';
import { useLocation } from 'wouter';

interface CompetitionBannerProps {
  className?: string;
}

export default function CompetitionBanner({ className = '' }: CompetitionBannerProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white mb-6 rounded-xl shadow-lg ${className}`}>
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg"></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <h3 className="text-lg font-bold">Cut of the Month Contest</h3>
            </div>
            
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              Win $100 for customers & $1000 for stylists! Show off your best haircuts and let the community vote.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => navigate('/competition')}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                variant="outline"
              >
                <Heart className="w-4 h-4 mr-2" />
                Vote Now
              </Button>
              
              <Button
                onClick={() => navigate('/competition?tab=upload')}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Contest stats */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl font-bold">$1,100</div>
              <div className="text-xs text-white/70">Total Prizes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">342</div>
              <div className="text-xs text-white/70">Entries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs text-white/70">Days Left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}