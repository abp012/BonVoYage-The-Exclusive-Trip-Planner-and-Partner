import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit feedback
export const submitFeedback = mutation({
  args: {
    name: v.string(),
    email: v.string(), // User's actual email address
    fromWhere: v.string(), // User's location
    comments: v.string(),
    rating: v.number(), // Star rating 1-5
    destination: v.optional(v.string()),
    clerkUserId: v.optional(v.string()), // Use Clerk user ID as string instead
    tripPlanId: v.optional(v.id("tripPlans")), // Link to trip plan for reward points
  },
  handler: async (ctx, args) => {
    // Find the user in our database using the Clerk ID if provided
    let convexUserId = undefined;
    if (args.clerkUserId && args.clerkUserId.trim()) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId as string))
        .unique();
      convexUserId = user?._id;
    }

    const feedbackId = await ctx.db.insert("feedback", {
      name: args.name,
      email: args.email,
      fromWhere: args.fromWhere,
      comments: args.comments,
      rating: args.rating,
      destination: args.destination || undefined,
      userId: convexUserId, // Use the found Convex user ID or undefined
      createdAt: Date.now(),
    });

    return { success: true, feedbackId, tripPlanId: args.tripPlanId };
  },
});

// Get all feedback (admin function)
export const getAllFeedback = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("feedback")
      .order("desc")
      .take(100);
  },
});

// Get feedback by destination
export const getFeedbackByDestination = query({
  args: {
    destination: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_destination", (q) => q.eq("destination", args.destination))
      .order("desc")
      .take(20);
  },
});
