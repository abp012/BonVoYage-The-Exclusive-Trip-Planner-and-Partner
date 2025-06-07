import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    credits: v.number(),
    totalCreditsUsed: v.number(),
    totalTripsPlanned: v.number(),
    lastActiveAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    // User preferences
    preferredCurrency: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    timezone: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_last_active", ["lastActiveAt"]),

  // User preferences and settings
  userPreferences: defineTable({
    userId: v.id("users"),
    travelStyle: v.optional(v.string()), // adventure, luxury, budget, cultural, etc.
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
    destinations: v.optional(v.object({
      wishlist: v.array(v.string()),
      visited: v.array(v.string()),
      favorite: v.array(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // User activity log
  userActivity: defineTable({
    userId: v.id("users"),
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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_activity_type", ["activityType"])
    .index("by_created_at", ["createdAt"]),

  // User sessions
  userSessions: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    deviceInfo: v.optional(v.object({
      userAgent: v.string(),
      platform: v.string(),
      browser: v.string(),
      ipAddress: v.optional(v.string()),
    })),
    startTime: v.number(),
    lastActivity: v.number(),
    endTime: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_session_id", ["sessionId"])
    .index("by_is_active", ["isActive"]),

  tripPlans: defineTable({
    userId: v.id("users"),
    destination: v.string(),
    days: v.number(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    people: v.number(),
    budget: v.number(),
    activities: v.array(v.string()),
    travelWith: v.string(),
    creditUsed: v.number(),
    createdAt: v.number(),
    // Trip status and metadata
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
    isPublic: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    sharedWith: v.optional(v.array(v.string())), // email addresses
    viewCount: v.optional(v.number()),
    rating: v.optional(v.number()), // User's rating of the trip
    // Detailed trip plan data
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
        evening: v.optional(v.string()), // Make evening optional for departure days
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
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_destination", ["destination"])
    .index("by_status", ["status"])
    .index("by_is_favorite", ["isFavorite"]),

  creditTransactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("credit"), v.literal("debit"), v.literal("purchase"), v.literal("refund")),
    amount: v.number(),
    description: v.string(),
    relatedTripPlanId: v.optional(v.id("tripPlans")),
    paymentMethod: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    )),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  // User saved destinations
  savedDestinations: defineTable({
    userId: v.id("users"),
    destinationName: v.string(),
    notes: v.optional(v.string()),
    priority: v.optional(v.number()), // 1-5 priority rating
    estimatedBudget: v.optional(v.number()),
    plannedDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_destination", ["destinationName"])
    .index("by_priority", ["priority"]),

  // Feedback and support
  feedback: defineTable({
    name: v.string(),
    email: v.string(), // User's actual email address
    fromWhere: v.string(), // User's location (formerly stored in email field)
    comments: v.string(),
    rating: v.number(), // Star rating 1-5
    destination: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    tripPlanId: v.optional(v.id("tripPlans")),
    feedbackType: v.optional(v.union(
      v.literal("general"),
      v.literal("trip_quality"),
      v.literal("bug_report"),
      v.literal("feature_request"),
      v.literal("support")
    )),
    status: v.optional(v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    )),
    adminResponse: v.optional(v.string()),
    respondedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_destination", ["destination"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_feedback_type", ["feedbackType"]),
});
