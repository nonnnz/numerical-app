import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const iterpo = await ctx.db.query("iterpolation").collect();

    return iterpo;
  },
});

export const create = mutation({
  args: {
    x: v.string(),
    y: v.string(),
    find: v.string(),
    result: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const userId = identity.subject;
    const iterpo = await ctx.db.insert("iterpolation", {
      x: args.x,
      y: args.y,
      find: args.find,
      userId: userId,
      result: args.result,
      type: args.type,
    });

    return iterpo;
  },
});

export const remove = mutation({
  args: {
    id: v.id("iterpolation"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    await ctx.db.delete(args.id);
  },
});
