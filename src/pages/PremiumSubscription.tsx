import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, Shield, Clock, Gift, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PremiumSubscription = () => {
  const { user, isSignedIn } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const subscriptionPlans = useQuery(api.subscriptions.getSubscriptionPlans);
  const currentSubscription = useQuery(
    api.subscriptions.getUserSubscription,
    user ? { clerkId: user.id } : "skip"
  );
  const isPremium = useQuery(
    api.subscriptions.isPremiumUser,
    user ? { clerkId: user.id } : "skip"
  );

  // Mutations
  const createSubscription = useMutation(api.subscriptions.createSubscription);

  const handleSubscribe = (plan: any) => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe");
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing (in real app, integrate with payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await createSubscription({
        clerkId: user.id,
        planId: selectedPlan._id,
        paymentMethod: "demo_payment",
        transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });

      if (result.success) {
        toast.success(result.message);
        setIsPaymentDialogOpen(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = (plan: any) => {
    const monthlyPrice = 2000;
    const totalMonthlyPrice = monthlyPrice * (plan.durationInDays / 30);
    const savings = totalMonthlyPrice - plan.price;
    return savings > 0 ? savings : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">BonVoyage Premium</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-500 mr-3" />
              <h1 className="text-5xl font-bold text-gray-900">
                Go Premium
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Unlock unlimited trip planning with our premium subscription
            </p>
            
            {/* Current Status */}
            {isPremium ? (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full border border-yellow-200">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-semibold">
                  You're already a Premium member!
                </span>
                {currentSubscription && (
                  <span className="text-yellow-700">
                    Expires on {new Date(currentSubscription.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2 bg-gray-100 px-6 py-3 rounded-full">
                <span className="text-gray-700">Currently on Free Plan</span>
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Premium Benefits
            </h2>            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-blue-600" />,
                  title: "Unlimited Trip Plans",
                  description: "Generate as many trip plans as you want without credit limitations"
                },
                {
                  icon: <Clock className="h-8 w-8 text-purple-600" />,
                  title: "Priority Support",
                  description: "Get faster response times and dedicated customer support"
                },
                {
                  icon: <Gift className="h-8 w-8 text-orange-600" />,
                  title: "Early Access",
                  description: "Be the first to try new AI features and improvements"
                }
              ].map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Choose Your Plan
            </h2>
            
            {subscriptionPlans && subscriptionPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subscriptionPlans.map((plan) => {
                  const savings = calculateSavings(plan);
                  return (
                    <Card 
                      key={plan._id} 
                      className={`relative hover:shadow-xl transition-all duration-300 ${
                        plan.isPopular 
                          ? 'border-2 border-blue-500 scale-105 shadow-lg' 
                          : 'border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {plan.isPopular && (
                        <Badge 
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Most Popular
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl font-bold">
                          {plan.name}
                        </CardTitle>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-gray-900">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-gray-600">
                            /{plan.duration.replace('_', ' ')}
                          </span>
                        </div>
                        {savings > 0 && (
                          <div className="text-sm text-green-600 font-semibold">
                            Save {formatPrice(savings)}
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {plan.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full mt-6 ${
                            plan.isPopular 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                              : ''
                          }`}
                          variant={plan.isPopular ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan)}
                          disabled={isPremium}
                        >
                          {isPremium ? 'Already Premium' : 'Subscribe Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading subscription plans...</div>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What happens to my credits when I subscribe?",
                  answer: "Your existing credits are safely stored and will be restored when your premium subscription expires. During your premium period, you won't need credits."
                },
                {
                  question: "What happens when my subscription expires?",
                  answer: "Your account will return to the free plan, and all your previously earned credits and points will be restored automatically."
                },                {
                  question: "If you have any problem then contact with our team",
                  answer: "For any issues or support, please contact Abhinay Kumar at mobile number +91 7050830361. Our team is here to help you with any questions or concerns."
                }].map((faq, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    {faq.question === "If you have any problem then contact with our team" ? (
                      <p className="text-gray-600 text-sm">
                        For any issues or support, please contact{" "}
                        <span className="font-bold">Abhinay Kumar at mobile number +91 7050830361</span>
                        . Our team is here to help you with any questions or concerns.
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span>Complete Your Subscription</span>
            </DialogTitle>
            <DialogDescription>
              You're about to subscribe to the {selectedPlan?.name} plan
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{selectedPlan.name}</span>
                  <span className="text-xl font-bold">{formatPrice(selectedPlan.price)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedPlan.durationInDays} days of premium access
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">What you'll get:</div>
                <div className="space-y-1">
                  {selectedPlan.features.slice(0, 3).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Note:</strong> This is a demo payment. No actual charges will be made.
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsPaymentDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumSubscription;
