import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Coins, Calendar, MapPin, Edit } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useUser();
  
  // Get user's current credits
  const credits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );
  
  // Get user's trip history for statistics
  const tripHistory = useQuery(
    api.users.getUserTripHistory,
    user ? { clerkId: user.id } : "skip"
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayName = (firstName?: string | null, lastName?: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "User";
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
            <Link to="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // Calculate profile statistics
  const totalTrips = tripHistory?.length ?? 0;
  const uniqueDestinations = tripHistory ? new Set(tripHistory.map(trip => trip.destination)).size : 0;
  const memberSince = user.createdAt ? formatDate(user.createdAt.getTime()) : "Recently";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and travel preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={getDisplayName(user.firstName, user.lastName)}
                        className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-100">
                        <span className="text-2xl font-bold text-white">
                          {getInitials(user.firstName, user.lastName)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {getDisplayName(user.firstName, user.lastName)}
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                    <Badge variant="secondary" className="text-sm">
                      Member since {memberSince}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {getDisplayName(user.firstName, user.lastName)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {user.primaryEmailAddress?.emailAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Credits</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Coins className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-900 font-semibold">
                          {credits ?? 0} Credits
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <div className="mt-1">
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Travel Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Travel Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalTrips}</div>
                  <p className="text-sm text-gray-600">Total Trips Planned</p>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{uniqueDestinations}</div>
                  <p className="text-sm text-gray-600">Destinations Explored</p>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{credits ?? 0}</div>
                  <p className="text-sm text-gray-600">Available Credits</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/planner" className="block">
                  <Button className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Plan New Trip
                  </Button>
                </Link>
                <Link to="/my-trips" className="block">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    View My Trips
                  </Button>
                </Link>
                <Link to="/my-credits" className="block">
                  <Button variant="outline" className="w-full">
                    <Coins className="h-4 w-4 mr-2" />
                    Manage Credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
