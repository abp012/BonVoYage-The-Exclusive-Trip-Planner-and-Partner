import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  MapPin, 
  Compass, 
  Calendar, 
  CreditCard, 
  User, 
  Menu, 
  X,
  Plane,
  Gift,
  ChevronDown,
  Star,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import UserMenu from "./UserMenu";
import CreditDisplay from "./CreditDisplay";
import { cn } from "@/lib/utils";

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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for enhanced appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      title: "Plan",
      items: [
        {
          title: "Trip Planner",
          href: "/planner",
          description: "Create your perfect travel itinerary with AI assistance",
          icon: <MapPin className="h-4 w-4" />
        },
        {
          title: "Destinations", 
          href: "/destinations",
          description: "Explore popular destinations around the world",
          icon: <Compass className="h-4 w-4" />
        }
      ]
    },
    {
      title: "My Travel",
      items: [
        {
          title: "My Trips",
          href: "/my-trips", 
          description: "View and manage your planned trips",
          icon: <Calendar className="h-4 w-4" />
        },
        {
          title: "My Credits",
          href: "/my-credits",
          description: "Manage your trip planning credits",
          icon: <CreditCard className="h-4 w-4" />
        },
        {
          title: "Rewards",
          href: "/rewards",
          description: "Earn points and redeem rewards",
          icon: <Gift className="h-4 w-4" />
        }
      ]
    }
  ];  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Function to get the appropriate back URL based on current page
  const getBackUrl = () => {
    const currentPath = location.pathname;
    
    // Define specific back navigation rules
    const backRoutes: Record<string, string> = {
      '/planner': '/',
      '/destinations': '/',
      '/my-trips': '/',
      '/my-credits': '/',
      '/rewards': '/',
      '/profile': '/',
      '/signin': '/',
      '/signup': '/',
      '/dashboard': '/'
    };

    return backRoutes[currentPath] || '/';
  };

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    const pathMap: Record<string, string> = {
      'planner': 'Trip Planner',
      'destinations': 'Destinations',
      'my-trips': 'My Trips',
      'my-credits': 'My Credits',
      'rewards': 'Rewards',
      'profile': 'Profile',
      'signin': 'Sign In',
      'signup': 'Sign Up'
    };

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, path: currentPath });
    });

    return breadcrumbs;
  };
  const breadcrumbs = getBreadcrumbs();
  return (
    <nav className={`bg-white/95 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg bg-white/98' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Back Button + Brand */}
          <div className="flex items-center space-x-4">
            {/* Back Button - Only show when not on home page */}
            {!isHomePage && (
              <Link 
                to={getBackUrl()} 
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform duration-200" />
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </Link>
            )}
            
            {/* Brand */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 group">
              <div className="relative">
                <Globe className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">BonVoyage</span>
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                  <Star className="w-2 h-2 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">                {navigationItems.map((nav) => (
                  <NavigationMenuItem key={nav.title}>
                    <NavigationMenuTrigger className="h-10 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 group">
                      {nav.title}
                      <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180 group-hover:text-blue-600" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-80 gap-1 p-2">
                        {nav.items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "group grid h-auto w-full items-center justify-start gap-1 rounded-md p-3 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover:shadow-sm",
                                isActivePath(item.href) && "bg-blue-100 text-blue-700 shadow-sm"
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="text-blue-600 group-hover:scale-110 transition-transform duration-200">
                                  {item.icon}
                                </div>
                                <div className="font-medium">{item.title}</div>
                              </div>
                              <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                                {item.description}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Quick Access Links */}
            <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-gray-200">
              <Link to="/planner">
                <Button 
                  variant={isActivePath("/planner") ? "default" : "ghost"} 
                  size="sm" 
                  className={`h-9 transition-all duration-200 ${
                    isActivePath("/planner") 
                      ? "shadow-md" 
                      : "hover:shadow-sm hover:scale-105"
                  }`}
                >
                  <Plane className="h-4 w-4 mr-2" />
                  Plan Trip
                </Button>
              </Link>
              <Link to="/destinations">
                <Button 
                  variant={isActivePath("/destinations") ? "default" : "ghost"} 
                  size="sm"
                  className={`h-9 transition-all duration-200 ${
                    isActivePath("/destinations") 
                      ? "shadow-md" 
                      : "hover:shadow-sm hover:scale-105"
                  }`}
                >
                  <Compass className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </Link>
            </div>          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Additional buttons (like New Trip, etc.) */}
            {additionalButtons}
            
            {/* Back button */}
            {showBackButton && (
              <Link to={backButtonUrl}>
                <Button variant="outline" size="sm">
                  {backButtonText}
                </Button>
              </Link>
            )}

            {/* Desktop Authentication */}
            <div className="hidden md:flex items-center space-x-3">
              {isSignedIn ? (
                <>
                  <CreditDisplay />
                  <UserMenu />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/signin">
                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-4 bg-white/98 backdrop-blur-lg">
            {/* Mobile Navigation Items */}
            <div className="space-y-2">
              {navigationItems.map((nav) => (
                <div key={nav.title} className="space-y-1">
                  <div className="text-sm font-semibold text-gray-900 px-3 py-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span>{nav.title}</span>
                  </div>
                  {nav.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover:shadow-sm mx-2 rounded-lg",
                        isActivePath(item.href) && "bg-blue-100 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="text-blue-600">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile Authentication */}
            <div className="border-t border-gray-200 pt-4 px-3">
              {isSignedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Credits</span>
                    </span>
                    <CreditDisplay />
                  </div>
                  <UserMenu />
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/signin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
