import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity, 
  Clock,
  Download,
  Share,
  Star,
  Utensils,
  Camera,
  Plane,
  Hotel,
  Car,
  Cloud,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Droplets,
  PackageCheck,
  Globe
} from "lucide-react";

interface Trip {
  _id: string;
  destination: string;
  days: number;
  startDate?: string;
  endDate?: string;
  people: number;
  budget: number;
  activities: string[];
  travelWith: string;
  creditUsed: number;
  createdAt: number;
  tripDetails?: {
    cityDescription: string;
    topActivities: string[];
    localCuisine: string[];
    packingList: string[];
    weatherInfo: {
      temperature: string;
      condition: string;
      humidity: string;
      windSpeed: string;
      description: string;
    };
    detailedItinerary: Array<{
      day: number;
      title: string;
      morning: string;
      afternoon: string;
      evening: string;
    }>;
    bestTimeToVisit: string;
    travelTips: Array<{
      category: string;
      title: string;
      description: string;
    }>;
  };
}

interface TripDetailsModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ trip, isOpen, onClose }) => {
  if (!trip) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (activity: string) => {
    const activityIcons: { [key: string]: React.ComponentType<any> } = {
      'sightseeing': Camera,
      'adventure': Activity,
      'cultural': Star,
      'food': Utensils,
      'shopping': Star,
      'nightlife': Star,
      'nature': MapPin,
      'beach': Star,
      'museums': Star,
      'photography': Camera,
    };
    
    const IconComponent = activityIcons[activity.toLowerCase()] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };
  const getTravelWithIcon = (travelWith: string) => {
    switch (travelWith.toLowerCase()) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'friends':
        return '👥';
      case 'couple':
        return '💑';
      case 'solo':
        return '🧳';
      default:
        return '👥';
    }
  };// Generate all trip data from stored database information or fallback to generated content
  const cityDescription = trip.tripDetails?.cityDescription || `${trip.destination} is a remarkable destination that offers visitors a unique blend of cultural heritage, natural beauty, and authentic experiences.`;
  const topActivities = trip.tripDetails?.topActivities || [`Explore the historic landmarks of ${trip.destination}`, `Experience local cuisine and markets`, `Visit cultural sites and museums`];
  const localCuisine = trip.tripDetails?.localCuisine || [`Traditional local dishes of ${trip.destination}`, `Fresh local specialties`, `Regional beverages and treats`];
  const packingList = trip.tripDetails?.packingList || ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Travel documents', 'Camera', 'Personal medications'];
  const detailedItinerary = trip.tripDetails?.detailedItinerary || [{
    day: 1,
    title: `Day 1 - Explore ${trip.destination}`,
    morning: `Visit major landmarks and attractions (9:00 AM - 12:00 PM)`,
    afternoon: `Experience local culture and cuisine (1:00 PM - 5:00 PM)`,
    evening: `Enjoy traditional dinner and entertainment (6:00 PM - 9:00 PM)`
  }];
  const weatherInfo = trip.tripDetails?.weatherInfo || {
    temperature: "22°C",
    condition: "Pleasant",
    humidity: "65%",
    windSpeed: "12 km/h",
    description: `${trip.destination} typically enjoys pleasant weather perfect for sightseeing.`
  };
  const bestTimeToVisit = trip.tripDetails?.bestTimeToVisit || `The best time to visit ${trip.destination} is during pleasant weather months when you can fully enjoy outdoor activities and sightseeing.`;
  const travelTips = trip.tripDetails?.travelTips || [
    { category: "General", title: "Local Transportation", description: "Research local transport options before arrival" },
    { category: "Culture", title: "Local Customs", description: "Respect local traditions and customs" },
    { category: "Safety", title: "Stay Connected", description: "Keep emergency contacts readily available" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-3xl">
            <Globe className="h-8 w-8 text-blue-600" />
            <span>Your Trip to {trip.destination}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section with Trip Overview */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Duration</p>
                  <p className="font-semibold">{trip.days} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Travelers</p>
                  <p className="font-semibold">{trip.people} people</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Budget</p>
                  <p className="font-semibold">₹{trip.budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getTravelWithIcon(trip.travelWith)}</span>
                <div>
                  <p className="text-sm opacity-90">Style</p>
                  <p className="font-semibold capitalize">{trip.travelWith}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4 bg-white/20" />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Start Date: {formatDateOnly(trip.startDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">End Date: {formatDateOnly(trip.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Generated: {formatDate(trip.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* About Destination */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-6 w-6 text-blue-600" />
                About {trip.destination}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                {cityDescription}
              </p>
            </CardContent>
          </Card>

          {/* Weather Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Cloud className="h-6 w-6 text-blue-500" />
                Weather Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-semibold">{weatherInfo.temperature}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-semibold">{weatherInfo.condition}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-cyan-50 rounded-lg">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-semibold">{weatherInfo.humidity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Wind className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="font-semibold">{weatherInfo.windSpeed}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{weatherInfo.description}</p>
            </CardContent>
          </Card>

          {/* Top Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-6 w-6 text-purple-600" />
                Top Activities in {trip.destination}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-6 w-6 text-yellow-500" />
                Your Selected Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trip.activities.map((activity, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                    {getActivityIcon(activity)}
                    <span className="capitalize">{activity}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Day-wise Itinerary */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-6 w-6 text-green-600" />
                {trip.days}-Day Detailed Itinerary
              </CardTitle>
              <CardDescription>
                Comprehensive day-by-day planning for your trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {detailedItinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-r-lg">
                    <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {day.day}
                      </span>
                      {day.title}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Morning */}
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Sunrise className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-semibold text-gray-800">Morning</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed flex-1">{day.morning}</p>
                      </div>

                      {/* Afternoon */}
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Sun className="h-5 w-5 text-orange-600" />
                          <h4 className="font-semibold text-gray-800">Afternoon</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed flex-1">{day.afternoon}</p>
                      </div>

                      {/* Evening */}                      {/* Evening Section - Only show if evening activities exist */}
                      {day.evening && (
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Sunset className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-800">Evening</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed flex-1">{day.evening}</p>
                      </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {trip.days > detailedItinerary.length && (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-medium">
                      ... and {trip.days - detailedItinerary.length} more exciting days to explore!
                    </p>
                    <p className="text-sm">Similar amazing experiences await you</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Local Cuisine */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Utensils className="h-6 w-6 text-red-600" />
                Local Cuisine Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {localCuisine.map((dish, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{dish}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Packing Checklist */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PackageCheck className="h-6 w-6 text-teal-600" />
                Packing Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {packingList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      ✓
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Time to Visit */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-6 w-6 text-indigo-600" />
                Best Time to Visit
              </CardTitle>
            </CardHeader>            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {bestTimeToVisit}
              </p>
            </CardContent>
          </Card>

          {/* Quick Travel Tips */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-6 w-6 text-orange-500" />
                Quick Travel Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {travelTips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">{tip.title}</p>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Share className="h-4 w-4" />
              <span>Share Trip</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Plane className="h-4 w-4" />
              <span>Start Planning</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsModal;
