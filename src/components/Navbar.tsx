import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import UserMenu from "./UserMenu";
import CreditDisplay from "./CreditDisplay";

interface NavbarProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonUrl?: string;
  additionalButtons?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showBackButton = false, 
  backButtonText = "Back to Home",
  backButtonUrl = "/",
  additionalButtons
}) => {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center space-x-2">            <Link to="/" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BonVoyage</span>
              <Badge variant="secondary" className="ml-2">Exclusive</Badge>
            </Link>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Additional buttons (like New Trip, etc.) */}
            {additionalButtons}
            
            {/* Back button */}
            {showBackButton && (
              <Link to={backButtonUrl}>
                <Button variant="outline">
                  {backButtonText}
                </Button>
              </Link>
            )}
              {/* User authentication section */}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <CreditDisplay />
                <UserMenu />
              </div>
            ) : (
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
