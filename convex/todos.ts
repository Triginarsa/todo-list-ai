import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

export const inCompletedTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

export const completedTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
  },
});

export const totalTodos = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
    return todos.length || 0;
  },
});

export const checkATodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, { todoId }) => {
    const checkATodoId = await ctx.db.patch(todoId, { isCompleted: true });
    return checkATodoId;
  },
});

export const unCheckATodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, { todoId }) => {
    const unCheckATodoId = await ctx.db.patch(todoId, { isCompleted: false });
    return unCheckATodoId;
  },
});

export const createATodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
  },

  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId }
  ) => {
    try {
      const newTaskId = await ctx.db.insert("todos", {
        userId: "jn73a35ahwxdbsyg0jps8vzr216w1v2r" as Id<"users">,
        taskName,
        description,
        priority,
        dueDate,
        projectId,
        labelId,
        isCompleted: false,
      });
      return newTaskId;
    } catch (error) {
      return error;
    }
  },
});
