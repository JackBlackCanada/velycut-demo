import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Star } from "lucide-react";

interface LanguageSkill {
  language: string;
  fluency: 'basic' | 'conversational' | 'fluent' | 'native';
}

interface LanguageSkillsProps {
  motherTongue?: string;
  languages?: LanguageSkill[];
  showTitle?: boolean;
  compact?: boolean;
}

export default function LanguageSkills({ 
  motherTongue, 
  languages = [], 
  showTitle = true, 
  compact = false 
}: LanguageSkillsProps) {
  const getLanguageDisplay = (langCode: string) => {
    const languageMap: { [key: string]: string } = {
      'english': 'English',
      'french': 'French',
      'spanish': 'Spanish',
      'mandarin': 'Mandarin',
      'cantonese': 'Cantonese',
      'punjabi': 'Punjabi',
      'arabic': 'Arabic',
      'tagalog': 'Tagalog',
      'italian': 'Italian',
      'german': 'German',
      'portuguese': 'Portuguese',
      'polish': 'Polish',
      'russian': 'Russian',
      'korean': 'Korean',
      'japanese': 'Japanese',
      'vietnamese': 'Vietnamese',
      'hindi': 'Hindi',
      'urdu': 'Urdu',
      'farsi': 'Farsi/Persian',
      'other': 'Other'
    };
    return languageMap[langCode] || langCode;
  };

  const getFluencyColor = (fluency: string) => {
    switch (fluency) {
      case 'native':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fluent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'conversational':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'basic':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFluencyIcon = (fluency: string) => {
    switch (fluency) {
      case 'native':
        return <Star className="w-3 h-3 fill-current" />;
      case 'fluent':
        return <Star className="w-3 h-3" />;
      case 'conversational':
        return <Globe className="w-3 h-3" />;
      case 'basic':
        return <Globe className="w-3 h-3 opacity-60" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  if (!motherTongue && languages.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {motherTongue && (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {getLanguageDisplay(motherTongue)}
          </Badge>
        )}
        {languages.map((lang, index) => (
          <Badge 
            key={index} 
            className={`text-xs ${getFluencyColor(lang.fluency)}`}
          >
            {getFluencyIcon(lang.fluency)}
            <span className="ml-1">{getLanguageDisplay(lang.language)}</span>
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Card className="ios-card">
      <CardContent className="p-4">
        {showTitle && (
          <div className="flex items-center mb-3">
            <Globe className="w-4 h-4 text-purple-600 mr-2" />
            <h3 className="font-medium text-gray-800">Language Skills</h3>
          </div>
        )}
        
        <div className="space-y-3">
          {motherTongue && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Mother Tongue</p>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {getLanguageDisplay(motherTongue)}
              </Badge>
            </div>
          )}
          
          {languages.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Additional Languages</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <Badge 
                    key={index} 
                    className={`${getFluencyColor(lang.fluency)}`}
                  >
                    {getFluencyIcon(lang.fluency)}
                    <span className="ml-1">{getLanguageDisplay(lang.language)}</span>
                    <span className="ml-1 text-xs opacity-75">
                      ({lang.fluency})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {(motherTongue || languages.length > 0) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Can communicate with clients in {(motherTongue ? 1 : 0) + languages.length} language{(motherTongue ? 1 : 0) + languages.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}