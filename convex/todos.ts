import { GenericQueryCtx } from "convex/server";
import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { GenericId, v } from "convex/values";
import { handleUserId } from "./auth";
import moment from "moment";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getInCompletedTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

export const getCompletedTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
  },
});

export const getTodosTotalByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return 0;
    }
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    return todos?.length || 0;
  },
});

export const todayTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter(
        (q) =>
          q.lte(q.field("dueDate"), todayStart.valueOf()) &&
          q.gte(q.field("dueDate"), todayEnd.valueOf())
      )
      .collect();
  },
});

export const overdueTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.lt(q.field("dueDate"), todayStart.getTime()))
      .collect();
  },
});

export const groupTodosByDate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.gt(q.field("dueDate"), new Date().getTime()))
      .collect();

    const groupedTodos = todos.reduce<any>((acc, todo) => {
      const dueDate = todo.dueDate ? new Date(todo.dueDate).toDateString() : "";
      acc[dueDate] = (acc[dueDate] || []).concat(todo);
      return acc;
    }, {});

    return groupedTodos;
  },
});

export const inCompletedTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

export const completedTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
  },
});

export const totalTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return 0;
    }
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
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
      const userId = await handleUserId(ctx);
      if (!userId) {
        return null;
      }
      const newTaskId = await ctx.db.insert("todos", {
        userId,
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
      console.log("Error in createATodo", error);
      return null;
    }
  },
});
