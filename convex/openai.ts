import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const suggestMissingTasksWithAi = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    // retrieve todos from the database
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId: projectId,
    });

    // retrieve todos from openai
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager expert, and I need your help to identify missing tasks. I have a list of existing tasks in JSON format, containing objects with 'taskName', and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional tasks that are missing from the list? Plrease provide these missing tasks in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing tasks and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify(todos),
        },
      ],
      response_format: {
        type: "json_object",
      },
    });
    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;

    console.log({ messageContent });

    if (!messageContent) {
      return [];
    }

    const items = JSON.parse(messageContent)?.todos ?? [];
    const AI_LABEL_ID: Id<"labels"> =
      "jx76ne8482zffsgaj625m0gjzx6xd5mn" as Id<"labels">;
    for (const item of items) {
      const { taskName, description } = item;
      await ctx.runMutation(api.todos.createATodo, {
        projectId,
        taskName,
        description,
        priority: 3,
        dueDate: new Date().getTime(),
        labelId: AI_LABEL_ID,
      });
    }
  },
});
