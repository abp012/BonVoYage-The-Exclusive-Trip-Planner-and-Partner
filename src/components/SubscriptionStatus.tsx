import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Zap, AlertCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SubscriptionStatus = () => {
  const { user } = useUser();
  
  const currentSubscription = useQuery(
    api.subscriptions.getUserSubscription,
    user ? { clerkId: user.id } : "skip"
  );
  
  const isPremium = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );

  if (!user) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (expiryDate: number) => {
    const now = Date.now();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isPremium && currentSubscription) {
    const daysRemaining = getDaysRemaining(currentSubscription.endDate);
    const isExpiringSoon = daysRemaining <= 7;
    
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">Premium Active</span>
            <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
              {currentSubscription.plan?.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-700">
              Expires on {formatDate(currentSubscription.endDate)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-700">
              Unlimited trip generations
            </span>
          </div>
          
          {isExpiringSoon && (
            <div className="flex items-center space-x-2 text-sm bg-orange-100 p-2 rounded-md">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-orange-700">
                Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <div className="pt-2">
            <Link to="/premium">
              <Button variant="outline" size="sm" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800">Upgrade to Premium</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-blue-700">
          Get unlimited trip generations and ad-free experience
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">Unlimited trip plans</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">No credit deductions</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Link to="/premium">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Upgrade Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
