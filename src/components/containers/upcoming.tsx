"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AddTaskWrapper } from "../add-task/add-task-button";
import Todos from "../todos/todos";
import { Dot } from "lucide-react";
import moment from "moment";

export default function Upcoming() {
  const groupedTodos = useQuery(api.todos.groupTodosByDate) ?? [];
  const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

  if (!groupedTodos || !overdueTodos) {
    return <div>Loading...</div>;
  }
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="font-bold flex text-sm">Overdue</p>
        <Todos showDetails={true} items={overdueTodos} />
        <AddTaskWrapper />
      </div>
      <div className="flex flex-col gap-1 p-4">
        {Object.keys(groupedTodos).length === 0 ? (
          <div className="text-center text-foreground/70">
            No tasks for today
          </div>
        ) : (
          Object.entries(groupedTodos).map(([date]) => (
            <div key={date} className="flex flex-col gap-1">
              <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
                {moment(date).format("LL")}
                <Dot className="w-4 h-4 text-primary" />
                {moment(date).format("dddd")}
              </p>
              <ul>
                <Todos items={groupedTodos[date]} />
                <AddTaskWrapper />
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
