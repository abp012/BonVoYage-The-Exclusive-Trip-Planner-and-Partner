
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Calendar, Users, DollarSign, Utensils, Activity, Cloud, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import TripResults from "../components/TripResults";
// import APIKeyValidator from "../components/APIKeyValidator";

const Index = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState([2000]);
  const [activities, setActivities] = useState<string[]>([]);
  const [travelWith, setTravelWith] = useState('');
  const [showResults, setShowResults] = useState(false);

  const activityOptions = [
    { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
    { id: 'culture', label: 'Cultural Sites', icon: '🏛️' },
    { id: 'food', label: 'Food & Dining', icon: '🍜' },
    { id: 'nature', label: 'Nature & Wildlife', icon: '🦋' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
    { id: 'relaxation', label: 'Spa & Wellness', icon: '🧘' },
    { id: 'photography', label: 'Photography', icon: '📸' }
  ];

  const travelCompanions = [
    { id: 'family', label: 'Family with Kids' },
    { id: 'couple', label: 'Romantic Couple' },
    { id: 'friends', label: 'Friends Group' },
    { id: 'solo', label: 'Solo Travel' },
    { id: 'business', label: 'Business Travel' }
  ];

  const handleActivityToggle = (activityId: string) => {
    setActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    console.log('Trip planning data:', {
      destination,
      days,
      people,
      budget: budget[0],
      activities,
      travelWith
    });

    toast.success("Creating your perfect trip plan...");
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setDestination('');
    setDays(7);
    setPeople(2);
    setBudget([2000]);
    setActivities([]);
    setTravelWith('');
  };

  if (showResults) {
    return (
      <TripResults 
        tripData={{
          destination,
          days,
          people,
          budget: budget[0],
          activities,
          travelWith
        }}
        onReset={resetForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in">
              Discover amazing destinations, create personalized itineraries, and make unforgettable memories
            </p>
          </div>
        </div>
      </div>

      {/* API Key Validator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <APIKeyValidator /> */}
      </div>

      {/* Planning Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Let's Plan Your Adventure
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tell us about your dream trip and we'll create the perfect itinerary
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination */}
              <div className="space-y-3">
                <Label htmlFor="destination" className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Where would you like to go? (e.g., Tokyo, Paris, Bali)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-lg py-3 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Days and People */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Number of Days: {days}
                  </Label>
                  <Slider
                    value={[days]}
                    onValueChange={(value) => setDays(value[0])}
                    max={30}
                    min={1}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Number of People: {people}
                  </Label>
                  <Slider
                    value={[people]}
                    onValueChange={(value) => setPeople(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 person</span>
                    <span>20 people</span>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  Total Budget: ${budget[0].toLocaleString()}
                </Label>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  max={20000}
                  min={500}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$500</span>
                  <span>$20,000+</span>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Preferred Activities (Optional)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {activityOptions.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity.id}
                        checked={activities.includes(activity.id)}
                        onCheckedChange={() => handleActivityToggle(activity.id)}
                      />
                      <Label
                        htmlFor={activity.id}
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <span>{activity.icon}</span>
                        {activity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Companions */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-600" />
                  Who are you traveling with? (Optional)
                </Label>
                <RadioGroup value={travelWith} onValueChange={setTravelWith}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {travelCompanions.map((companion) => (
                      <div key={companion.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={companion.id} id={companion.id} />
                        <Label htmlFor={companion.id} className="cursor-pointer">
                          {companion.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit"
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Create My Trip Plan ✈️
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
