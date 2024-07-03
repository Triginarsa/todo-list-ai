import { v } from "convex/values";
import { query } from "./_generated/server";
import { handleUserId } from "./auth";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    const userLabels = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const systemLabels = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("type"), "system"))
      .collect();

    return [...systemLabels, ...userLabels];
  },
});

export const getLabelByLabelId = query({
  args: { labelId: v.id("labels") },
  handler: async (ctx, { labelId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return null;
    }
    const label = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("_id"), labelId))
      .collect();

    return label[0] || null;
  },
});
