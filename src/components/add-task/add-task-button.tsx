"use client";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import AddTaskInline from "./add-task-inline";

export const AddTaskWrapper = ({
  parentTask,
}: {
  parentTask?: Doc<"todos">;
}) => {
  const [showAddTask, setShowAddTask] = useState(false);

  return showAddTask ? (
    <AddTaskInline setShowAddTask={setShowAddTask} parentTask={parentTask} />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add Sub Task" : "Add Task"}
    />
  );
};

export default function AddTaskButton({
  onClick,
  title,
}: {
  onClick: Dispatch<SetStateAction<any>>;
  title: string;
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
              {title}
            </span>
          </div>
        </div>
      </Button>
    </div>
  );
}
