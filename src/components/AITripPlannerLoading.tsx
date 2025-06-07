import React from 'react';
import { Card } from './ui/card';
import { Sparkles, MapPin, Calendar, Users, Activity, Utensils, Cloud, PackageCheck, CheckCircle2 } from 'lucide-react';

interface AITripPlannerLoadingProps {
  currentStep: number;
  isVisible: boolean;
}

const loadingSteps = [
  {
    id: 1,
    icon: MapPin,
    title: "Analyzing Destination",
    description: "Researching your chosen destination and gathering local insights",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: 2,
    icon: Calendar,
    title: "Creating Itinerary",
    description: "Crafting a personalized day-by-day travel plan",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: 3,
    icon: Activity,
    title: "Finding Activities",
    description: "Discovering exciting activities and attractions",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    id: 4,
    icon: Utensils,
    title: "Curating Cuisine",
    description: "Selecting the best local food experiences",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: 5,
    icon: Cloud,
    title: "Weather Analysis",
    description: "Checking weather patterns and packing recommendations",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  {
    id: 6,
    icon: PackageCheck,
    title: "Finalizing Details",
    description: "Putting together your complete travel guide",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  }
];

const AITripPlannerLoading: React.FC<AITripPlannerLoadingProps> = ({ currentStep, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              AI is Crafting Your Perfect Trip
            </h2>
            <p className="text-gray-600 text-lg">
              Our AI is working hard to create a personalized itinerary just for you
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            {loadingSteps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isPending = currentStep < step.id;

              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-center p-4 rounded-lg border transition-all duration-500 ${
                    isCompleted
                      ? `${step.bgColor} ${step.borderColor} border-l-4`
                      : isActive
                      ? `${step.bgColor} ${step.borderColor} border-l-4 shadow-md`
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 mr-4 relative`}>
                    {isCompleted ? (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? step.bgColor : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
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
                      <div className="absolute -inset-1 rounded-full border-2 border-blue-300 animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-1 ${
                        isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isCompleted || isActive ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {isActive && (
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((currentStep / loadingSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / loadingSteps.length) * 100}%` }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              This usually takes 30-60 seconds. Please don't close this window.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AITripPlannerLoading;
