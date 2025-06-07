import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const INITIAL_CREDITS = 2;

// Create or get user when they sign up/login
export const createOrGetUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update last active time and user info
      await ctx.db.patch(existingUser._id, {
        lastActiveAt: Date.now(),
        updatedAt: Date.now(),
        name: args.name || existingUser.name,
        firstName: args.firstName || existingUser.firstName,
        lastName: args.lastName || existingUser.lastName,
        avatar: args.avatar || existingUser.avatar,
      });

      // Log login activity
      await ctx.db.insert("userActivity", {
        userId: existingUser._id,
        activityType: "login",
        createdAt: Date.now(),
      });

      return existingUser;
    }

    // Create new user with initial credits
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      avatar: args.avatar,
      credits: INITIAL_CREDITS,
      totalCreditsUsed: 0,
      totalTripsPlanned: 0,
      lastActiveAt: now,
      createdAt: now,
      updatedAt: now,
      preferredCurrency: "USD",
      preferredLanguage: "en",
      emailNotifications: true,
      isActive: true,
    });

    // Create default user preferences
    await ctx.db.insert("userPreferences", {
      userId,
      destinations: {
        wishlist: [],
        visited: [],
        favorite: [],
      },
      createdAt: now,
      updatedAt: now,
    });

    // Record initial credit transaction
    await ctx.db.insert("creditTransactions", {
      userId,
      type: "credit",
      amount: INITIAL_CREDITS,
      description: "Welcome bonus - Free credits for new users!",
      status: "completed",
      createdAt: now,
    });

    // Log user registration activity
    await ctx.db.insert("userActivity", {
      userId,
      activityType: "login",
      metadata: {
        creditsAmount: INITIAL_CREDITS,
      },
      createdAt: now,
    });

    const newUser = await ctx.db.get(userId);
    return newUser;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get complete user profile with preferences
