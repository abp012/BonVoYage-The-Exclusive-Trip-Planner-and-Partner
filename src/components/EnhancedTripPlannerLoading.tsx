import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Activity, 
  Utensils, 
  Cloud, 
  PackageCheck, 
  CheckCircle2,
  Globe,
  Camera,
  Heart,
  Star,
  Zap,
  Brain,
  Wand2
} from 'lucide-react';

interface EnhancedTripPlannerLoadingProps {
  currentStep: number;
  isVisible: boolean;
  destination?: string;
  estimatedTime?: number;
}

const loadingSteps = [
  {
    id: 1,
    icon: MapPin,
    title: "Analyzing Destination",
    description: "Researching your chosen destination and gathering local insights",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    gradient: "from-blue-500 to-blue-700",
    tips: [
      "Exploring local attractions and hidden gems",
      "Analyzing cultural highlights and traditions",
      "Researching transportation options"
    ]
  },
  {
    id: 2,
    icon: Calendar,
    title: "Creating Itinerary",
    description: "Crafting a personalized day-by-day travel plan",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    gradient: "from-purple-500 to-purple-700",
    tips: [
      "Optimizing travel routes and timing",
      "Balancing activities with relaxation",
      "Considering local events and festivals"
    ]
  },
  {
    id: 3,
    icon: Activity,
    title: "Finding Activities",
    description: "Discovering exciting activities and attractions",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    gradient: "from-green-500 to-green-700",
    tips: [
      "Matching activities to your interests",
      "Finding family-friendly options",
      "Discovering adventure opportunities"
    ]
  },
  {
    id: 4,
    icon: Utensils,
    title: "Curating Cuisine",
    description: "Selecting the best local food experiences",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradient: "from-red-500 to-red-700",
    tips: [
      "Finding authentic local restaurants",
      "Discovering street food gems",
      "Considering dietary preferences"
    ]
  },
  {
    id: 5,
    icon: Cloud,
    title: "Weather Analysis",
    description: "Checking weather patterns and packing recommendations",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    gradient: "from-cyan-500 to-cyan-700",
    tips: [
      "Analyzing seasonal weather patterns",
      "Creating smart packing lists",
      "Planning weather-appropriate activities"
    ]
  },
  {
    id: 6,
    icon: PackageCheck,
    title: "Finalizing Details",
    description: "Putting together your complete travel guide",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    gradient: "from-indigo-500 to-indigo-700",
    tips: [
      "Compiling all recommendations",
      "Adding travel tips and insights",
      "Creating your personalized guide"
    ]
  }
];

const motivationalMessages = [
  "✨ Creating magic just for you...",
  "🌍 Exploring the world to find the best experiences...",
  "🎯 Personalizing every detail to match your style...",
  "🚀 Almost ready to launch your adventure...",
  "💫 Adding the finishing touches to your perfect trip..."
];

const EnhancedTripPlannerLoading: React.FC<EnhancedTripPlannerLoadingProps> = ({ 
  currentStep, 
  isVisible, 
  destination = "your destination",
  estimatedTime = 60 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  // Generate floating particles for background animation
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Cycle through tips for current step
  useEffect(() => {
    if (currentStep > 0 && currentStep <= loadingSteps.length) {
      const currentStepData = loadingSteps[currentStep - 1];
      const interval = setInterval(() => {
        setCurrentTipIndex(prev => 
          (prev + 1) % currentStepData.tips.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Track elapsed time
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Cycle through motivational messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % motivationalMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentStepData = currentStep > 0 && currentStep <= loadingSteps.length 
    ? loadingSteps[currentStep - 1] 
    : null;

  const progressPercentage = Math.round((currentStep / loadingSteps.length) * 100);
  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
        {/* Animated header with gradient */}
        <div className={`relative p-8 bg-gradient-to-r ${currentStepData?.gradient || 'from-blue-500 to-purple-600'} text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Brain className="h-10 w-10 text-white animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-800 animate-spin" />
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-white/30 animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2 animate-pulse">
              AI Crafting Your Perfect Trip
            </h1>
            <p className="text-xl opacity-90 mb-2">
              Designing an amazing journey to <span className="font-semibold">{destination}</span>
            </p>
            <p className="text-lg opacity-75">
              {motivationalMessages[currentMessage]}
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Current step highlight */}
          {currentStepData && (
            <div className={`mb-8 p-6 rounded-xl bg-gradient-to-r ${currentStepData.gradient} text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <currentStepData.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentStepData.title}</h3>
                    <p className="opacity-90">{currentStepData.description}</p>
                  </div>
                </div>
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              {/* Dynamic tips */}
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-sm">
                  <Wand2 className="h-4 w-4" />
                  <span className="opacity-90">Currently:</span>
                </div>
                <p className="mt-1 font-medium">
                  {currentStepData.tips[currentTipIndex]}
                </p>
              </div>
            </div>
          )}

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Bar */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-800">Overall Progress</span>
                <span className="text-lg font-bold text-gray-800">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${currentStepData?.gradient || 'from-blue-500 to-purple-600'} rounded-full transition-all duration-1000 ease-out relative`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-2 h-full bg-white/50 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Time and Stats */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Elapsed Time</span>
                <span className="font-semibold text-gray-800">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Est. Remaining</span>
                <span className="font-semibold text-gray-800">
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Steps Complete</span>
                <span className="font-semibold text-gray-800">
                  {Math.max(0, currentStep - 1)}/{loadingSteps.length}
                </span>
              </div>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {loadingSteps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-xl border transition-all duration-700 transform ${
                    isCompleted
                      ? `${step.bgColor} ${step.borderColor} border-l-4 scale-100 shadow-md`
                      : isActive
                      ? `${step.bgColor} ${step.borderColor} border-l-4 shadow-lg scale-105`
                      : 'bg-gray-50 border-gray-200 scale-95 opacity-70'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 relative">
                      {isCompleted ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? `${step.bgColor} shadow-lg` : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isActive
                                ? `${step.color} animate-pulse`
                                : isPending
                                ? 'text-gray-400'
                                : step.color
                            }`}
                          />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute -inset-1 rounded-full border-2 border-blue-300 animate-ping"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm mb-1 ${
                          isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`text-xs leading-relaxed ${
                          isCompleted || isActive ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
            <div className="flex justify-center items-center space-x-2 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <Star className="h-5 w-5 text-yellow-500" />
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">
              AI is analyzing thousands of travel options to create your perfect itinerary
            </p>
            <p className="text-sm text-gray-600">
              Please keep this window open while we work our magic. This usually takes 30-90 seconds.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedTripPlannerLoading;
