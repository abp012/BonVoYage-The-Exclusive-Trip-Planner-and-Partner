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
  Wand2,
  Clock,
  Target,
  Coffee,
  Mountain,
  Plane,
  Shield
} from 'lucide-react';

interface UltimateTripPlannerLoadingProps {
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
    description: "Researching your destination and gathering local insights",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    gradient: "from-blue-500 to-blue-700",
    tips: [
      "🗺️ Exploring local attractions and hidden gems",
      "🏛️ Analyzing cultural highlights and traditions",
      "🌟 Finding the best time to visit",
      "📍 Understanding local customs and etiquette"
    ]
  },
  {
    id: 2,
    icon: Activity,
    title: "Finding Activities",
    description: "Discovering exciting activities and attractions tailored to you",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    gradient: "from-green-500 to-green-700",
    tips: [
      "🎯 Matching activities to your interests",
      "👨‍👩‍👧‍👦 Finding experiences for your group size",
      "🏔️ Discovering adventure opportunities",
      "🎨 Exploring cultural experiences"
    ]
  },
  {
    id: 3,
    icon: Calendar,
    title: "Creating Itinerary",
    description: "Crafting a personalized day-by-day travel plan",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    gradient: "from-purple-500 to-purple-700",
    tips: [
      "⏰ Optimizing travel routes and timing",
      "⚖️ Balancing activities with relaxation",
      "🎉 Considering local events and festivals",
      "📅 Creating flexible daily schedules"
    ]
  },
  {
    id: 4,
    icon: Utensils,
    title: "Gathering Practical Info",
    description: "Collecting essential travel information and local tips",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradient: "from-red-500 to-red-700",
    tips: [
      "🍽️ Finding authentic local restaurants",
      "🚗 Researching transportation options",
      "💰 Creating budget breakdowns",
      "🎒 Preparing packing recommendations"
    ]
  },
  {    id: 5,
    icon: Brain,
    title: "AI Processing",
    description: "Advanced AI analyzing and optimizing your travel plan",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    gradient: "from-orange-500 to-orange-700",
    tips: [
      "🤖 AI is connecting all the pieces",
      "⚡ Processing thousands of possibilities",
      "🎯 Optimizing for your preferences",
      "📊 Analyzing travel patterns and trends"
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
      "📋 Compiling all recommendations",
      "💡 Adding travel tips and insights",
      "📖 Creating your personalized guide",
      "✨ Adding finishing touches"
    ]
  }
];

const motivationalMessages = [
  "✨ Creating magic just for you...",
  "🌍 Exploring the world to find the best experiences...",
  "🎯 Personalizing every detail to match your style...",
  "🚀 Progressive AI working step by step...",
  "💫 Building your perfect trip piece by piece...",
  "🧠 AI is analyzing thousands of possibilities...",
  "🎨 Crafting a masterpiece of travel experiences...",
  "⚡ Smart algorithms optimizing your journey...",
  "🔮 Each step brings you closer to adventure...",
  "🎭 Curating experiences tailored just for you..."
];

const backgroundParticles = [
  { icon: Globe, color: "text-blue-400" },
  { icon: Heart, color: "text-red-400" },
  { icon: Star, color: "text-yellow-400" },
  { icon: Camera, color: "text-green-400" },
  { icon: Coffee, color: "text-amber-400" },
  { icon: Mountain, color: "text-gray-400" },
  { icon: Plane, color: "text-indigo-400" }
];

