import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Upload, Heart, Share2, Clock, Crown, Star, Camera, Users, Award, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/logo_1753651837767.png";
import example1 from "@assets/example 1_1753666813525.jpg";
import example3 from "@assets/example 3_1753666813526.jpg";
import example5 from "@assets/example 5_1753666813526.jpg";
import example6 from "@assets/example 6_1753666813527.jpg";
import example7 from "@assets/example 7_1753666813527.jpg";
import example8 from "@assets/example 8_1753666813527.jpg";

export default function Competition() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'gallery' | 'leaderboard' | 'upload' | 'winners'>('gallery');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'trending'>('votes');
  
  // Demo data with real dates - in production, this would come from API
  const [competition] = useState({
    id: '1',
    title: 'July 2025 Cut of the Month',
    description: 'Show off your best haircuts and win amazing prizes!',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: 'active',
    customerPrize: '$100',
    stylistPrize: '$1000',
    daysLeft: Math.ceil((new Date('2025-07-31').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  });

  const [entries, setEntries] = useState([
    {
      id: '1',
      customerName: 'Sarah M.',
      stylistName: 'Maria Rodriguez',
      city: 'Toronto, ON',
      imageUrl: example1,
      voteCount: 342,
      status: 'approved',
      isWinner: false,
      description: 'Stunning blonde undercut with perfect fade!',
      createdAt: '2025-07-14T10:30:00Z' // July 14th
    },
    {
      id: '2',
      customerName: 'Sophia L.',
      stylistName: 'David Wilson',
      city: 'Los Angeles, CA',
      imageUrl: example3,
      voteCount: 298,
      status: 'featured',
      isWinner: false,
      description: 'Beautiful layered bob with highlights',
      createdAt: '2025-07-11T14:20:00Z' // July 11th
    },
    {
      id: '3',
      customerName: 'Liam K.',
      stylistName: 'Jessica Chen',
      city: 'Toronto, ON',
      imageUrl: example5,
      voteCount: 276,
      status: 'approved',
      isWinner: false,
      description: 'Perfect kids undercut with styled top',
      createdAt: '2025-07-17T16:45:00Z' // July 17th
    },
    {
      id: '4',
      customerName: 'Marcus T.',
      stylistName: 'Marcus Johnson',
      city: 'Los Angeles, CA',
      imageUrl: example6,
      voteCount: 189,
      status: 'approved',
      isWinner: false,
      description: 'Fresh kids fade with textured top',
      createdAt: '2025-07-19T11:15:00Z' // July 19th
    },
    {
      id: '5',
      customerName: 'Isabella R.',
      stylistName: 'Amanda Foster',
      city: 'Toronto, ON',
      imageUrl: example7,
      voteCount: 167,
      status: 'approved',
      isWinner: false,
      description: 'Perfect little girl bob cut',
      createdAt: '2025-07-22T09:30:00Z' // July 22nd
    },
    {
      id: '6',
      customerName: 'Zara B.',
      stylistName: 'Carlos Martinez',
      city: 'Los Angeles, CA',
      imageUrl: example8,
      voteCount: 143,
      status: 'approved',
      isWinner: false,
      description: 'Intricate braided updo masterpiece',
      createdAt: '2025-07-24T13:45:00Z' // July 24th
    }
  ]);

  const [votedEntries, setVotedEntries] = useState<Set<string>>(new Set());

  const handleVote = (entryId: string) => {
    if (votedEntries.has(entryId)) {
      toast({
        title: "Already Voted",
        description: "You've already voted for this entry this month.",
        variant: "destructive",
      });
      return;
    }

    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, voteCount: entry.voteCount + 1 }
        : entry
    ));

    setVotedEntries(prev => new Set([...prev, entryId]));
    
    toast({
      title: "Vote Submitted!",
      description: "Thanks for voting! Share to help your favorite win.",
    });
  };

  const handleShare = (entry: any) => {
    const shareText = `Vote for this amazing #VELYcut by ${entry.stylistName}! 💇‍♀️ Your vote could make them a winner! 🚀`;
    const shareUrl = `${window.location.origin}/competition?entry=${entry.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'VELY Cut of the Month',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.voteCount - a.voteCount;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'trending':
        // Mock trending algorithm - could be based on recent vote velocity
        return (b.voteCount * 0.8 + Math.random() * 100) - (a.voteCount * 0.8 + Math.random() * 100);
      default:
        return 0;
    }
  });

  const topEntries = sortedEntries.slice(0, 10);

  return (
    <div className="app-container mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h1 className="text-headline font-bold text-gray-900 dark:text-white">Cut of the Month</h1>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Competition Header */}
        <div className="ios-card mb-6 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="ios-card-content text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
            <h2 className="text-title-large font-bold mb-2">{competition.title}</h2>
            <p className="text-body mb-4 opacity-90">{competition.description}</p>
            
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{competition.customerPrize}</div>
                <div className="text-sm opacity-75">Customer Prize</div>
              </div>
              <div className="w-1 h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{competition.stylistPrize}</div>
                <div className="text-sm opacity-75">Stylist Prize</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{competition.daysLeft} days left</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 py-4 mb-4">
          {[
            { key: 'gallery', label: 'Gallery', icon: Camera },
            { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { key: 'upload', label: 'Submit Entry', icon: Upload },
            { key: 'winners', label: 'Past Winners', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-shrink-0 ${
                  activeTab === tab.key 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <>
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-headline font-bold text-gray-900 dark:text-white">
                {entries.length} Entries This Month
              </h3>
              <div className="flex space-x-2">
                {[
                  { key: 'votes', label: 'Top Voted' },
                  { key: 'newest', label: 'Newest' },
                  { key: 'trending', label: 'Trending' },
                ].map((sort) => (
                  <Button
                    key={sort.key}
                    variant={sortBy === sort.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(sort.key as any)}
                    className={sortBy === sort.key ? 'bg-purple-600 text-white' : ''}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 gap-4">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className={`ios-card ${entry.status === 'featured' ? 'ring-2 ring-yellow-400' : ''}`}>
                  <div className="ios-card-content">
                    {entry.status === 'featured' && (
                      <div className="flex items-center justify-center mb-2">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <div className="relative mb-4">
                      <img
                        src={entry.imageUrl}
                        alt={`Haircut by ${entry.stylistName}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        #VELYcut
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {entry.customerName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Styled by {entry.stylistName} • {entry.city}
                        </p>
                        {entry.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {entry.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-semibold">{entry.voteCount.toLocaleString()}</span>
                          <span className="text-sm text-gray-600">votes</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleVote(entry.id)}
                            disabled={votedEntries.has(entry.id)}
                            className={`${
                              votedEntries.has(entry.id)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                            size="sm"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {votedEntries.has(entry.id) ? 'Voted' : 'Vote'}
                          </Button>
                          
                          <Button
                            onClick={() => handleShare(entry)}
                            variant="outline"
                            size="sm"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <>
            <div className="text-center mb-6">
              <h3 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
                Top {Math.min(entries.length, 10)} Leaderboard
              </h3>
              <p className="text-body text-gray-600 dark:text-gray-300">
                Current standings for {competition.title}
              </p>
            </div>

            <div className="space-y-3">
              {topEntries.map((entry, index) => (
                <div key={entry.id} className={`ios-card ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                  <div className="ios-card-content">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index < 3 ? <Crown className="w-6 h-6" /> : index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {entry.customerName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          by {entry.stylistName} • {entry.city}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg text-purple-600">
                          {entry.voteCount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">votes</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="ios-card">
            <div className="ios-card-content">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
                  Submit Your Entry
                </h3>
                <p className="text-body text-gray-600 dark:text-gray-300">
                  Upload your best haircut photo and compete for amazing prizes!
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">JPEG or PNG, max 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="First name or nickname"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stylist Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your professional name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Toronto, ON or Los Angeles, CA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Tell us about this amazing transformation..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Submission Guidelines:</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Photo must clearly show the haircut/style</li>
                    <li>• Automatic watermark "#VELYcut" will be added</li>
                    <li>• All entries subject to moderation approval</li>
                    <li>• Contest runs monthly, winners announced on the 1st</li>
                  </ul>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Entry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Past Winners Tab */}
        {activeTab === 'winners' && (
          <>
            <div className="text-center mb-6">
              <h3 className="text-title-large font-bold text-gray-900 dark:text-white mb-2">
                Hall of Fame
              </h3>
              <p className="text-body text-gray-600 dark:text-gray-300">
                Celebrating our previous monthly winners
              </p>
            </div>

            <div className="ios-card">
              <div className="ios-card-content text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-headline font-semibold text-gray-900 dark:text-white mb-2">
                  First Competition!
                </h4>
                <p className="text-body text-gray-600 dark:text-gray-300">
                  This is our inaugural Cut of the Month competition. Winners will be announced August 1st!
                </p>
              </div>
            </div>
          </>
        )}

        {/* Floating Share Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => handleShare({ 
              id: 'competition', 
              stylistName: 'VELY Community',
              customerName: 'Amazing Cuts'
            })}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}