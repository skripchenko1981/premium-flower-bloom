import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Verify the supplied admin session token. Throws "Unauthorized" if the
 * token is missing, doesn't match a session, or has expired. Expired
 * sessions are garbage-collected on read.
 */
async function requireAdminSession(ctx: QueryCtx | MutationCtx, token: string) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();
  if (!session) throw new Error("Unauthorized");
  if (session.expiresAt < Date.now()) {
    await ctx.db.delete(session._id);
    throw new Error("Unauthorized");
  }
  return session;
}

// ───────────────────────── Dashboard ─────────────────────────

export const getDashboardStats = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);

    const [products, categories, ordersAll, users] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("categories").collect(),
      ctx.db.query("orders").collect(),
      ctx.db.query("users").collect(),
    ]);

    const total_revenue = ordersAll
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total ?? 0), 0);

    const recent_orders = [...ordersAll]
      .sort((a, b) => (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime))
      .slice(0, 5)
      .map((o) => ({
        id: o._id,
        order_number: String(o._id).slice(-6).toUpperCase(),
        total_amount: o.total,
        status: o.status,
        created_at: o.createdAt ?? o._creationTime,
      }));

    return {
      total_products: products.length,
      total_categories: categories.length,
      total_orders: ordersAll.length,
      total_users: users.length,
      total_revenue,
      pending_orders: ordersAll.filter((o) => o.status === "pending").length,
      recent_orders,
    };
  },
});

// ───────────────────────── Orders ─────────────────────────

export const adminGetAllOrders = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const orders = await ctx.db.query("orders").collect();
    return orders.sort(
      (a, b) =>
        (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime),
    );
  },
});

const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const adminUpdateOrderStatus = mutation({
  args: {
    token: v.string(),
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    if (!ORDER_STATUS_VALUES.includes(args.status as typeof ORDER_STATUS_VALUES[number])) {
      throw new Error(`Invalid status: ${args.status}`);
    }
    await ctx.db.patch(args.orderId, { status: args.status });
    return { ok: true };
  },
});

// ───────────────────────── Products ─────────────────────────

export const adminGetAllProducts = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ───────────────────────── Categories ─────────────────────────

export const adminGetAllCategories = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    return await ctx.db.query("categories").collect();
  },
});

// ───────────────────────── Contact messages ─────────────────────────

export const adminGetContactMessages = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const messages = await ctx.db.query("contactMessages").collect();
    return messages.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const adminMarkContactRead = mutation({
  args: {
    token: v.string(),
    messageId: v.id("contactMessages"),
    read: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    await ctx.db.patch(args.messageId, { read: args.read });
    return { ok: true };
  },
});
