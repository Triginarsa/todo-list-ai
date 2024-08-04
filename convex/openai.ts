import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { Id } from "./_generated/dataModel";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export const suggestMissingTasksWithAi = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    // retrieve todos from the database
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId: projectId,
    });

    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId: projectId,
    });

    const projectName = project?.name || "";

    // retrieve todos from openai
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager expert, and I need your help to identify missing tasks. I have a list of existing tasks in JSON format, containing objects with 'taskName', and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional tasks that are missing from the list? Please provide these missing tasks in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing tasks and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
          }),
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

    const todosAI = JSON.parse(messageContent)?.todos ?? [];
    const AI_LABEL_ID: Id<"labels"> =
      "jx76ne8482zffsgaj625m0gjzx6xd5mn" as Id<"labels">;
    for (const todoAI of todosAI) {
      const { taskName, description } = todoAI;
      const embedding = await getEmbeddingsWithAi(taskName);
      await ctx.runMutation(api.todos.createATodo, {
        projectId,
        taskName,
        description,
        priority: 3,
        dueDate: new Date().getTime(),
        labelId: AI_LABEL_ID,
        embedding,
      });
    }
  },
});

export const suggestMissingSubTasksWithAi = action({
  args: {
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    taskName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { projectId, parentId, taskName, description }) => {
    // retrieve todos from the database
    const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
      parentId: parentId,
    });

    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId: projectId,
    });

    const projectName = project?.name || "";

    // retrieve todos from openai
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager expert, and I need your help to identify missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName', and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional sub tasks that are not yet included in this list? Please provide these missing tasks in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing tasks and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
            ...{ parentTodo: { taskName, description } },
          }),
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

    const todosAI = JSON.parse(messageContent)?.todos ?? [];
    const AI_LABEL_ID: Id<"labels"> =
      "jx76ne8482zffsgaj625m0gjzx6xd5mn" as Id<"labels">;
    for (const todoAI of todosAI) {
      const { taskName, description } = todoAI;
      const embedding = await getEmbeddingsWithAi(taskName);
      await ctx.runMutation(api.subTodos.createASubTodo, {
        projectId,
        parentId: parentId,
        taskName,
        description,
        priority: 3,
        dueDate: new Date().getTime(),
        labelId: AI_LABEL_ID,
        embedding,
      });
    }
  },
});

export const getEmbeddingsWithAi = async (searchText: string) => {
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const req = {
    input: searchText,
    model: "text-embedding-ada-002",
    encoding_format: "float",
  };

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Failed to fetch embeddings, ${msg}`);
  }

  const json = await response.json();
  const vector = json["data"][0]["embedding"];

  console.log(`Embedding of ${searchText}: ${vector.length} dimensions`);

  return vector;
};