const UltimateTripPlannerLoading: React.FC<UltimateTripPlannerLoadingProps> = ({ 
  currentStep, 
  isVisible, 
  destination = "your destination",
  estimatedTime = 60 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number, 
    x: number, 
    y: number, 
    delay: number,
    icon: React.ElementType,
    color: string,
    size: number,
    speed: number
  }>>([]);

  // Generate enhanced floating particles for background animation
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => {
      const particle = backgroundParticles[i % backgroundParticles.length];
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        icon: particle.icon,
        color: particle.color,
        size: Math.random() * 20 + 15,
        speed: Math.random() * 10 + 20
      };
    });
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
      }, 2500);
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
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentStepData = currentStep > 0 && currentStep <= loadingSteps.length 
    ? loadingSteps[currentStep - 1] 
    : null;

  const progressPercentage = Math.round((currentStep / loadingSteps.length) * 100);
  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      {/* Enhanced floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => {
          const ParticleIcon = particle.icon;
          return (
            <div
              key={particle.id}
              className="absolute opacity-20 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.speed}s`,
                fontSize: `${particle.size}px`
              }}
            >
              <ParticleIcon className={`${particle.color} animate-bounce`} />
            </div>
          );
        })}
      </div>

      <Card className="w-full max-w-5xl mx-auto bg-white/98 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
        {/* Enhanced animated header with gradient */}
        <div className={`relative p-8 bg-gradient-to-r ${currentStepData?.gradient || 'from-blue-500 via-purple-600 to-indigo-600'} text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
                  <Brain className="h-12 w-12 text-white animate-pulse" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-yellow-800 animate-spin" />
                </div>
                <div className="absolute -inset-3 rounded-full border-2 border-white/40 animate-ping"></div>
                <div className="absolute -inset-6 rounded-full border border-white/20 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              AI Crafting Your Perfect Trip
            </h1>
            <p className="text-2xl opacity-95 mb-3 font-medium">
              Designing an amazing journey to <span className="font-bold bg-white/20 px-3 py-1 rounded-full">{destination}</span>
            </p>
            <p className="text-lg opacity-80 animate-pulse">
              {motivationalMessages[currentMessage]}
            </p>
            
            {/* Enhanced progress indicator */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
                <span className="text-lg font-semibold">Step {currentStep} of {loadingSteps.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Enhanced current step highlight */}
          {currentStepData && (
            <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${currentStepData.gradient} text-white shadow-xl transform hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <currentStepData.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{currentStepData.title}</h3>
                    <p className="opacity-90 text-lg">{currentStepData.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm opacity-75">Processing...</span>
                </div>
              </div>
              
              {/* Enhanced dynamic tips */}
              <div className="bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Wand2 className="h-5 w-5 animate-pulse" />
                  <span className="opacity-90 font-medium">AI is currently:</span>
                </div>
                <p className="text-lg font-semibold leading-relaxed">
                  {currentStepData.tips[currentTipIndex]}
                </p>
                <div className="mt-3 flex space-x-1">
                  {currentStepData.tips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTipIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Progress Bar */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${currentStepData?.gradient || 'from-blue-500 to-purple-600'} rounded-full transition-all duration-1000 ease-out relative`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-3 h-full bg-white/60 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 text-center">
                {Math.max(0, currentStep - 1)} of {loadingSteps.length} steps completed
              </div>
            </div>

            {/* Time Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Time Tracking</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Elapsed</span>
                  <span className="font-bold text-gray-800">
                    {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Est. Remaining</span>
                  <span className="font-bold text-gray-800">
                    {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Status */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <Shield className="h-6 w-6 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">AI Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700">Active</span>
                </div>
                <div className="text-xs text-gray-600">
                  Processing {loadingSteps.length * 3}+ data points
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {loadingSteps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`relative p-5 rounded-xl border transition-all duration-700 transform ${
                    isCompleted
                      ? `${step.bgColor} ${step.borderColor} border-l-4 scale-100 shadow-lg opacity-100`
                      : isActive
                      ? `${step.bgColor} ${step.borderColor} border-l-4 shadow-xl scale-105 ring-2 ring-blue-200`
                      : 'bg-gray-50 border-gray-200 scale-95 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 relative">
                      {isCompleted ? (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive ? `${step.bgColor} shadow-lg ring-2 ring-blue-300` : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 transition-all duration-300 ${
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
                        <>
                          <div className="absolute -inset-2 rounded-full border-2 border-blue-300 animate-ping"></div>
                          <div className="absolute -inset-1 rounded-full border border-blue-400 animate-pulse"></div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-sm mb-2 ${
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

                  {/* Enhanced active indicator */}
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}

                  {/* Completion indicator */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced Bottom Info */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 text-center shadow-lg border border-blue-100">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-blue-600 animate-pulse" />
              <Star className="h-6 w-6 text-yellow-500 animate-bounce" />
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              <Globe className="h-6 w-6 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Travel Intelligence at Work
            </h3>
            <p className="text-lg font-medium text-gray-800 mb-3">
              Analyzing thousands of travel options to create your perfect itinerary
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Real-time processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Expert insights</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Please keep this window open while we work our magic. This usually takes 30-90 seconds.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UltimateTripPlannerLoading;
