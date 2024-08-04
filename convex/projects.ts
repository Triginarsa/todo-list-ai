import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

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

export const createAProject = mutation({
  args: {
    name: v.string(),
  },

  handler: async (ctx, { name }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) {
        return null;
      }
      const newProjectId = await ctx.db.insert("projects", {
        userId,
        name,
        type: "user",
      });
      return newProjectId;
    } catch (error) {
      console.log("Error in createAProject", error);
      return null;
    }
  },
});

export const deleteAProject = mutation({
  args: {
    projectId: v.id("projects"),
  },

  handler: async (ctx, { projectId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) {
        return null;
      }
      const deleteProjectId = await ctx.db.delete(projectId);
      return deleteProjectId;
    } catch (error) {
      console.log("Error in deleteAProject", error);
      return null;
    }
  },
});

export const deleteProjectAndItsTasks = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) {
        return null;
      }
      const allTodos = await ctx.runQuery(api.todos.getTodosByProjectId, {
        projectId,
      });
      const promises = Promise.allSettled(
        allTodos.map(async (task: Doc<"todos">) =>
          ctx.runMutation(api.todos.deleteATodo, { todoId: task._id })
        )
      );
      const statuses = await promises;
      console.log("All todos deleted", statuses);

      await ctx.runMutation(api.projects.deleteAProject, { projectId });
    } catch (error) {
      console.log("Error in deleteProjectAndItsTasks", error);
      return null;
    }
  },
});
