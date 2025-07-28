import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, TrendingUp, Calendar, Award, Trophy, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";

interface VELYCountProps {
  stylistId: string;
  currentCount: number;
  monthlyCount: number;
  isOwnProfile?: boolean;
}

interface Milestone {
  count: number;
  title: string;
  badge: string;
  icon: any;
  color: string;
  reward?: string;
}

export default function VELYCount({ stylistId, currentCount, monthlyCount, isOwnProfile = false }: VELYCountProps) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showMilestone, setShowMilestone] = useState<Milestone | null>(null);

  // Milestone definitions
  const milestones: Milestone[] = [
    { count: 10, title: "Rising Star", badge: "VELY Rookie", icon: Star, color: "bg-blue-500", reward: "$10 bonus" },
    { count: 25, title: "Steady Hands", badge: "Growing Pro", icon: Scissors, color: "bg-green-500", reward: "$25 bonus" },
    { count: 50, title: "Skilled Artisan", badge: "Established", icon: Award, color: "bg-purple-500", reward: "$50 bonus" },
    { count: 100, title: "Master Stylist", badge: "Expert", icon: Trophy, color: "bg-yellow-500", reward: "$100 bonus" },
    { count: 250, title: "VELY Legend", badge: "Elite", icon: Crown, color: "bg-red-500", reward: "$250 bonus" },
    { count: 500, title: "Hall of Fame", badge: "Legendary", icon: Crown, color: "bg-gradient-to-r from-purple-500 to-pink-500", reward: "$500 bonus + Feature Spotlight" },
    { count: 1000, title: "VELY Icon", badge: "Iconic", icon: Crown, color: "bg-gradient-to-r from-yellow-400 to-orange-500", reward: "$1000 bonus + Annual Recognition" }
  ];

  // Calculate next milestone
  const nextMilestone = milestones.find(m => m.count > currentCount);
  const currentMilestone = milestones.filter(m => m.count <= currentCount).pop();
  const progressToNext = nextMilestone ? (currentCount / nextMilestone.count) * 100 : 100;

  // Animate count on load
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = currentCount / 30;
      const animate = () => {
        start += increment;
        if (start < currentCount) {
          setAnimatedCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setAnimatedCount(currentCount);
        }
      };
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentCount]);

  // Check for milestone achievements
  useEffect(() => {
    const recentMilestone = milestones.find(m => m.count === currentCount);
    if (recentMilestone && isOwnProfile) {
      setShowMilestone(recentMilestone);
      setTimeout(() => setShowMilestone(null), 5000);
    }
  }, [currentCount, isOwnProfile]);

  const getRankDisplay = () => {
    if (currentCount >= 1000) return { rank: "Iconic", color: "text-orange-600", bg: "bg-gradient-to-r from-yellow-100 to-orange-100" };
    if (currentCount >= 500) return { rank: "Legendary", color: "text-purple-600", bg: "bg-gradient-to-r from-purple-100 to-pink-100" };
    if (currentCount >= 250) return { rank: "Elite", color: "text-red-600", bg: "bg-red-100" };
    if (currentCount >= 100) return { rank: "Expert", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (currentCount >= 50) return { rank: "Established", color: "text-purple-600", bg: "bg-purple-100" };
    if (currentCount >= 25) return { rank: "Growing Pro", color: "text-green-600", bg: "bg-green-100" };
    if (currentCount >= 10) return { rank: "VELY Rookie", color: "text-blue-600", bg: "bg-blue-100" };
    return { rank: "New Stylist", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const rankInfo = getRankDisplay();

  return (
    <div className="space-y-6">
      {/* Main VELY Count Display */}
      <Card className="ios-card overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center">
            {/* VELY Count Badge */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Scissors className="w-10 h-10" />
              </div>
              <Badge className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${rankInfo.bg} ${rankInfo.color} border-2 border-white`}>
                {rankInfo.rank}
              </Badge>
            </div>

            {/* Count Display */}
            <div className="mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-900 mb-2"
              >
                {animatedCount.toLocaleString()}
              </motion.div>
              <p className="text-title-large font-semibold text-purple-600 mb-1">VELY Count</p>
              <p className="text-caption text-gray-600">Total cuts completed on VELY</p>
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{monthlyCount}</div>
                <div className="text-caption text-gray-600">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentCount > 0 ? Math.round((monthlyCount / 30) * 10) / 10 : 0}
                </div>
                <div className="text-caption text-gray-600">Daily Average</div>
              </div>
            </div>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Next: {nextMilestone.title}</span>
                  <span className="font-semibold">{currentCount}/{nextMilestone.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {nextMilestone.count - currentCount} more cuts to unlock "{nextMilestone.title}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements & Milestones */}
      <Card className="ios-card">
        <CardContent className="p-6">
          <h3 className="text-headline font-bold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements
          </h3>
          
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const isUnlocked = currentCount >= milestone.count;
              const isCurrent = currentMilestone?.count === milestone.count;
              const IconComponent = milestone.icon;
              
              return (
                <div
                  key={milestone.count}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isUnlocked 
                      ? isCurrent 
                        ? 'bg-purple-50 border-2 border-purple-200' 
                        : 'bg-gray-50' 
                      : 'bg-gray-25 opacity-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isUnlocked ? milestone.color : 'bg-gray-300'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${isUnlocked ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                        {milestone.title}
                      </h4>
                      <Badge 
                        className={`text-xs ${
                          isUnlocked 
                            ? isCurrent 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {milestone.count} cuts
                      </Badge>
                    </div>
                    <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {milestone.badge}
                      {milestone.reward && isUnlocked && (
                        <span className="text-green-600 font-medium"> • {milestone.reward}</span>
                      )}
                    </p>
                  </div>
                  
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Unlocked
                      </Badge>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {isOwnProfile && (
        <Card className="ios-card">
          <CardContent className="p-6">
            <h3 className="text-headline font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Your VELY Journey
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-body">Average cuts per month</span>
                <span className="font-semibold">{Math.round(currentCount / Math.max(1, Math.ceil(currentCount / 30)))}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-body">Platform rank</span>
                <Badge className={`${rankInfo.bg} ${rankInfo.color}`}>
                  {rankInfo.rank}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-body">Achievements earned</span>
                <span className="font-semibold">
                  {milestones.filter(m => m.count <= currentCount).length}/{milestones.length}
                </span>
              </div>
              
              {nextMilestone && (
                <div className="flex items-center justify-between">
                  <span className="text-body">Next milestone</span>
                  <span className="font-semibold text-purple-600">{nextMilestone.title}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-purple-700">
                {currentCount < 25 
                  ? "Complete 5+ cuts this week to boost your visibility and earn your first milestone!"
                  : currentCount < 100
                  ? "Maintain consistent bookings to reach Expert status and unlock premium features!"
                  : "You're doing amazing! Share your success story to inspire other stylists."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Celebration Modal */}
      {showMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="mb-4"
              >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
              </motion.div>
              
              <h2 className="text-title-large font-bold mb-2">Milestone Achieved!</h2>
              <h3 className="text-headline text-purple-600 mb-2">{showMilestone.title}</h3>
              <p className="text-body text-gray-600 mb-4">
                You've completed {showMilestone.count} cuts on VELY!
              </p>
              
              {showMilestone.reward && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-green-800">
                    🎉 Reward: {showMilestone.reward}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={() => setShowMilestone(null)}
                className="btn-primary w-full"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}