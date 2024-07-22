"use client";
import Today from "@/components/containers/today";
import MobileNavbar from "@/components/nav/mobile-navbar";
import Sidebar from "@/components/nav/sidebar";
import TodoList from "@/components/todos/todo-list";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import Todos from "@/components/todos/todos";
import { AddTaskWrapper } from "@/components/add-task/add-task-button";
import CompletedTodos from "@/components/todos/completed-todos";

export default function ProjectIdPage() {
  const { projectId } = useParams<{
    projectId: Id<"projects">;
  }>();
  const inCompletedTodosByProject =
    useQuery(api.todos.getInCompletedTodosByProjectId, { projectId }) ?? [];
  const completedTodosByProject =
    useQuery(api.todos.getCompletedTodosByProjectId, { projectId }) ?? [];
  const todosTotalByProject =
    useQuery(api.todos.getTodosTotalByProjectId, { projectId }) ?? 0;

  const project = useQuery(api.projects.getProjectByProjectId, { projectId });
  const projectName = project?.name ?? "Untitled Project";
  if (
    !inCompletedTodosByProject ||
    !completedTodosByProject ||
    !todosTotalByProject
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">{projectName}</h1>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <Todos items={inCompletedTodosByProject} />
          </div>
          <AddTaskWrapper />
          <div className="flex flex-col gap-1 p-4">
            <Todos items={completedTodosByProject} />
          </div>
          <div className="flex flex-col gap-1 p-4">
            <CompletedTodos totalTodos={todosTotalByProject} />
          </div>
        </main>
      </div>
    </div>
  );
}
