import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Heart, Star, Clock, TrendingUp, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface StyleRecommendation {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  popularityScore: number;
  matchScore: number;
  tags: string[];
  imageUrl: string;
  price: string;
  trendingRank?: number;
}

interface AIStyleRecommendationsProps {
  userId?: string;
  hairType?: string;
  faceShape?: string;
  lifestyle?: string;
  budget?: string;
}

export default function AIStyleRecommendations({ 
  userId, 
  hairType = "wavy", 
  faceShape = "oval", 
  lifestyle = "professional", 
  budget = "mid" 
}: AIStyleRecommendationsProps) {
  const [likedStyles, setLikedStyles] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('trending');

  // AI-powered style recommendations based on user profile
  const { data: recommendations } = useQuery({
    queryKey: ['/api/ai-recommendations', userId, hairType, faceShape, lifestyle, budget],
    queryFn: async () => {
      // Simulate AI recommendation API - in production, connect to ML service
      const mockRecommendations: StyleRecommendation[] = [
        {
          id: 'trend-1',
          name: 'Curtain Bangs Bob',
          description: 'Trendy layered bob with face-framing curtain bangs. Perfect for professional settings with a modern twist.',
          difficulty: 'medium',
          estimatedTime: '90 min',
          popularityScore: 95,
          matchScore: 92,
          tags: ['trending', 'professional', 'low-maintenance', 'face-framing'],
          imageUrl: '/api/placeholder/300/300',
          price: '$85-120',
          trendingRank: 1
        },
        {
          id: 'classic-1',
          name: 'Textured Lob',
          description: 'Long bob with subtle layers and texture. Versatile style that works for both casual and formal occasions.',
          difficulty: 'easy',
          estimatedTime: '75 min',
          popularityScore: 88,
          matchScore: 89,
          tags: ['classic', 'versatile', 'easy-styling', 'professional'],
          imageUrl: '/api/placeholder/300/300',
          price: '$70-95'
        },
        {
          id: 'trend-2',
          name: 'Wolf Cut',
          description: 'Edgy layered cut with shag-inspired elements. Great for adding volume and movement to fine hair.',
          difficulty: 'hard',
          estimatedTime: '120 min',
          popularityScore: 82,
          matchScore: 76,
          tags: ['trending', 'edgy', 'high-maintenance', 'volume'],
          imageUrl: '/api/placeholder/300/300',
          price: '$95-140',
          trendingRank: 3
        },
        {
          id: 'seasonal-1',
          name: 'Butterfly Layers',
          description: 'Soft, flowing layers that create beautiful movement. Perfect for the current season and your face shape.',
          difficulty: 'medium',
          estimatedTime: '85 min',
          popularityScore: 79,
          matchScore: 94,
          tags: ['seasonal', 'soft', 'movement', 'face-flattering'],
          imageUrl: '/api/placeholder/300/300',
          price: '$80-110'
        }
      ];

      // Sort based on category
      if (selectedCategory === 'trending') {
        return mockRecommendations.sort((a, b) => (b.trendingRank || 99) - (a.trendingRank || 99));
      } else if (selectedCategory === 'matched') {
        return mockRecommendations.sort((a, b) => b.matchScore - a.matchScore);
      } else {
        return mockRecommendations.sort((a, b) => b.popularityScore - a.popularityScore);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const toggleLike = (styleId: string) => {
    setLikedStyles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(styleId)) {
        newSet.delete(styleId);
      } else {
        newSet.add(styleId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!recommendations) {
    return (
      <Card className="ios-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-sm">AI analyzing your style preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="ios-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            AI Style Recommendations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Personalized suggestions based on your hair type, face shape, and lifestyle
          </p>
        </CardHeader>
      </Card>

      {/* Category Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'matched', label: 'Perfect Match', icon: Sparkles },
          { id: 'popular', label: 'Most Popular', icon: Star }
        ].map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center space-x-1 whitespace-nowrap"
          >
            <category.icon className="w-3 h-3" />
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {recommendations.map((style, index) => (
          <Card key={style.id} className="ios-card">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                {/* Style Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  {style.trendingRank && style.trendingRank <= 3 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                      #{style.trendingRank}
                    </Badge>
                  )}
                </div>

                {/* Style Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-base leading-tight">{style.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {style.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(style.id)}
                      className="flex-shrink-0 ml-2"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          likedStyles.has(style.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  </div>

                  {/* Style Metrics */}
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={getDifficultyColor(style.difficulty)}>
                      {style.difficulty}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {style.estimatedTime}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {style.matchScore}% match
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {style.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {style.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{style.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-600">{style.price}</span>
                    <Button size="sm" className="btn-primary">
                      Book This Style
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-medium text-purple-900 mb-1">💡 AI Insights</h4>
            <p className="text-sm text-purple-800">
              Based on your {faceShape} face shape and {hairType} hair type, 
              styles with layers and movement will enhance your natural features. 
              The {recommendations[0]?.name} has a {recommendations[0]?.matchScore}% compatibility score.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}