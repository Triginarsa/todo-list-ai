import { GenericQueryCtx } from "convex/server";
import { Id } from "./_generated/dataModel";
import { query, mutation, action } from "./_generated/server";
import { GenericId, v } from "convex/values";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAi } from "./openai";
import { api } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("subTodos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getSubTodosByParentId = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("subTodos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("parentId"), parentId))
      .collect();
  },
});

export const inCompletedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("subTodos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("parentId"), parentId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

export const completedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("subTodos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("parentId"), parentId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();
  },
});

export const checkASubTodo = mutation({
  args: { subTodoId: v.id("subTodos") },
  handler: async (ctx, { subTodoId }) => {
    const checkASubTodoId = await ctx.db.patch(subTodoId, {
      isCompleted: true,
    });
    return checkASubTodoId;
  },
});

export const unCheckASubTodo = mutation({
  args: { subTodoId: v.id("subTodos") },
  handler: async (ctx, { subTodoId }) => {
    const unCheckASubTodoId = await ctx.db.patch(subTodoId, {
      isCompleted: false,
    });
    return unCheckASubTodoId;
  },
});

export const createASubTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
    embedding: v.optional(v.array(v.float64())),
  },

  handler: async (
    ctx,
    {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    }
  ) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) {
        return null;
      }
      const newTaskId = await ctx.db.insert("subTodos", {
        userId,
        parentId,
        taskName,
        description,
        priority,
        dueDate,
        projectId,
        labelId,
        isCompleted: false,
        embedding,
      });
      return newTaskId;
    } catch (error) {
      console.log("Error in createASubTodo", error);
      return null;
    }
  },
});

export const createASubTodoAndEmbeddings = action({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
    embedding: v.optional(v.array(v.float64())),
  },

  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, parentId }
  ) => {
    const embedding = await getEmbeddingsWithAi(taskName);
    await ctx.runMutation(api.subTodos.createASubTodo, {
      parentId,
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      embedding,
    });

    console.log(embedding);
  },
});
