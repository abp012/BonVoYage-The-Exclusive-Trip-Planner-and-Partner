import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Star, 
  TrendingUp,
  Heart,
  Activity,
  Settings,
  Download,
  Share
} from 'lucide-react';
import { format } from 'date-fns';

interface UserDashboardProps {
  className?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ className }) => {
  const { user: clerkUser } = useUser();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Convex queries
  const userProfile = useQuery(api.users.getUserProfile, 
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const userStats = useQuery(api.users.getUserStats, 
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const tripHistory = useQuery(api.users.getUserTripHistory, 
    clerkUser ? { clerkId: clerkUser.id, limit: 10 } : "skip"
  );
  const creditTransactions = useQuery(api.users.getCreditTransactions, 
    clerkUser ? { clerkId: clerkUser.id, limit: 10 } : "skip"
  );
  const userActivity = useQuery(api.users.getUserActivity, 
    clerkUser ? { clerkId: clerkUser.id, limit: 20 } : "skip"
  );
  const savedDestinations = useQuery(api.users.getSavedDestinations, 
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  // Mutations
  const updateTrip = useMutation(api.users.updateTrip);
  const logActivity = useMutation(api.users.logActivity);

  const handleToggleFavorite = async (tripId: string, currentStatus: boolean) => {
    if (!clerkUser) return;
    
    try {
      await updateTrip({
        clerkId: clerkUser.id,
        tripId: tripId as any,
        updates: { isFavorite: !currentStatus }
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleDownloadItinerary = async (tripId: string, destination: string) => {
    if (!clerkUser) return;
    
    try {
      await logActivity({
        clerkId: clerkUser.id,
        activityType: "itinerary_downloaded",
        metadata: {
          tripId: tripId as any,
          destination
        }
      });
      // TODO: Implement actual download functionality
      console.log('Download itinerary for trip:', tripId);
    } catch (error) {
      console.error('Error logging download activity:', error);
    }
  };

  if (!clerkUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please sign in to view your dashboard</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name || 'User'} />
              <AvatarFallback>
                {(userProfile.firstName?.[0] || '') + (userProfile.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Welcome!'}
              </h1>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {userStats && format(new Date(userStats.memberSince), 'MMM yyyy')}
                </span>
                <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Last active {userStats && format(new Date(userStats.lastActive), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalTrips}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.favoriteTrips} favorites
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.credits}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.totalCreditsSpent} used total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Purchased</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalCreditsPurchased}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime purchases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Destinations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedDestinations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                In your wishlist
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">My Trips</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trips</CardTitle>
                <CardDescription>Your latest travel plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tripHistory?.slice(0, 3).map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{trip.destination}</h4>
                      <p className="text-sm text-muted-foreground">
                        {trip.days} days • {format(new Date(trip.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {trip.status && (
                        <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                          {trip.status}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(trip._id, trip.isFavorite || false)}
                      >
                        <Heart className={`h-4 w-4 ${trip.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!tripHistory || tripHistory.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No trips yet. Start planning your first adventure!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Credit History</CardTitle>
                <CardDescription>Recent credit transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {creditTransactions?.slice(0, 5).map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'debit' ? '-' : '+'}{transaction.amount}
                    </div>
                  </div>
                ))}
                {(!creditTransactions || creditTransactions.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No transactions yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Your Trips</CardTitle>
              <CardDescription>Manage and view all your travel plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripHistory?.map((trip) => (
                  <div key={trip._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{trip.destination}</h3>
                          {trip.isFavorite && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{trip.days} days</span>
                          <span>{trip.people} people</span>
                          <span>${trip.budget} budget</span>
                          <span>{format(new Date(trip.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        {trip.activities && trip.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {trip.activities.slice(0, 3).map((activity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                            {trip.activities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{trip.activities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(trip._id, trip.isFavorite || false)}
                        >
                          <Heart className={`h-4 w-4 ${trip.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadItinerary(trip._id, trip.destination)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!tripHistory || tripHistory.length === 0) && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
                    <p className="text-muted-foreground mb-4">Start planning your first adventure!</p>
                    <Button>Plan Your First Trip</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Your recent activity and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userActivity?.map((activity) => (
                  <div key={activity._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      {activity.metadata?.destination && (
                        <p className="text-sm text-muted-foreground">
                          Destination: {activity.metadata.destination}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                {(!userActivity || userActivity.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Destinations</CardTitle>
              <CardDescription>Places you want to visit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedDestinations?.map((destination) => (
                  <div key={destination._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{destination.destinationName}</h3>
                        {destination.notes && (
                          <p className="text-sm text-muted-foreground">{destination.notes}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {destination.priority && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              Priority: {destination.priority}/5
                            </div>
                          )}
                          {destination.estimatedBudget && (
                            <span>Budget: ${destination.estimatedBudget}</span>
                          )}
                          {destination.plannedDate && (
                            <span>Planned: {destination.plannedDate}</span>
                          )}
                        </div>
                        {destination.tags && destination.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {destination.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Plan Trip
                      </Button>
                    </div>
                  </div>
                ))}
                {(!savedDestinations || savedDestinations.length === 0) && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved destinations</h3>
                    <p className="text-muted-foreground mb-4">Start building your travel wishlist!</p>
                    <Button>Explore Destinations</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
