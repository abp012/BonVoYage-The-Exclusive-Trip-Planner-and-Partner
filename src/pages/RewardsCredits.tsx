import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import { 
  Coins,
  Gift, 
  Star, 
  Trophy, 
  CreditCard, 
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { toast } from "sonner";

const RewardsCredits: React.FC = () => {
  const { user } = useUser();
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null);
  
  // Convex mutations and queries
  const redeemPoints = useMutation(api.users.redeemPointsForCredits);
  const rewardData = useQuery(
    api.users.getUserRewardPoints,
    user ? { clerkId: user.id } : "skip"
  );
  const redemptionTiers = useQuery(
    api.users.getRedemptionTiers,
    user ? { clerkId: user.id } : "skip"
  );
  const userProfile = useQuery(
    api.users.getUserProfile,
    user ? { clerkId: user.id } : "skip"
  );

  const handleRedeem = async (points: number) => {
    if (!user) {
      toast.error("Please sign in to redeem points");
      return;
    }

    setIsRedeeming(points);
    
    try {
      const result = await redeemPoints({
        clerkId: user.id,
        pointsToRedeem: points,
      });

      if (result.success) {
        toast.success(
          `🎉 Successfully redeemed ${points} points for ${result.creditsAwarded} credits!`
        );
      } else {
        toast.error(result.message || "Failed to redeem points");
      }
    } catch (error) {
      console.error("Redemption error:", error);
      toast.error("Failed to redeem points. Please try again.");
    } finally {
      setIsRedeeming(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sign in to view your rewards
                </h2>
                <p className="text-gray-600">
                  Please sign in to access your reward points and credit redemption options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const currentPoints = rewardData?.rewardPoints || 0;
  const currentCredits = userProfile?.credits || 0;  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full mr-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Rewards & Credits
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn points through activities and redeem them for travel credits to plan more amazing trips
            </p>
          </div>

          {/* Points Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Current Points */}
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-yellow-700">
                  <Coins className="h-6 w-6" />
                  Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {currentPoints.toLocaleString()}
                </div>
                <p className="text-sm text-yellow-600">Available to redeem</p>
              </CardContent>
            </Card>

            {/* Current Credits */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-blue-700">
                  <CreditCard className="h-6 w-6" />
                  Credits Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {currentCredits}
                </div>
                <p className="text-sm text-blue-600">Trip planning credits</p>
              </CardContent>
            </Card>

            {/* How to Earn */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-green-700">
                  <Star className="h-6 w-6" />
                  Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  +100
                </div>
                <p className="text-sm text-green-600">Points per feedback</p>
              </CardContent>
            </Card>
          </div>

          {/* How it Works Section */}
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Info className="h-6 w-6" />
                How Rewards Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Generate Trip Plan</h3>
                  <p className="text-sm text-gray-600">
                    Create a trip plan using our AI-powered planner (costs 1 credit)
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Submit Feedback</h3>
                  <p className="text-sm text-gray-600">
                    Share your experience and feedback on the trip plan to earn 100 points
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Redeem for Credits</h3>
                  <p className="text-sm text-gray-600">
                    Exchange your reward points for free credits to plan more trips
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redemption Tiers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-blue-600" />
                Redeem Points for Credits
              </CardTitle>
              <CardDescription>
                Choose from our redemption tiers to get the best value for your points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {redemptionTiers?.tiers.map((tier, index) => (
                  <Card 
                    key={tier.points} 
                    className={`relative ${
                      tier.available 
                        ? 'border-blue-200 shadow-md hover:shadow-lg transition-shadow' 
                        : 'border-gray-200 opacity-60'
                    } ${tier.badge ? 'border-2 border-green-300 bg-green-50' : ''}`}
                  >
                    {tier.badge && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                        {tier.badge}
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{tier.description}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">
                        {tier.credits} Credits
                      </div>
                      <div className="text-sm text-gray-600">
                        for {tier.points.toLocaleString()} points
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        onClick={() => handleRedeem(tier.points)}
                        disabled={!tier.available || isRedeeming === tier.points}
                        className={`w-full ${
                          tier.available 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {isRedeeming === tier.points ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Redeeming...
                          </>
                        ) : tier.available ? (
                          <>
                            Redeem Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          `Need ${(tier.points - currentPoints).toLocaleString()} more points`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-gray-600" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your latest reward point activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rewardData?.transactions && rewardData.transactions.length > 0 ? (
                <div className="space-y-4">
                  {rewardData.transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned_feedback' 
                            ? 'bg-green-100' 
                            : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'earned_feedback' ? (
                            <Star className="h-5 w-5 text-green-600" />
                          ) : (
                            <Gift className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.pointsAmount > 0 ? '+' : ''}{transaction.pointsAmount} points
                        </div>
                        {transaction.creditsReceived && (
                          <div className="text-sm text-blue-600">
                            +{transaction.creditsReceived} credits
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coins className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg mb-2">No transactions yet</p>
                  <p className="text-sm">Start by creating trip plans and submitting feedback to earn points!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RewardsCredits;
