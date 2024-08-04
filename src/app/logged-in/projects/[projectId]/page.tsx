"use client";
import { AddTaskWrapper } from "@/components/add-task/add-task-button";
import SuggestMissingTaskButton from "@/components/add-task/suggest-missing-task-button";
import MobileNavbar from "@/components/nav/mobile-navbar";
import Sidebar from "@/components/nav/sidebar";
import CompletedTodos from "@/components/todos/completed-todos";
import Todos from "@/components/todos/todos";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import DeleteProject from "@/components/projects/delete-project";

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
  // if (
  //   !inCompletedTodosByProject ||
  //   !completedTodosByProject ||
  //   !todosTotalByProject
  // ) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNavbar navTitle={"My Projects"} navLink="/logged-in/projects" />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">
                {projectName || "Project"}
              </h1>
              <div className="flex gap-6 lg:gap-12 items-center">
                <div className="flex flex-row gap-4 mt-4">
                  <SuggestMissingTaskButton projectId={projectId} />
                  <DeleteProject projectId={projectId} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <Todos items={inCompletedTodosByProject} />
            </div>
            <AddTaskWrapper projectId={projectId} />
            <div className="flex flex-col gap-1 p-4">
              <Todos items={completedTodosByProject} />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <CompletedTodos totalTodos={todosTotalByProject} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
