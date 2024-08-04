import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { getEmbeddingsWithAi } from "./openai";
import { handleUserId } from "./auth";
import { internal } from "./_generated/api";

export const fetchSearchResults = internalQuery({
  args: {
    results: v.array(v.object({ _id: v.id("todos"), _score: v.float64() })),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const result of args.results) {
      const todo = await ctx.db.get(result._id);
      if (!todo) {
        continue;
      }
      results.push({ ...todo });
    }
    return results;
  },
});

export const searchTasks = action({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const userId = await handleUserId(ctx);
    if (!userId) {
      return [];
    }

    const embedding = await getEmbeddingsWithAi(query);
    const results = await ctx.vectorSearch("todos", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userId", userId),
    });
    const rows: any = await ctx.runQuery(internal.search.fetchSearchResults, {
      results,
    });
    return rows;
  },
});
