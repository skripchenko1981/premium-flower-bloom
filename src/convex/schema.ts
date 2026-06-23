import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // --- Flower Shop Tables ---

    // Product categories
    categories: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      order: v.optional(v.number()),
    }).index("by_slug", ["slug"]),

    // Products (flowers, bouquets, plants, gift sets)
    products: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      price: v.number(),
      oldPrice: v.optional(v.number()),
      category: v.string(), // category slug
      images: v.array(v.string()),
      sizes: v.optional(v.array(v.object({
        name: v.string(),
        price: v.number(),
      }))),
      inStock: v.boolean(),
      featured: v.optional(v.boolean()),
      popular: v.optional(v.boolean()),
      tags: v.optional(v.array(v.string())),
      careTips: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_category", ["category"])
      .index("by_featured", ["featured"])
      .index("by_popular", ["popular"]),

    // Shopping cart items
    cartItems: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
      quantity: v.number(),
      size: v.optional(v.string()),
      withCard: v.optional(v.boolean()),
    }).index("by_user", ["userId"]),

    // Wishlist
    wishlistItems: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
    })
      .index("by_user", ["userId"])
      .index("by_user_product", ["userId", "productId"]),

    // Orders
    orders: defineTable({
      userId: v.id("users"),
      items: v.array(v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        image: v.string(),
      })),
      status: v.string(), // pending, confirmed, processing, shipped, delivered, cancelled
      total: v.number(),
      subtotal: v.number(),
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
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Reviews
    reviews: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
      userName: v.string(),
      rating: v.number(), // 1-5
      text: v.string(),
      createdAt: v.number(),
    })
      .index("by_product", ["productId"])
      .index("by_user", ["userId"]),

    // Contact messages
    contactMessages: defineTable({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      message: v.string(),
      read: v.optional(v.boolean()),
      createdAt: v.number(),
    }),

    // Promocodes
    promocodes: defineTable({
      code: v.string(),
      discount: v.number(), // percentage (5 = 5%)
      maxUses: v.optional(v.number()),
      usedCount: v.number(),
      active: v.boolean(),
      expiresAt: v.optional(v.number()),
    }).index("by_code", ["code"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
