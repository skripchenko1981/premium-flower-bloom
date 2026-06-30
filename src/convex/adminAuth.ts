"use node";

import { action, query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import crypto from "node:crypto";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Constant-time string comparison to mitigate timing attacks.
 * Buffers of differing lengths are padded so the timing stays close.
 */
function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");
  // XOR two equal-length buffers so timingSafeEqual doesn't throw.
  const len = Math.max(aBuf.length, bBuf.length, 1);
  const aPad = Buffer.alloc(len);
  const bPad = Buffer.alloc(len);
  aBuf.copy(aPad);
  bBuf.copy(bPad);
  const eq = crypto.timingSafeEqual(aPad, bPad);
  return eq && aBuf.length === bBuf.length;
}

export const createSession = internalMutation({
  args: {
    token: v.string(),
    username: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminSessions", args);
  },
});

/**
 * Verify the supplied admin credentials against env vars
 * ADMIN_USERNAME and ADMIN_PASSWORD. Returns a session token on success.
 * Throws a generic Error on failure to avoid leaking which field is wrong.
 */
export const verifyAdminCredentials = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const adminUser = process.env["ADMIN_USERNAME"];
    const adminPass = process.env["ADMIN_PASSWORD"];

    if (!adminUser || !adminPass) {
      throw new Error(
        "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the project environment.",
      );
    }

    const userOk = timingSafeEqualStr(args.username, adminUser);
    const passOk = timingSafeEqualStr(args.password, adminPass);

    if (!userOk || !passOk) {
      throw new Error("Невірний логін або пароль");
    }

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    await ctx.runMutation(internal.adminAuth.createSession, {
      token,
      username: adminUser,
      expiresAt,
    });

    return { token, username: adminUser, expiresAt };
  },
});

/**
 * Verify a stored session token. Returns the username and expiration
 * if valid, or null if missing/expired. This is a read-only query, so
 * expired session rows are NOT deleted here — they get cleaned up by
 * `adminLogout` or any writer-validated mutation (best-effort GC).
 */
export const verifyAdminSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session) return null;
    if (session.expiresAt < Date.now()) return null;
    return { username: session.username, expiresAt: session.expiresAt };
  },
});

/**
 * Invalidate the supplied session token (logout).
 */
export const adminLogout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});
