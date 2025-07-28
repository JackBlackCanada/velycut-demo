import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  humidity: number;
  windSpeed: number;
  recommendation: string;
}

interface WeatherIntegrationProps {
  location?: string;
  onRecommendationChange?: (recommendation: string) => void;
}

export default function WeatherIntegration({ location = "Toronto", onRecommendationChange }: WeatherIntegrationProps) {
  // Mock weather data - in production, use a weather API
  const { data: weather } = useQuery({
    queryKey: ['/api/weather', location],
    queryFn: async () => {
      // Simulate weather API call
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)] as any,
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        recommendation: ''
      };

      // Generate service recommendations based on weather
      if (mockWeather.condition === 'rainy' || mockWeather.humidity > 70) {
        mockWeather.recommendation = "High humidity today! Consider anti-frizz treatments or protective styles.";
      } else if (mockWeather.condition === 'sunny' && mockWeather.temperature > 25) {
        mockWeather.recommendation = "Sunny and warm! Great weather for outdoor photoshoots after your haircut.";
      } else if (mockWeather.condition === 'windy') {
        mockWeather.recommendation = "Windy conditions! Ask your stylist about wind-resistant styles.";
      } else {
        mockWeather.recommendation = "Perfect weather for any hairstyle!";
      }

      return mockWeather;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    if (weather?.recommendation && onRecommendationChange) {
      onRecommendationChange(weather.recommendation);
    }
  }, [weather?.recommendation, onRecommendationChange]);

  if (!weather) {
    return (
      <Card className="ios-card mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-sm">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'windy': return <Wind className="w-5 h-5 text-gray-600" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'bg-yellow-100 text-yellow-800';
      case 'cloudy': return 'bg-gray-100 text-gray-800';
      case 'rainy': return 'bg-blue-100 text-blue-800';
      case 'windy': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="ios-card mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Weather Overview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">{weather.temperature}°C</span>
                  <Badge className={getConditionColor(weather.condition)}>
                    {weather.condition}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Thermometer className="w-3 h-3" />
                <span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Wind className="w-3 h-3" />
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* Weather-based Recommendation */}
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-purple-800">
              <span className="font-medium">💡 Weather Tip: </span>
              {weather.recommendation}
            </p>
          </div>

          {/* Service Suggestions */}
          <div className="flex flex-wrap gap-2">
            {weather.condition === 'rainy' && (
              <>
                <Badge variant="outline" className="text-xs">Anti-frizz treatment</Badge>
                <Badge variant="outline" className="text-xs">Protective styles</Badge>
              </>
            )}
            {weather.condition === 'sunny' && weather.temperature > 25 && (
              <>
                <Badge variant="outline" className="text-xs">UV protection spray</Badge>
                <Badge variant="outline" className="text-xs">Beach waves</Badge>
              </>
            )}
            {weather.condition === 'windy' && (
              <>
                <Badge variant="outline" className="text-xs">Secure updos</Badge>
                <Badge variant="outline" className="text-xs">Braided styles</Badge>
              </>
            )}
            {weather.humidity > 70 && (
              <Badge variant="outline" className="text-xs">Humidity control</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}