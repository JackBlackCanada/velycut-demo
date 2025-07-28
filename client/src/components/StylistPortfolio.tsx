import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Heart, Share2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import example1 from "@assets/example 1_1753666813525.jpg";
import example3 from "@assets/example 3_1753666813526.jpg";
import example5 from "@assets/example 5_1753666813526.jpg";
import example6 from "@assets/example 6_1753666813527.jpg";
import example7 from "@assets/example 7_1753666813527.jpg";
import example8 from "@assets/example 8_1753666813527.jpg";

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  beforeUrl?: string;
  likes: number;
  category: string;
  createdAt: string;
}

interface StylistPortfolioProps {
  stylistId: string;
  stylistName: string;
  onBook?: () => void;
}

export default function StylistPortfolio({ stylistId, stylistName, onBook }: StylistPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Mock portfolio data - in production, this would come from API
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      imageUrl: example1,
      title: 'Blonde Transformation',
      description: 'Full color change with highlights and professional styling',
      beforeUrl: example3,
      likes: 34,
      category: 'Color',
      createdAt: '2025-01-25'
    },
    {
      id: '2',
      imageUrl: example5,
      title: 'Kids Modern Cut',
      description: 'Clean undercut with styled top for young clients',
      likes: 28,
      category: 'Kids',
      createdAt: '2025-01-22'
    },
    {
      id: '3',
      imageUrl: example6,
      title: 'Layered Bob',
      description: 'Classic layered bob with subtle highlights',
      likes: 42,
      category: 'Cuts',
      createdAt: '2025-01-20'
    },
    {
      id: '4',
      imageUrl: example7,
      title: 'Bridal Updo',
      description: 'Elegant updo perfect for wedding day',
      likes: 56,
      category: 'Bridal',
      createdAt: '2025-01-18'
    },
    {
      id: '5',
      imageUrl: example8,
      title: 'Men\'s Fade',
      description: 'Professional fade with beard trim',
      likes: 31,
      category: 'Men',
      createdAt: '2025-01-15'
    }
  ];

  const categories = ['all', 'Color', 'Cuts', 'Bridal', 'Men', 'Kids'];

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleShare = (item: PortfolioItem) => {
    if (navigator.share) {
      navigator.share({
        title: `${item.title} by ${stylistName}`,
        text: `Check out this amazing work by ${stylistName}! ${item.description}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="text-center">
        <h2 className="text-title-large mb-2">Portfolio</h2>
        <p className="text-body text-gray-600">Recent work by {stylistName}</p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 ${
              selectedCategory === category 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 border-gray-300'
            }`}
          >
            {category === 'all' ? 'All Work' : category}
          </Button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImage(item)}
          >
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(item);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                >
                  <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'text-red-500 fill-red-500' : ''}`} />
                </Button>
              </div>

              {/* Category Badge */}
              <Badge className="absolute top-2 left-2 bg-black/70 text-white border-none">
                {item.category}
              </Badge>
            </div>

            <CardContent className="p-3">
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Heart className={`w-3 h-3 ${likedItems.has(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  <span className="text-xs text-gray-600">
                    {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Book Now Button */}
      {onBook && (
        <div className="text-center pt-4">
          <Button onClick={onBook} className="btn-primary px-8">
            Book with {stylistName}
          </Button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </Button>

            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Before/After indicator */}
                {selectedImage.beforeUrl && (
                  <Badge className="absolute bottom-2 left-2 bg-purple-600 text-white">
                    After
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{selectedImage.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedImage.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(selectedImage.id)}
                      className="flex items-center space-x-1"
                    >
                      <Heart className={`w-4 h-4 ${likedItems.has(selectedImage.id) ? 'text-red-500 fill-red-500' : ''}`} />
                      <span>{selectedImage.likes + (likedItems.has(selectedImage.id) ? 1 : 0)}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(selectedImage)}
                      className="flex items-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                  
                  {onBook && (
                    <Button onClick={onBook} size="sm" className="btn-primary">
                      Book Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No portfolio items found for this category.</p>
        </div>
      )}
    </div>
  );
}