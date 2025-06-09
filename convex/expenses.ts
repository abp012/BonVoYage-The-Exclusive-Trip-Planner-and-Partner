import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper function to get user by Clerk ID
async function getUserByClerkId(ctx: any, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
    .first();
}

// Create a new travel expense entry
export const createTravelExpense = mutation({
  args: {
    userId: v.string(), // This is the Clerk ID
    tripPlanId: v.optional(v.string()),
    tripName: v.string(),
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    currency: v.string(),
    totalBudget: v.number(),
    notes: v.optional(v.string()),
  },  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const expenseId = await ctx.db.insert("travelExpenses", {
      ...args,
      userId: user._id,
      tripPlanId: args.tripPlanId as Id<"tripPlans"> | undefined,
      totalSpent: 0,
      status: "planning",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return expenseId;
  },
});

// Get all travel expenses for a user
export const getUserTravelExpenses = query({
  args: { userId: v.string() }, // This is the Clerk ID
  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("travelExpenses")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();
  },
});

// Get a specific travel expense
export const getTravelExpense = query({
  args: { expenseId: v.id("travelExpenses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.expenseId);
  },
});

// Update travel expense
export const updateTravelExpense = mutation({
  args: {
    expenseId: v.id("travelExpenses"),
    tripName: v.optional(v.string()),
    destination: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    totalDays: v.optional(v.number()),
    currency: v.optional(v.string()),
    totalBudget: v.optional(v.number()),
    status: v.optional(v.union(v.literal("planning"), v.literal("ongoing"), v.literal("completed"))),
    notes: v.optional(v.string()),
  },  handler: async (ctx, args) => {
    const { expenseId, ...updates } = args;
    await ctx.db.patch(expenseId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete travel expense
export const deleteTravelExpense = mutation({
  args: { expenseId: v.id("travelExpenses") },
  handler: async (ctx, args) => {
    // First delete all daily expenses associated with this travel expense
    const dailyExpenses = await ctx.db
      .query("dailyExpenses")
      .filter((q) => q.eq(q.field("travelExpenseId"), args.expenseId))
      .collect();
    
    for (const expense of dailyExpenses) {
      await ctx.db.delete(expense._id);
    }
    
    // Then delete the travel expense
    await ctx.db.delete(args.expenseId);
  },
});

// Add or update daily expense
export const addDailyExpense = mutation({
  args: {
    travelExpenseId: v.id("travelExpenses"),
    userId: v.string(), // This is the Clerk ID
    day: v.number(),
    date: v.string(),
    category: v.union(
      v.literal("accommodation"),
      v.literal("food"),
      v.literal("transportation"),
      v.literal("activities"),
      v.literal("shopping"),
      v.literal("miscellaneous")
    ),
    subcategory: v.optional(v.string()),
    description: v.string(),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.optional(v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("other"))),
    receipt: v.optional(v.string()),
    location: v.optional(v.string()),
    isPlanned: v.boolean(),
    notes: v.optional(v.string()),
  },  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const expenseId = await ctx.db.insert("dailyExpenses", {
      ...args,
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Update total spent in travel expense
    await updateTotalSpent(ctx, args.travelExpenseId);
    
    return expenseId;
  },
});

// Update daily expense
export const updateDailyExpense = mutation({
  args: {
    expenseId: v.id("dailyExpenses"),
    category: v.optional(v.union(
      v.literal("accommodation"),
      v.literal("food"),
      v.literal("transportation"),
      v.literal("activities"),
      v.literal("shopping"),
      v.literal("miscellaneous")
    )),
    subcategory: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    paymentMethod: v.optional(v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("other"))),
    receipt: v.optional(v.string()),
    location: v.optional(v.string()),
    isPlanned: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { expenseId, ...updates } = args;
    const expense = await ctx.db.get(expenseId);
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    await ctx.db.patch(expenseId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    // Update total spent in travel expense
    await updateTotalSpent(ctx, expense.travelExpenseId);
  },
});

// Delete daily expense
export const deleteDailyExpense = mutation({
  args: { expenseId: v.id("dailyExpenses") },
  handler: async (ctx, args) => {
    const expense = await ctx.db.get(args.expenseId);
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    await ctx.db.delete(args.expenseId);
    
    // Update total spent in travel expense
    await updateTotalSpent(ctx, expense.travelExpenseId);
  },
});

// Get daily expenses for a travel expense
export const getDailyExpenses = query({
  args: { travelExpenseId: v.id("travelExpenses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyExpenses")
      .filter((q) => q.eq(q.field("travelExpenseId"), args.travelExpenseId))
      .order("asc")
      .collect();
  },
});

// Get expense categories for a user
export const getUserExpenseCategories = query({
  args: { userId: v.string() }, // This is the Clerk ID
  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("expenseCategories")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

// Add custom expense category
export const addExpenseCategory = mutation({
  args: {
    userId: v.string(), // This is the Clerk ID
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    isDefault: v.boolean(),
  },  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("expenseCategories", {
      ...args,
      userId: user._id,
      createdAt: Date.now(),
    });
  },
});

// Get expense analytics
export const getExpenseAnalytics = query({
  args: { travelExpenseId: v.id("travelExpenses") },
  handler: async (ctx, args) => {
    const dailyExpenses = await ctx.db
      .query("dailyExpenses")
      .filter((q) => q.eq(q.field("travelExpenseId"), args.travelExpenseId))
      .collect();
    
    const categoryTotals = dailyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const dailyTotals = dailyExpenses.reduce((acc, expense) => {
      acc[expense.day] = (acc[expense.day] || 0) + expense.amount;
      return acc;
    }, {} as Record<number, number>);
    
    const totalSpent = dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      categoryTotals,
      dailyTotals,
      totalSpent,
      expenseCount: dailyExpenses.length,
    };
  },
});

// Helper function to update total spent
async function updateTotalSpent(ctx: any, travelExpenseId: any) {
  const dailyExpenses = await ctx.db
    .query("dailyExpenses")
    .filter((q: any) => q.eq(q.field("travelExpenseId"), travelExpenseId))
    .collect();
  
  const totalSpent = dailyExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    await ctx.db.patch(travelExpenseId, {
    totalSpent,
    updatedAt: Date.now(),
  });
}

// Initialize default expense categories for a user
export const initializeDefaultCategories = mutation({
  args: { userId: v.string() }, // This is the Clerk ID
  handler: async (ctx, args) => {
    // Get the user by Clerk ID
    const user = await getUserByClerkId(ctx, args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const defaultCategories = [
      { name: "Accommodation", icon: "🏨", color: "#3B82F6" },
      { name: "Food & Dining", icon: "🍽️", color: "#EF4444" },
      { name: "Transportation", icon: "🚗", color: "#10B981" },
      { name: "Activities", icon: "🎯", color: "#F59E0B" },
      { name: "Shopping", icon: "🛍️", color: "#8B5CF6" },
      { name: "Miscellaneous", icon: "📋", color: "#6B7280" },
    ];    const promises = defaultCategories.map(category =>
      ctx.db.insert("expenseCategories", {
        ...category,
        userId: user._id,
        isDefault: true,
        createdAt: Date.now(),
      })
    );
    
    await Promise.all(promises);
  },
});
