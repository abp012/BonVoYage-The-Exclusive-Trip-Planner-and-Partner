import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Plus, Check, Crown } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const CreditDisplay: React.FC = () => {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    // Get user's current credits
  const credits = useQuery(
    api.users.getUserCredits,
    user ? { clerkId: user.id } : "skip"
  );
  
  // Check if user is premium
  const isPremium = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );
  
  // Mutation to add credits
  const addCredits = useMutation(api.users.addCredits);
  
  // Ensure user exists in database
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  
  React.useEffect(() => {
    if (user) {
      createOrGetUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
      }).catch(console.error);
    }
  }, [user, createOrGetUser]);

  const handlePurchaseCredits = async (amount: number, description: string) => {
    if (!user) return;
    
    try {
      await addCredits({
        clerkId: user.id,
        amount,
        description,
      });
      
      toast.success(`Successfully purchased ${amount} credits!`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to purchase credits. Please try again.");
    }
  };
  const creditPackages = [
    { amount: 5, price: "₹249", description: "Perfect for a few trips", popular: false },
    { amount: 15, price: "₹649", description: "Great value for regular travelers", popular: true },
    { amount: 30, price: "₹1,249", description: "Best for frequent trip planners", popular: false },
  ];
  if (!user) return null;

  // Show premium status if user is premium
  if (isPremium) {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-full border border-yellow-200">
        <Crown className="h-4 w-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">Premium • Unlimited</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Credit Display */}
      <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-full">
        <Coins className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">
          {credits ?? 0} Credits
        </span>
      </div>

      {/* Purchase Credits Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Buy Credits
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span>Purchase Credits</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Each credit allows you to generate one complete trip plan. Choose the package that works best for you!
              </p>
            </div>
            
            <div className="grid gap-3">
              {creditPackages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    pkg.popular ? 'ring-2 ring-blue-500 relative' : ''
                  }`}
                  onClick={() => handlePurchaseCredits(pkg.amount, `Purchased ${pkg.amount} credits package`)}
                >
                  {pkg.popular && (
                    <Badge 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{pkg.amount} Credits</CardTitle>
                      <span className="text-xl font-bold text-blue-600">{pkg.price}</span>
                    </div>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Generate {pkg.amount} complete trip plans
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              * This is a demo. No actual payment processing.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditDisplay;
