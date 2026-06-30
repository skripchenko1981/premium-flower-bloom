import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Verify the supplied admin session token from inside a query
 * (read-only ctx). Throws "Unauthorized" if missing or expired.
 * Expired rows are not deleted from reads — they're cleaned up by
 * the writer variant below or by `adminLogout`.
 */
async function requireAdminSessionRead(
  ctx: QueryCtx,
  token: string,
) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();
  if (!session) throw new Error("Unauthorized");
  if (session.expiresAt < Date.now()) throw new Error("Unauthorized");
  return session;
}

/**
 * Verify the supplied admin session token from inside a mutation
 * (write ctx). Throws "Unauthorized" if missing or expired.
 * Expired rows are deleted as a side effect (best-effort GC).
 */
async function requireAdminSession(
  ctx: MutationCtx,
  token: string,
) {
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
    await requireAdminSessionRead(ctx, args.token);

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
    await requireAdminSessionRead(ctx, args.token);
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
    await requireAdminSessionRead(ctx, args.token);
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ───────────────────────── Categories ─────────────────────────

export const adminGetAllCategories = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSessionRead(ctx, args.token);
    return await ctx.db.query("categories").collect();
  },
});

// ───────────────────────── Contact messages ─────────────────────────

export const adminGetContactMessages = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAdminSessionRead(ctx, args.token);
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

// ───────────────────────── Product CRUD ─────────────────────────

const productFields = {
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  price: v.number(),
  oldPrice: v.optional(v.number()),
  category: v.string(),
  images: v.array(v.string()),
  inStock: v.boolean(),
  featured: v.optional(v.boolean()),
  popular: v.optional(v.boolean()),
  tags: v.optional(v.array(v.string())),
  careTips: v.optional(v.string()),
};

export const adminCreateProduct = mutation({
  args: { token: v.string(), ...productFields },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const { token: _t, ...data } = args;
    const id = await ctx.db.insert("products", { ...data, createdAt: Date.now() });
    return { id };
  },
});

export const adminUpdateProduct = mutation({
  args: { token: v.string(), id: v.id("products"), ...productFields },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const { token: _t, id, ...data } = args;
    await ctx.db.patch(id, data);
    return { ok: true };
  },
});

export const adminDeleteProduct = mutation({
  args: { token: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

// ───────────────────────── Category CRUD ─────────────────────────

const categoryFields = {
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  order: v.optional(v.number()),
};

export const adminCreateCategory = mutation({
  args: { token: v.string(), ...categoryFields },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const { token: _t, ...data } = args;
    const id = await ctx.db.insert("categories", data);
    return { id };
  },
});

export const adminUpdateCategory = mutation({
  args: { token: v.string(), id: v.id("categories"), ...categoryFields },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    const { token: _t, id, ...data } = args;
    await ctx.db.patch(id, data);
    return { ok: true };
  },
});

export const adminDeleteCategory = mutation({
  args: { token: v.string(), id: v.id("categories") },
  handler: async (ctx, args) => {
    await requireAdminSession(ctx, args.token);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});
