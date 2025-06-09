import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, DollarSign, Utensils, Activity, Cloud, PackageCheck, ArrowLeft, Globe, Coins, Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import TripResults from "../components/TripResults";
import Navbar from "../components/Navbar";
import GooglePlacesSearch from "../components/GooglePlacesSearchFixed";
import UltimateTripPlannerLoading from "../components/UltimateTripPlannerLoading";
import { geminiService, ActivityOption } from "../services/geminiService";
// import APIKeyValidator from "../components/APIKeyValidator";

const TripPlanner = () => {
  const { isSignedIn, user } = useUser();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState([1000, 5000]); // [min, max] budget range
  const [activities, setActivities] = useState<string[]>([]);  const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);  const [showResults, setShowResults] = useState(false);
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);  const [isTransitioning, setIsTransitioning] = useState(false); // New state for transition
  const [generatedTripPlanId, setGeneratedTripPlanId] = useState<string | null>(null); // Store trip plan ID for rewards
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false); // Credit purchase dialog state
  // Credit system hooks
  const credits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );
  const isPremium = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );
  const deductCredit = useMutation(api.users.deductCredit);
  const addCredits = useMutation(api.users.addCredits);
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const sendTripEmail = useAction(api.emails.sendTripConfirmationEmail);

  // Ensure user exists in database
  React.useEffect(() => {
    if (user) {
      createOrGetUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
      }).catch(console.error);
    }  }, [user, createOrGetUser]);

  // Credit purchase function
  const handlePurchaseCredits = async (amount: number, description: string) => {
    if (!user) return;
    
    try {
      await addCredits({
        clerkId: user.id,
        amount,
        description,
      });
      
      toast.success(`Successfully purchased ${amount} credits!`);
      setIsCreditDialogOpen(false);
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to purchase credits. Please try again.");
    }
  };

  // Credit packages
  const creditPackages = [
    { amount: 5, price: "₹249", description: "Perfect for a few trips", popular: false },
    { amount: 15, price: "₹649", description: "Great value for regular travelers", popular: true },
    { amount: 30, price: "₹1,249", description: "Best for frequent trip planners", popular: false },
  ];

  // Function to calculate end date from start date and days
  // Formula: End Date = Start Date + Number of Days - 1
  const calculateEndDate = (start: string, daysCount: number) => {
    if (!start) return '';
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() + daysCount - 1);
    return startDate.toISOString().split('T')[0];
  };
  // Handle start date change
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (date) {
      // Automatically calculate end date: End Date = Start Date + Number of Days - 1
      const calculatedEndDate = calculateEndDate(date, days);
      setEndDate(calculatedEndDate);
    }
  };

  // Handle days change
  const handleDaysChange = (daysCount: number) => {
    setDays(daysCount);
    if (startDate) {
      // Automatically calculate end date: End Date = Start Date + Number of Days - 1
      const calculatedEndDate = calculateEndDate(startDate, daysCount);
      setEndDate(calculatedEndDate);
    }
  };
  // Fallback activity options in case AI generation fails
  const fallbackActivityOptions: ActivityOption[] = [
    { id: 'adventure', label: 'Adventure Sports', icon: '🏔️', description: 'Thrilling outdoor activities and sports' },
    { id: 'culture', label: 'Cultural Sites', icon: '🏛️', description: 'Historical monuments and cultural attractions' },
    { id: 'food', label: 'Food & Dining', icon: '🍜', description: 'Local cuisine and dining experiences' },
    { id: 'nature', label: 'Nature & Wildlife', icon: '🦋', description: 'Natural parks and wildlife experiences' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', description: 'Markets and shopping destinations' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌃', description: 'Entertainment and nightlife scenes' },
    { id: 'relaxation', label: 'Spa & Wellness', icon: '🧘', description: 'Wellness and relaxation activities' },
    { id: 'photography', label: 'Photography', icon: '📸', description: 'Scenic spots and photography opportunities' }
  ];

  // Generate dynamic activity options when destination changes
  useEffect(() => {
    const generateActivities = async () => {
      if (!destination.trim()) {
        setActivityOptions(fallbackActivityOptions);
        return;
      }

      setLoadingActivities(true);
      try {
        const dynamicOptions = await geminiService.generateActivityOptions(destination);
        if (dynamicOptions && dynamicOptions.length > 0) {
          setActivityOptions(dynamicOptions);
        } else {
          setActivityOptions(fallbackActivityOptions);
        }
      } catch (error) {
        console.error('Error generating activity options:', error);
        setActivityOptions(fallbackActivityOptions);
      } finally {
        setLoadingActivities(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const debounceTimer = setTimeout(generateActivities, 500);
    return () => clearTimeout(debounceTimer);
  }, [destination]);

  const handleActivityChange = (activityId: string, checked: boolean) => {
    if (checked) {
      setActivities([...activities, activityId]);
    } else {
      setActivities(activities.filter(id => id !== activityId));
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast.error("Please sign in to generate trip plans");
      return;
    }

    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
      if (activities.length === 0) {
      toast.error("Please select at least one activity");
      return;
    }    // Check if user has sufficient credits (skip for premium users)
    if (!isPremium && (credits === undefined || credits < 1)) {
      toast.error("Insufficient credits! Please purchase more credits to generate a trip plan.");
      return;
    }    try {
      setIsGeneratingTrip(true);
      setLoadingStep(1);

      // Use the maximum budget value for functions that expect a single number
      const budgetValue = budget[1]; // Use max value from range
      
      // Prepare email data
      const emailPreparation = {
        destination,
        days,
        startDate,
        endDate,
        people,
        budget: budgetValue,
        activities,
        travelWith: "general",
      };

      // Progressive AI generation with real-time updates
      const tripDetails = await geminiService.generateTripDetailsProgressive({
        destination,
        days,
        people,
        budget: budgetValue.toString(),
        activities,
        travelWith: "general",
      }, (step: string, data: any) => {
        // Update loading step based on progress
        switch (step) {
          case 'Analyzing destination...':
            setLoadingStep(1);
            break;
          case 'Finding activities...':
            setLoadingStep(2);
            break;
          case 'Creating itinerary...':
            setLoadingStep(3);
            break;
          case 'Gathering practical info...':
            setLoadingStep(4);
            break;
          case 'Finalizing details...':
            setLoadingStep(5);
            break;
          case 'complete':
            setLoadingStep(6);
            break;
          default:
            // Handle partial data updates (could be used for preview)
            if (data) {
              console.log(`Progressive update - ${step}:`, data);
            }
        }
      });      // Deduct credit and create trip plan with detailed information
      const result = await deductCredit({
        clerkId: user.id,
        tripPlanData: emailPreparation,
        tripDetails,
      });

      if (result.success) {
        // Store the trip plan ID for rewards integration
        setGeneratedTripPlanId(result.tripPlanId);
        
        if (result.isPremium) {
          toast.success("Trip plan generated! Premium users get unlimited generations 🎉");
        } else {
          toast.success(`Trip plan generated! You have ${result.remainingCredits} credits remaining 🎉`);
        }

        // Send confirmation email asynchronously (don't wait for it)
        sendTripEmail({
          to: user.primaryEmailAddress?.emailAddress || "",
          userName: user.fullName || "Traveler",
          tripData: emailPreparation,
          tripDetails
        }).then(emailResult => {
          if (emailResult.success) {
            if ('isDemo' in emailResult && emailResult.isDemo) {
              toast.success("📧 Trip details sent to demo email!");
            } else {
              toast.success("📧 Trip details sent to your email!");
            }
          }
        }).catch(() => {
          // Silently handle email errors
          console.log("Email notification temporarily unavailable");
        });
        
        // Show results immediately - no transition delay
        setShowResults(true);
        setIsGeneratingTrip(false);
        setIsTransitioning(false);
        setLoadingStep(0);
      }    } catch (error) {
      console.error("Error generating trip:", error);
      if (error instanceof Error && error.message === "Insufficient credits") {
        toast.error("Insufficient credits! Please purchase more credits to generate a trip plan.");
      } else {
        toast.error("Failed to generate trip plan. Please try again.");
      }
      // Reset all loading states on error
      setIsGeneratingTrip(false);
      setIsTransitioning(false);
      setLoadingStep(0);
    }
  };  const handleNewSearch = () => {
    setShowResults(false);
    setDestination('');
    setDays(7);
    setPeople(2);
    setBudget([1000, 5000]); // Reset to default range
    setActivities([]);
    setActivityOptions(fallbackActivityOptions); // Reset to fallback options
    setIsGeneratingTrip(false);
    setIsTransitioning(false);
    setLoadingStep(0);
    setGeneratedTripPlanId(null); // Reset trip plan ID
  };
  if (showResults) {
    return (      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <Navbar />
        
        <TripResults
          tripData={{
            destination,
            days,
            startDate,
            endDate,
            people,
            budget: { min: budget[0], max: budget[1] },
            activities,
            travelWith: "general"
          }}
          tripPlanId={generatedTripPlanId}
          onReset={handleNewSearch}
        />
      </div>
    );
  }

    return (    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Plan Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Journey
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your dream trip and we'll create a personalized itinerary just for you
            </p>
          </div>

          {/* Trip Planning Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Destination */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                      Where to?
                    </CardTitle>
                    <CardDescription>Choose your dream destination</CardDescription>
                  </CardHeader>                  <CardContent>
                    <GooglePlacesSearch
                      placeholder="e.g., Paris, Tokyo, New York..."
                      value={destination}
                      onSelect={(selectedDestination) => {
                        setDestination(selectedDestination);
                      }}
                      className="text-lg"
                    />
                  </CardContent>
                </Card>

                {/* Duration & People */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      Trip Details
                    </CardTitle>
                    <CardDescription>How long and with how many people?</CardDescription>
                  </CardHeader>                  <CardContent className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <Label htmlFor="startDate" className="text-base font-medium">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="mt-2"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {startDate && endDate && (
                        <p className="text-sm text-gray-600 mt-2">
                          Trip ends on: <span className="font-medium">{new Date(endDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Duration: {days} days</Label>
                      <Slider
                        value={[days]}
                        onValueChange={(value) => handleDaysChange(value[0])}
                        max={30}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1 day</span>
                        <span>30 days</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium">Number of travelers: {people}</Label>
                      <Slider
                        value={[people]}
                        onValueChange={(value) => setPeople(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1 person</span>
                        <span>10+ people</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>                {/* Budget */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                      Budget Range
                    </CardTitle>
                    <CardDescription>Set your minimum and maximum budget</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Label className="text-base font-medium">
                      Budget range: ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                    </Label>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={20000}
                      min={500}
                      step={100}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>₹500</span>
                      <span>₹20,000+</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <span className="text-xs">Minimum:</span>
                        <span className="ml-1 font-medium">₹{budget[0].toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs">Maximum:</span>
                        <span className="ml-1 font-medium">₹{budget[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">                {/* Activities */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <Activity className="mr-2 h-5 w-5 text-blue-600" />
                      Activities
                      {loadingActivities && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    </CardTitle>
                    <CardDescription>
                      {destination 
                        ? `Discover what ${destination} has to offer` 
                        : "What interests you most?"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingActivities ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading activities for {destination}...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activityOptions.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <Checkbox
                              id={activity.id}
                              checked={activities.includes(activity.id)}
                              onCheckedChange={(checked) => 
                                handleActivityChange(activity.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <label 
                              htmlFor={activity.id} 
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{activity.icon}</span>
                                <span className="text-sm font-medium">{activity.label}</span>
                              </div>
                              {activity.description && (
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {activity.description}
                                </p>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              {!isSignedIn ? (
                <div className="space-y-4">
                  <p className="text-gray-600">Sign in to start planning your trip</p>
                  <Link to="/signup">
                    <Button size="lg" className="text-lg px-12 py-3">
                      Sign Up to Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Coins className="h-4 w-4" />
                    <span>
                      {isPremium ? (
                        "Premium Active • Unlimited trip generations"
                      ) : credits !== undefined ? (
                        credits > 0 ? (
                          `You have ${credits} credit${credits === 1 ? '' : 's'} • 1 credit will be used for this trip`
                        ) : (
                          "No credits remaining • Purchase credits to generate trip plans"
                        )
                      ) : (
                        "Loading credits..."
                      )}
                    </span>
                  </div>                  {!isPremium && credits !== undefined && credits < 1 ? (
                    <Button 
                      size="lg" 
                      className="text-lg px-12 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      onClick={() => setIsCreditDialogOpen(true)}
                    >
                      <Coins className="mr-2 h-5 w-5" />
                      Buy Credits to Continue
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="text-lg px-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={!isPremium && credits === undefined}
                    >
                      <Cloud className="mr-2 h-5 w-5" />
                      Create My Perfect Trip
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>          {/* API Key Validator - Commented out for now */}
          {/* <div className="mt-12">
            <APIKeyValidator />
          </div> */}        </div>
      </div>

      {/* Credit Purchase Dialog */}
      <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span>Purchase Credits</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Each credit allows you to generate one complete trip plan. Choose the package that works best for you!
              </p>
            </div>
            
            <div className="grid gap-3">
              {creditPackages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    pkg.popular ? 'ring-2 ring-blue-500 relative' : ''
                  }`}
                  onClick={() => handlePurchaseCredits(pkg.amount, `Purchased ${pkg.amount} credits package`)}
                >
                  {pkg.popular && (
                    <Badge 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{pkg.amount} Credits</CardTitle>
                      <span className="text-xl font-bold text-blue-600">{pkg.price}</span>
                    </div>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Generate {pkg.amount} complete trip plans
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              * This is a demo. No actual payment processing.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ultimate AI Trip Planner Loading Overlay */}
      <UltimateTripPlannerLoading 
        currentStep={loadingStep} 
        isVisible={isGeneratingTrip || isTransitioning}
        destination={destination || "your destination"}
        estimatedTime={60}
      />
    </div>
  );
};

export default TripPlanner;
