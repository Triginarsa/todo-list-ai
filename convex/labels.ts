import { query } from "./_generated/server";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("labels").collect();
  },
});
