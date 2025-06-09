import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Coins, Calendar, MapPin, Crown, Clock, Shield } from "lucide-react";
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

  // Get premium subscription status
  const isPremium = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );

  // Get user subscription details
  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
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

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return "Expired";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    } else {
      return "Less than 1 hour remaining";
    }
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
  return (    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">

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
                      <div className="flex items-center space-x-2 mt-1">
                        {isPremium ? (
                          <>
                            <Crown className="h-4 w-4 text-yellow-600" />
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                              Premium
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 text-green-600" />
                            <Badge variant="default" className="bg-green-600">
                              Active
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Subscription Status */}
                {isPremium && subscription && (
                  <>
                    <Separator />
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-yellow-800">Premium Subscription</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-yellow-700">Plan</label>
                          <p className="text-yellow-900 font-semibold">{subscription.plan?.name || 'Premium'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-yellow-700">Status</label>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-900 font-semibold">
                              {subscription.endDate ? formatTimeRemaining(subscription.endDate) : 'Active'}
                            </span>
                          </div>
                        </div>
                        {subscription.endDate && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-yellow-700">Expires On</label>
                            <p className="text-yellow-900">{formatDate(subscription.endDate)}</p>
                          </div>
                        )}
                      </div>                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>{/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Premium Status Card */}
            {isPremium && subscription ? (
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-yellow-800">
                    <Crown className="h-5 w-5" />
                    <span>Premium Member</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-700">
                      {subscription.endDate ? formatTimeRemaining(subscription.endDate) : 'Active'}
                    </div>
                    <p className="text-sm text-yellow-600">Until Renewal</p>
                  </div>
                  {subscription.endDate && (
                    <>
                      <Separator className="bg-yellow-200" />
                      <div className="text-center">
                        <p className="text-sm text-yellow-700">
                          Renews on {formatDate(subscription.endDate)}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Crown className="h-5 w-5" />
                    <span>Upgrade to Premium</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 mb-3">
                    Unlock unlimited trip planning and exclusive features!
                  </p>
                  <Link to="/premium" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Upgrade Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

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
            </Card>            {/* Quick Actions - Hidden as requested */}
            {/* 
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
                </Link>                <Link to="/my-credits" className="block">
                  <Button variant="outline" className="w-full">
                    <Coins className="h-4 w-4 mr-2" />
                    Manage Credits
                  </Button>                </Link>
              </CardContent>
            </Card>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
