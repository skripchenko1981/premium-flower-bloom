import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ---- Categories ----

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("categories").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();
  },
});

// ---- Products ----

export const getProducts = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let products;

    if (args.category) {
      const category = args.category;
      products = await ctx.db.query("products")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (args.minPrice !== undefined) {
      products = products.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= args.maxPrice!);
    }

    if (args.sortBy === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (args.sortBy === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (args.sortBy === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      products.sort((a, b) => b.createdAt - a.createdAt);
    }

    return products;
  },
});

export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("products").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();
  },
});

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").withIndex("by_featured", (q) => q.eq("featured", true)).take(8);
  },
});

export const getPopularProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").withIndex("by_popular", (q) => q.eq("popular", true)).take(8);
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ---- Cart ----

export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("cartItems").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  },
});

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    size: v.optional(v.string()),
    withCard: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
        size: args.size ?? existing.size,
        withCard: args.withCard ?? existing.withCard,
      });
    } else {
      await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        quantity: args.quantity,
        size: args.size,
        withCard: args.withCard,
      });
    }
  },
});

export const updateCartItemQuantity = mutation({
  args: { cartItemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

export const removeFromCart = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const items = await ctx.db.query("cartItems").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});

// ---- Wishlist ----

export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("wishlistItems").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  },
});

export const addToWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.query("wishlistItems")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    if (!existing) {
      await ctx.db.insert("wishlistItems", { userId, productId: args.productId });
      return true;
    }
    return false;
  },
});

export const removeFromWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.query("wishlistItems")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// ---- Orders ----

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("orders").withIndex("by_user", (q) => q.eq("userId", userId)).order("desc").collect();
  },
});

export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      size: v.optional(v.string()),
      image: v.string(),
    })),
    subtotal: v.number(),
    total: v.number(),
    discount: v.optional(v.number()),
    promocode: v.optional(v.string()),
    shippingMethod: v.string(),
    shippingCost: v.number(),
    paymentMethod: v.string(),
    recipientName: v.string(),
    recipientPhone: v.string(),
    recipientEmail: v.optional(v.string()),
    deliveryAddress: v.string(),
    deliveryDate: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    cardMessage: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const orderId = await ctx.db.insert("orders", {
      userId,
      items: args.items,
      status: "pending",
      subtotal: args.subtotal,
      total: args.total,
      discount: args.discount,
      promocode: args.promocode,
      shippingMethod: args.shippingMethod,
      shippingCost: args.shippingCost,
      paymentMethod: args.paymentMethod,
      recipientName: args.recipientName,
      recipientPhone: args.recipientPhone,
      recipientEmail: args.recipientEmail,
      deliveryAddress: args.deliveryAddress,
      deliveryDate: args.deliveryDate,
      deliveryTime: args.deliveryTime,
      cardMessage: args.cardMessage,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Clear cart after order
    const cartItems = await ctx.db.query("cartItems").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));

    return orderId;
  },
});

// Admin: Get all orders
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Admin: Update order status
export const updateOrderStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

// ---- Reviews ----

export const getProductReviews = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.query("reviews").withIndex("by_product", (q) => q.eq("productId", args.productId)).order("desc").collect();
  },
});

export const addReview = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);

    await ctx.db.insert("reviews", {
      userId,
      productId: args.productId,
      userName: (user?.name as string) || "Anonymous",
      rating: args.rating,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

// ---- Contact ----

export const submitContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      message: args.message,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// ---- Promocodes ----

export const checkPromocode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const promo = await ctx.db.query("promocodes").withIndex("by_code", (q) => q.eq("code", args.code)).first();
    if (!promo || !promo.active) return null;
    if (promo.expiresAt && promo.expiresAt < Date.now()) return null;
    if (promo.maxUses && promo.usedCount >= promo.maxUses) return null;
    return { code: promo.code, discount: promo.discount };
  },
});

export const applyPromocode = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const promo = await ctx.db.query("promocodes").withIndex("by_code", (q) => q.eq("code", args.code)).first();
    if (!promo || !promo.active) throw new Error("Invalid promocode");
    if (promo.expiresAt && promo.expiresAt < Date.now()) throw new Error("Promocode expired");
    if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error("Promocode limit reached");
    await ctx.db.patch(promo._id, { usedCount: promo.usedCount + 1 });
    return { code: promo.code, discount: promo.discount };
  },
});

// ---- Admin: Manage Products ----

export const adminGetAllProducts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const adminCreateProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    category: v.string(),
    images: v.array(v.string()),
    sizes: v.optional(v.array(v.object({ name: v.string(), price: v.number() }))),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
    popular: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    careTips: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    await ctx.db.insert("products", { ...args, createdAt: Date.now() });
  },
});

export const adminUpdateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    oldPrice: v.optional(v.number()),
    category: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.object({ name: v.string(), price: v.number() }))),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    popular: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    careTips: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");

    const { productId, ...updates } = args;
    await ctx.db.patch(productId, updates);
  },
});

export const adminDeleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    await ctx.db.delete(args.productId);
  },
});

// ---- Admin: Get all contact messages ----
export const getContactMessages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Not authorized");
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

// ---- User profile update ----
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, args);
  },
});
