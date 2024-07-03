import { v } from "convex/values";
import { query } from "./_generated/server";
import { handleUserId } from "./auth";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    const userProjects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const systemProjects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("type"), "system"))
      .collect();

    return [...systemProjects, ...userProjects];
  },
});

export const getProjectByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return null;
    }
    const project = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("_id"), projectId))
      .collect();

    return project[0] || null;
  },
});
