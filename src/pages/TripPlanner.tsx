import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar, Users, DollarSign, Utensils, Activity, Cloud, PackageCheck, ArrowLeft, Globe, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import TripResults from "../components/TripResults";
import UserMenu from "../components/UserMenu";
import CreditDisplay from "../components/CreditDisplay";
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
  const [loadingStep, setLoadingStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state for transition

  // Credit system hooks
  const credits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );
  const deductCredit = useMutation(api.users.deductCredit);
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
    }
  }, [user, createOrGetUser]);

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
    }

    // Check if user has sufficient credits
    if (credits === undefined || credits < 1) {
      toast.error("Insufficient credits! Please purchase more credits to generate a trip plan.");
      return;
    }

    try {
      setIsGeneratingTrip(true);
      setLoadingStep(1);

      // Use the maximum budget value for functions that expect a single number
      const budgetValue = budget[1]; // Use max value from range

      // Step 1: Analyzing Destination
      setLoadingStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Creating Itinerary
      setLoadingStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Finding Activities
      setLoadingStep(3);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 4: Curating Cuisine
      setLoadingStep(4);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 5: Weather Analysis
      setLoadingStep(5);
      
      // Generate comprehensive trip details using AI service
      const tripDetails = await geminiService.generateTripDetails({
        destination,
        days,
        people,
        budget: budgetValue.toString(),
        activities,
        travelWith: "general",
      });

      // Step 6: Finalizing Details
      setLoadingStep(6);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Deduct credit and create trip plan with detailed information
      const result = await deductCredit({
        clerkId: user.id,
        tripPlanData: {
          destination,
          days,
          startDate,
          endDate,
          people,
          budget: budgetValue,
          activities,
          travelWith: "general",
        },
        tripDetails,
      });

      if (result.success) {
        toast.success(`Trip plan generated! You have ${result.remainingCredits} credits remaining 🎉`);

        // Send confirmation email
        try {
          const emailResult = await sendTripEmail({
            to: user.primaryEmailAddress?.emailAddress || "",
            userName: user.fullName || "Traveler",
            tripData: {
              destination,
              days,
              startDate,
              endDate,
              people,
              budget: budgetValue,
              activities,
              travelWith: "general",
            },
            tripDetails
          });

          if (emailResult.success) {
            if ('isDemo' in emailResult && emailResult.isDemo) {
              toast.success("Trip details have been generated! 🎉");
              toast.info("📧 Demo email sent to somejeha4567@gmail.com (sandbox mode)");
            } else {
              toast.success("Trip details have been sent to your email address! 📧");
            }
          } else {
            toast.success("Trip created successfully! 🎉");
            toast.info("Email notification temporarily unavailable.");
          }
        } catch (emailError) {
          // Gracefully handle any email errors
          toast.success("Trip created successfully! 🎉");
          toast.info("Email notification temporarily unavailable.");        }
        
        // Start transition to results
        setIsTransitioning(true);
        setLoadingStep(6); // Keep showing final step
        
        // Delay showing results to ensure smooth transition
        setTimeout(() => {
          setShowResults(true);
          setIsGeneratingTrip(false);
          setIsTransitioning(false);
          setLoadingStep(0);
        }, 1000); // Give time for UI to prepare
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
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Link to="/" className="flex items-center space-x-2">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">JourneyCraft</span>
                </Link>
              </div>              <div className="flex items-center space-x-4">
                <Button onClick={handleNewSearch} variant="outline">
                  <PackageCheck className="mr-2 h-4 w-4" />
                  New Trip
                </Button>
                <Link to="/">
                  <Button variant="ghost">Home</Button>
                </Link>
                {isSignedIn && (
                  <div className="flex items-center space-x-4">
                    <CreditDisplay />
                    <UserMenu />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>        <TripResults 
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
          onReset={handleNewSearch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">JourneyCraft</span>
              </Link>
            </div>            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              {isSignedIn && <UserMenu />}
            </div>
          </div>
        </div>
      </nav>

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
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Coins className="h-4 w-4" />
                    <span>
                      {credits !== undefined ? (
                        credits > 0 ? (
                          `You have ${credits} credit${credits === 1 ? '' : 's'} • 1 credit will be used for this trip`
                        ) : (
                          "No credits remaining • Purchase credits to generate trip plans"
                        )
                      ) : (
                        "Loading credits..."
                      )}
                    </span>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="text-lg px-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={credits === undefined || credits < 1}
                  >
                    <Cloud className="mr-2 h-5 w-5" />
                    Create My Perfect Trip
                    {credits !== undefined && credits < 1 && (
                      <span className="ml-2 text-xs opacity-75">(Need Credits)</span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>          {/* API Key Validator - Commented out for now */}
          {/* <div className="mt-12">
            <APIKeyValidator />
          </div> */}
        </div>
      </div>      {/* Ultimate AI Trip Planner Loading Overlay */}
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
