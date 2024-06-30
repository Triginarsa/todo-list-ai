"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddTaskInline from "./add-task-inline";

export const AddTaskWrapper = () => {
  const [showAddTask, setShowAddTask] = useState(false);

  return showAddTask ? (
    <AddTaskInline setShowAddTask={setShowAddTask} />
  ) : (
    <AddTaskButton onClick={() => setShowAddTask(true)} />
  );
};

export default function AddTaskButton({
  onClick,
}: {
  onClick: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div>
      <Button
        variant="ghost"
        className="pl-2 flex mt-2 flex-1 group"
        onClick={onClick}
      >
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4 text-primary group-hover:bg-primary group-hover:rounded-full group-hover:text-white" />
            <span className="text-base font-light tracking-tight text-foreground/70">
              Add Task
            </span>
          </div>
        </div>
      </Button>
    </div>
  );
}