export const getUserProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return {
      ...user,
      preferences,
    };
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    updates: v.object({
      name: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      preferredCurrency: v.optional(v.string()),
      preferredLanguage: v.optional(v.string()),
      timezone: v.optional(v.string()),
      emailNotifications: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      ...args.updates,
      updatedAt: Date.now(),
      lastActiveAt: Date.now(),
    });

    // Log profile update activity
    await ctx.db.insert("userActivity", {
      userId: user._id,
      activityType: "profile_updated",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Update user preferences
export const updateUserPreferences = mutation({
  args: {
    clerkId: v.string(),
    preferences: v.object({
      travelStyle: v.optional(v.string()),
      favoriteActivities: v.optional(v.array(v.string())),
      dietaryRestrictions: v.optional(v.array(v.string())),
      mobilityRequirements: v.optional(v.string()),
      budgetRange: v.optional(v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      })),
      preferredAccommodation: v.optional(v.array(v.string())),
      transportationPrefs: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const existingPrefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const now = Date.now();

    if (existingPrefs) {
      await ctx.db.patch(existingPrefs._id, {
        ...args.preferences,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: user._id,
        ...args.preferences,
        destinations: {
          wishlist: [],
          visited: [],
          favorite: [],
        },
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

// Get user's credit balance
export const getUserCredits = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user ? user.credits : 0;
  },
});

// Get user stats
export const getUserStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const totalTrips = await ctx.db
      .query("tripPlans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalTransactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalCreditsSpent = totalTransactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCreditsPurchased = totalTransactions
      .filter(t => t.type === "purchase")
      .reduce((sum, t) => sum + t.amount, 0);

    const favoriteTrips = totalTrips.filter(trip => trip.isFavorite).length;

    return {
      totalTrips: totalTrips.length,
      totalCreditsSpent,
      totalCreditsPurchased,
      favoriteTrips,
      memberSince: user.createdAt,
      lastActive: user.lastActiveAt,
    };
  },
});

// Deduct credits when generating trip plan
export const deductCredit = mutation({
  args: {
    clerkId: v.string(),
    tripPlanData: v.object({
      destination: v.string(),
      days: v.number(),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      people: v.number(),
      budget: v.number(),
      activities: v.array(v.string()),
      travelWith: v.string(),
    }),
    tripDetails: v.optional(v.object({
      cityDescription: v.string(),
      topActivities: v.array(v.string()),
      localCuisine: v.array(v.string()),
      packingList: v.array(v.string()),
      weatherInfo: v.object({
        temperature: v.string(),
        condition: v.string(),
        humidity: v.string(),
        windSpeed: v.string(),
        description: v.string(),
      }),      
      detailedItinerary: v.array(v.object({
        day: v.number(),
        title: v.string(),
        morning: v.string(),
        afternoon: v.string(),
        evening: v.optional(v.string()),
      })),
      bestTimeToVisit: v.string(),
      travelTips: v.array(v.object({
        category: v.string(),
        title: v.string(),
        description: v.string(),
      })),      
      placesToVisit: v.optional(v.array(v.object({
        name: v.string(),
        description: v.string(),
        category: v.string(),
        coordinates: v.optional(v.object({
          lat: v.number(),
          lng: v.number(),
        })),
      }))),
      transportation: v.optional(v.object({
        local: v.array(v.string()),
        intercity: v.array(v.string()),
        tips: v.array(v.string()),
      })),
      budget: v.optional(v.object({
        accommodation: v.string(),
        food: v.string(),
        transportation: v.string(),
        activities: v.string(),
        total: v.string(),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < 1) {
      throw new Error("Insufficient credits");
    }

    const now = Date.now();

    // Create trip plan record with detailed information
    const tripPlanId = await ctx.db.insert("tripPlans", {
      userId: user._id,
      destination: args.tripPlanData.destination,
      days: args.tripPlanData.days,
      startDate: args.tripPlanData.startDate,
      endDate: args.tripPlanData.endDate,
      people: args.tripPlanData.people,
      budget: args.tripPlanData.budget,
      activities: args.tripPlanData.activities,
      travelWith: args.tripPlanData.travelWith,
      creditUsed: 1,
      createdAt: now,
      status: "active",
      isPublic: false,
      isFavorite: false,
      viewCount: 0,
      tags: [],
      tripDetails: args.tripDetails,
    });

    // Deduct credit from user and update stats
    await ctx.db.patch(user._id, {
      credits: user.credits - 1,
      totalCreditsUsed: user.totalCreditsUsed + 1,
      totalTripsPlanned: user.totalTripsPlanned + 1,
      lastActiveAt: now,
      updatedAt: now,
    });

    // Record credit transaction
    await ctx.db.insert("creditTransactions", {
      userId: user._id,
      type: "debit",
      amount: 1,
      description: `Trip plan generated for ${args.tripPlanData.destination}`,
      relatedTripPlanId: tripPlanId,
      status: "completed",
      createdAt: now,
    });

    // Log trip planning activity
    await ctx.db.insert("userActivity", {
      userId: user._id,
      activityType: "trip_planned",
      metadata: {
        destination: args.tripPlanData.destination,
        tripId: tripPlanId,
      },
      createdAt: now,
    });

    return {
      success: true,
      remainingCredits: user.credits - 1,
      tripPlanId,
    };
  },
});

// Add credits (for purchase functionality)
export const addCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Add credits to user
    await ctx.db.patch(user._id, {
      credits: user.credits + args.amount,
      lastActiveAt: now,
      updatedAt: now,
    });

    // Record credit transaction
    await ctx.db.insert("creditTransactions", {
      userId: user._id,
      type: "purchase",
      amount: args.amount,
      description: args.description || `Purchased ${args.amount} credits`,
      paymentMethod: args.paymentMethod,
      transactionId: args.transactionId,
      status: "completed",
      createdAt: now,
    });

    // Log credit purchase activity
    await ctx.db.insert("userActivity", {
      userId: user._id,
      activityType: "credit_purchased",
      metadata: {
        creditsAmount: args.amount,
      },
      createdAt: now,
    });

    return {
      success: true,
      newBalance: user.credits + args.amount,
    };
  },
});

// Get user's trip history with pagination and filtering
export const getUserTripHistory = query({
  args: { 
    clerkId: v.string(),
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    const query = ctx.db
      .query("tripPlans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc");

    const trips = await query.take(args.limit || 20);

    // Apply client-side filtering
    let filteredTrips = trips;
    
    if (args.status) {
      filteredTrips = filteredTrips.filter(trip => trip.status === args.status);
    }
    
    if (args.destination) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.destination.toLowerCase().includes(args.destination!.toLowerCase())
      );
    }

    return filteredTrips;
  },
});

// Get user's credit transaction history
export const getCreditTransactions = query({
  args: { 
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("creditTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 50);
  },
});

// Get user activity log
export const getUserActivity = query({
  args: { 
    clerkId: v.string(),
    limit: v.optional(v.number()),
    activityType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    const query = ctx.db
      .query("userActivity")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc");

    const activities = await query.take(args.limit || 30);

    if (args.activityType) {
      return activities.filter(activity => activity.activityType === args.activityType);
    }

    return activities;
  },
});

// Update trip (favorite, rating, notes, etc.)
export const updateTrip = mutation({
  args: {
    clerkId: v.string(),
    tripId: v.id("tripPlans"),
    updates: v.object({
      isFavorite: v.optional(v.boolean()),
      rating: v.optional(v.number()),
      notes: v.optional(v.string()),
      status: v.optional(v.union(
        v.literal("draft"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled")
      )),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== user._id) {
      throw new Error("Trip not found or unauthorized");
    }

    await ctx.db.patch(args.tripId, args.updates);

    return { success: true };
  },
});

// Save destination to wishlist
export const saveDestination = mutation({
  args: {
    clerkId: v.string(),
    destinationName: v.string(),
    notes: v.optional(v.string()),
    priority: v.optional(v.number()),
    estimatedBudget: v.optional(v.number()),
    plannedDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Check if destination already saved
    const existing = await ctx.db
      .query("savedDestinations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("destinationName"), args.destinationName))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        notes: args.notes || existing.notes,
        priority: args.priority || existing.priority,
        estimatedBudget: args.estimatedBudget || existing.estimatedBudget,
        plannedDate: args.plannedDate || existing.plannedDate,
        tags: args.tags || existing.tags,
        updatedAt: now,
      });
      return { success: true, destinationId: existing._id };
    } else {
      // Create new
      const destinationId = await ctx.db.insert("savedDestinations", {
        userId: user._id,
        destinationName: args.destinationName,
        notes: args.notes,
        priority: args.priority || 3,
        estimatedBudget: args.estimatedBudget,
        plannedDate: args.plannedDate,
        tags: args.tags || [],
        createdAt: now,
        updatedAt: now,
      });

      return { success: true, destinationId };
    }
  },
});

// Get saved destinations
export const getSavedDestinations = query({
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
      .query("savedDestinations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Log user activity (for analytics)
export const logActivity = mutation({
  args: {
    clerkId: v.string(),
    activityType: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("trip_planned"),
      v.literal("trip_viewed"),
      v.literal("trip_shared"),
      v.literal("credit_purchased"),
      v.literal("profile_updated"),
      v.literal("feedback_submitted"),
      v.literal("destination_searched"),
      v.literal("itinerary_downloaded")
    ),
    metadata: v.optional(v.object({
      destination: v.optional(v.string()),
      tripId: v.optional(v.id("tripPlans")),
      creditsAmount: v.optional(v.number()),
      searchQuery: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.insert("userActivity", {
      userId: user._id,
      activityType: args.activityType,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
