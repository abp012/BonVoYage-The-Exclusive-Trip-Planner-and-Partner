import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all subscription plans
export const getSubscriptionPlans = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
  },
});

// Get user's current subscription
export const getUserSubscription = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!subscription) {
      return null;
    }

    const plan = await ctx.db.get(subscription.planId);
    
    return {
      ...subscription,
      plan,
    };
  },
});

// Check if user has active premium subscription
export const isPremiumUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return false;
    }

    const now = Date.now();
    return user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > now;
  },
});

// Create subscription
export const createSubscription = mutation({
  args: {
    clerkId: v.string(),
    planId: v.id("subscriptionPlans"),
    paymentMethod: v.string(),
    transactionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    const now = Date.now();
    const endDate = now + (plan.durationInDays * 24 * 60 * 60 * 1000);

    // Store current credits and points before activating premium
    const creditsBeforeActivation = user.credits;
    const pointsBeforeActivation = user.rewardPoints || 0;

    // Create subscription record
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      planId: args.planId,
      status: "active",
      startDate: now,
      endDate,
      price: plan.price,
      currency: plan.currency,
      paymentMethod: args.paymentMethod,
      transactionId: args.transactionId,
      autoRenew: false,
      creditsBeforeActivation,
      pointsBeforeActivation,
      createdAt: now,
      updatedAt: now,
    });

    // Update user to premium status
    await ctx.db.patch(user._id, {
      isPremium: true,
      premiumExpiresAt: endDate,
      creditsBeforePremium: creditsBeforeActivation,
      pointsBeforePremium: pointsBeforeActivation,
      updatedAt: now,
    });

    // Create payment transaction record
    await ctx.db.insert("paymentTransactions", {
      userId: user._id,
      subscriptionId,
      type: "subscription",
      amount: plan.price,
      currency: plan.currency,
      status: "completed",
      paymentMethod: args.paymentMethod,
      transactionId: args.transactionId,
      description: `Premium subscription: ${plan.name}`,
      metadata: {
        planName: plan.name,
        duration: plan.duration,
      },
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      subscriptionId,
      message: `Premium subscription activated! Expires on ${new Date(endDate).toLocaleDateString()}`,
    };
  },
});

// Cancel subscription
export const cancelSubscription = mutation({
  args: {
    clerkId: v.string(),
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription || subscription.userId !== user._id) {
      throw new Error("Subscription not found or unauthorized");
    }

    const now = Date.now();

    // Update subscription status
    await ctx.db.patch(args.subscriptionId, {
      status: "cancelled",
      autoRenew: false,
      updatedAt: now,
    });

    return {
      success: true,
      message: "Subscription cancelled successfully. Premium benefits will remain active until expiry date.",
    };
  },
});

// Check and expire subscriptions (should be called periodically)
export const expireSubscriptions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Find expired subscriptions
    const expiredSubscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.lt(q.field("endDate"), now))
      .collect();

    for (const subscription of expiredSubscriptions) {
      // Update subscription status
      await ctx.db.patch(subscription._id, {
        status: "expired",
        updatedAt: now,
      });

      // Restore user's credits and points
      const user = await ctx.db.get(subscription.userId);
      if (user) {
        await ctx.db.patch(user._id, {
          isPremium: false,
          premiumExpiresAt: undefined,
          credits: subscription.creditsBeforeActivation || user.credits,
          rewardPoints: subscription.pointsBeforeActivation || user.rewardPoints,
          creditsBeforePremium: undefined,
          pointsBeforePremium: undefined,
          updatedAt: now,
        });
      }
    }

    return {
      success: true,
      expiredCount: expiredSubscriptions.length,
    };
  },
});

// Initialize subscription plans (run once to populate database)
export const initializeSubscriptionPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const plans = [
      {
        name: "1 Month Premium",
        duration: "1_month",
        durationInDays: 30,
        price: 2000,
        currency: "INR",
        features: [
          "Unlimited trip plan generations",
          "No credit deductions",
          "Ad-free experience",
          "Priority customer support",
          "Early access to new features"
        ],
        isPopular: false,
        isActive: true,
      },
      {
        name: "5 Months Premium",
        duration: "5_months",
        durationInDays: 150,
        price: 7000,
        currency: "INR",
        features: [
          "Unlimited trip plan generations",
          "No credit deductions",
          "Ad-free experience",
          "Priority customer support",
          "Early access to new features",
          "Save ₹3,000 vs monthly"
        ],
        isPopular: true,
        isActive: true,
      },
      {
        name: "1 Year Premium",
        duration: "1_year",
        durationInDays: 365,
        price: 15000,
        currency: "INR",
        features: [
          "Unlimited trip plan generations",
          "No credit deductions",
          "Ad-free experience",
          "Priority customer support",
          "Early access to new features",
          "Save ₹9,000 vs monthly",
          "Exclusive travel insights"
        ],
        isPopular: false,
        isActive: true,
      },
      {
        name: "2 Years Premium",
        duration: "2_years",
        durationInDays: 730,
        price: 25000,
        currency: "INR",
        features: [
          "Unlimited trip plan generations",
          "No credit deductions",
          "Ad-free experience",
          "Priority customer support",
          "Early access to new features",
          "Save ₹23,000 vs monthly",
          "Exclusive travel insights",
          "Personal travel concierge"
        ],
        isPopular: false,
        isActive: true,
      }
    ];

    const now = Date.now();
    
    for (const plan of plans) {
      await ctx.db.insert("subscriptionPlans", {
        ...plan,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      message: "Subscription plans initialized successfully",
      count: plans.length,
    };
  },
});

// Get user's subscription history
export const getUserSubscriptionHistory = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const subscriptionsWithPlans = await Promise.all(
      subscriptions.map(async (sub) => {
        const plan = await ctx.db.get(sub.planId);
        return {
          ...sub,
          plan,
        };
      })
    );

    return subscriptionsWithPlans;
  },
});

// Get payment history
export const getPaymentHistory = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("paymentTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
