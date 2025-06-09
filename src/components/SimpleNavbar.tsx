import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Crown, MapPin, Calendar, CreditCard, Gift, Compass, DollarSign } from "lucide-react";

interface SimpleNavbarProps {
  title: string;
  backUrl?: string;
  backText?: string;
  icon?: React.ReactNode;
}

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({ 
  title, 
  backUrl = "/", 
  backText = "Back to Home",
  icon
}) => {
  // Get appropriate icon based on page title
  const getPageIcon = () => {
    if (icon) return icon;
    
    const iconMap: Record<string, React.ReactNode> = {
      'Trip Planner': <MapPin className="h-5 w-5 text-white" />,
      'Destinations': <Compass className="h-5 w-5 text-white" />,
      'My Trips': <Calendar className="h-5 w-5 text-white" />,
      'My Credits': <CreditCard className="h-5 w-5 text-white" />,
      'Rewards': <Gift className="h-5 w-5 text-white" />,
      'My Expenses': <DollarSign className="h-5 w-5 text-white" />,
      'Profile': <Globe className="h-5 w-5 text-white" />,
      'BonVoyage Premium': <Crown className="h-5 w-5 text-white" />
    };
    
    return iconMap[title] || <Globe className="h-5 w-5 text-white" />;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                {getPageIcon()}
              </div>
              <span className="text-2xl font-bold text-gray-900">{title}</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={backUrl}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
