import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Eye, Calendar, Users, DollarSign, Coins, Globe } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import TripDetailsModal from "../components/TripDetailsModal";
import { Link } from "react-router-dom";

const MyTrips: React.FC = () => {
  const { user } = useUser();
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
    // Get user trip history
  const tripHistory = useQuery(
    api.users.getUserTripHistory,
    user ? { clerkId: user.id } : "skip"
  );

  // Get user credits for quick actions
  const userCredits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTripClick = (trip: any) => {
    setSelectedTrip(trip);
    setIsTripModalOpen(true);
  };

  const closeTripModal = () => {
    setSelectedTrip(null);
    setIsTripModalOpen(false);
  };  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your trips</h1>
            <Link to="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Trip Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tripHistory?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Trip plans created
              </p>
            </CardContent>
          </Card>          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destinations Visited</CardTitle>
              <Globe className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tripHistory ? new Set(tripHistory.map(trip => trip.destination)).size : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique destinations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days Planned</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {tripHistory?.reduce((total, trip) => total + trip.days, 0) ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Days of adventures
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Recent Trips</span>
            </CardTitle>            <CardDescription>
              Your recently generated trip plans - click to view full details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tripHistory && tripHistory.length > 0 ? (
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <div 
                    key={trip._id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleTripClick(trip)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {trip.destination}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{trip.days} days</Badge>
                        <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>👥 {trip.people} people • 💰 ₹{trip.budget.toLocaleString()}</p>
                      <p>🏷️ {trip.activities.join(', ')}</p>
                      <p>📅 {formatDate(trip.createdAt)}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {trip.travelWith}
                        </Badge>
                        {trip.startDate && (
                          <Badge variant="outline" className="text-xs">
                            {new Date(trip.startDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTripClick(trip);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                <p className="mb-6">Start planning your first adventure!</p>
                <Link to="/planner">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Plan Your First Trip</span>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4">
            {/* Plan New Trip and Manage Credits buttons hidden as requested */}
            {/* <Link to="/planner">
              <Button className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Plan New Trip</span>
              </Button>
            </Link>            <Link to="/my-credits">
              <Button variant="outline" className="flex items-center space-x-2">
                <Coins className="h-4 w-4" />
                <span>Manage Credits ({userCredits ?? 0})</span>
              </Button>
            </Link> */}
          </div>
        </div>
      </div>

      {/* Trip Details Modal */}
      <TripDetailsModal 
        trip={selectedTrip}
        isOpen={isTripModalOpen}
        onClose={closeTripModal}
      />
    </div>
  );
};

export default MyTrips;
