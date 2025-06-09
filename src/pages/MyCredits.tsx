import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins, Plus, Clock, TrendingUp, MapPin, Eye } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import TripDetailsModal from "../components/TripDetailsModal";
import { Link } from "react-router-dom";

const MyCredits: React.FC = () => {
  const { user } = useUser();
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  
  // Get user data and credit transactions
  const userCredits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );
  
  const creditTransactions = useQuery(
    api.users.getCreditTransactions,
    user ? { clerkId: user.id } : "skip"
  );
  
  const tripHistory = useQuery(
    api.users.getUserTripHistory,
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
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit':
      case 'purchase':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your credits</h1>
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

        {/* Credit Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <Coins className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userCredits ?? 0} Credits
              </div>
              <p className="text-xs text-muted-foreground">
                Available for trip planning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trips Generated</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tripHistory?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total trip plans created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {creditTransactions?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Credit history entries
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Credit History</span>
              </CardTitle>
              <CardDescription>
                Your recent credit transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {creditTransactions && creditTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="text-sm">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'debit' ? 'destructive' : 'default'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={getTransactionColor(transaction.type)}>
                          {transaction.type === 'debit' ? '-' : '+'}{transaction.amount}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {transaction.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No credit transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Recent Trips</span>
              </CardTitle>
              <CardDescription>
                Your recently generated trip plans
              </CardDescription>
            </CardHeader>
            <CardContent>              {tripHistory && tripHistory.length > 0 ? (
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
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trips generated yet</p>
                  <Link to="/planner" className="mt-4 inline-block">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Plan Your First Trip
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4">
            {/* Plan New Trip button hidden as requested */}
            {/* <Link to="/planner">
              <Button className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Plan New Trip</span>
              </Button>
            </Link> */}
          </div>        </div>
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

export default MyCredits;
