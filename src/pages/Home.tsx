import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Compass, Star, Globe, CloudSun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

    // Handle Start Planning button click with conditional redirection
  const handleStartPlanning = () => {
    if (isSignedIn) {
      navigate('/planner');
    } else {
      navigate('/signin');
    }
  };
  // Handle Explore Top Places button click
  const handleExploreDestinations = () => {
    navigate('/destinations');
  };const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Interactive Maps",
      description: "Explore destinations with Google Maps integration and real-time location data."
    },
    {
      icon: <CloudSun className="h-8 w-8 text-blue-600" />,
      title: "Weather Insights",
      description: "Get 5-day weather forecasts to plan your activities and packing list."
    },
    {
      icon: <Compass className="h-8 w-8 text-blue-600" />,
      title: "Smart Planning",
      description: "AI-powered recommendations based on your preferences and budget."
    },    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Group Travel",
      description: "Perfect for families, couples, friends, or solo adventures."
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: "Curated Experiences",
      description: "Discover hidden gems and popular attractions tailored to your interests."
    }  ];  return (
    <>      {/* Full-Screen Video Background - Fixed to viewport */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
        {/* Fallback background image */}
        {(!videoLoaded || videoError) && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2135&q=80')`
            }}
          />
        )}
          {/* Video element */}
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          webkit-playsinline="true"
          className={`video-background absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
          preload="metadata"          style={{ 
            filter: 'brightness(0.5) contrast(1.15) saturate(1.1)',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          } as React.CSSProperties}
          onLoadedData={(e) => {
            const video = e.target as HTMLVideoElement;
            video.playbackRate = 1.0; // Normal speed for clarity
            setVideoLoaded(true);
            setVideoError(false);
          }}
          onError={() => {
            setVideoError(true);
            setVideoLoaded(false);
          }}
          onCanPlay={() => {
            setVideoLoaded(true);
          }}
          onLoadStart={() => {
            console.log('Video loading started');
          }}
          onLoadedMetadata={() => {
            console.log('Video metadata loaded');
          }}
        >
          <source src="/background_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
          {/* Enhanced Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 pointer-events-none"></div>
        {/* Additional overlay for better text contrast on hero section only */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 min-h-screen">{/* Navigation */}
        <div className="relative z-30 bg-black/20 backdrop-blur-sm">
          <Navbar />
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center z-20">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 bg-white/20 border-white/30 text-white hover:bg-white/30">
                ✨ Exclusive AI-Powered Travel Planning
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-xl">
                Welcome to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  {" "}BonVoyage
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                Your exclusive AI-powered trip planner and travel partner. Experience personalized luxury travel planning with intelligent recommendations, real-time weather insights, and curated premium destinations.
              </p>
            </div>            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-xl backdrop-blur-sm font-semibold"
                onClick={handleStartPlanning}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Start Planning Now
              </Button>              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 border-2 border-white/70 bg-white/10 text-white hover:bg-white/20 hover:border-white shadow-xl backdrop-blur-sm font-semibold transition-all duration-300" 
                onClick={handleExploreDestinations}
              >
                <Globe className="mr-2 h-5 w-5 text-white" />
                <span className="text-white">Explore Top Places</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Perfect Travel
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From planning to execution, we've got every aspect of your journey covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/95 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to your perfect journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Tell Us Your Dreams</h3>
                <p className="text-gray-600">
                  Enter your destination, dates, budget, and preferences. Our AI understands what makes your perfect trip.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Smart Recommendations</h3>
                <p className="text-gray-600">
                  Receive personalized itineraries with weather insights, interactive maps, and budget-friendly options.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Your Journey</h3>
                <p className="text-gray-600">
                  Travel with confidence knowing every detail is planned. Make memories that last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>        {/* Footer */}
        <footer className="bg-gray-900/95 backdrop-blur-sm text-white py-12 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold">BonVoyage : The Trip Planner</span>
                </div>
                <p className="text-gray-400">
                  Making travel planning simple, smart, and spectacular.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/planner" className="hover:text-white">Trip Planner</Link></li>
                  <li><a href="#" className="hover:text-white">Destinations</a></li>
                  <li><a href="#" className="hover:text-white">Weather</a></li>
                  <li><a href="#" className="hover:text-white">Maps</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">API</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 BonVoyage : The Trip Planner. All rights reserved.</p>
            </div>
          </div>        </footer>
      </div>
    </>
  );
};

export default Home;
