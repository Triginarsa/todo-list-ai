"use client";
import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Doc } from "../../../convex/_generated/dataModel";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "../ui/button";
import Todo from "../todos/todo";
import { AddTaskWrapper } from "./add-task-button";
import SuggestMissingTaskButton from "./suggest-missing-task-button";
import { toast } from "sonner";

type Details = {
  labelName: string;
  value: string | number | undefined;
  icon: React.JSX.Element;
};

export default function AddTaskDialog({ data }: { data: Doc<"todos"> }) {
  const { _id, taskName, description, dueDate, priority, projectId, labelId } =
    data;
  const project = useQuery(api.projects.getProjectByProjectId, {
    projectId: data.projectId,
  });

  const label = useQuery(api.labels.getLabelByLabelId, {
    labelId: data.labelId,
  });

  const inCompletedSubTodosByProject =
    useQuery(api.subTodos.inCompletedSubTodos, { parentId: _id }) ?? [];

  const completedSubTodosByProject =
    useQuery(api.subTodos.completedSubTodos, { parentId: _id }) ?? [];

  const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);

  const unCheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);

  const deleteATodoMutation = useMutation(api.todos.deleteATodo);

  const [todoDetails, setTodoDetails] = useState<Details[]>([]);

  useEffect(() => {
    const details = [
      {
        labelName: "Project",
        value: project?.name,
        icon: <Hash className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Due Date",
        value: format(data.dueDate || 0, "MMM dd yyyy"),
        icon: <Calendar className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Priority",
        value: data.priority,
        icon: <Flag className="w-4 h-4 text-primary" />,
      },
      {
        labelName: "Label",
        value: label?.name,
        icon: <Tag className="w-4 h-4 text-primary" />,
      },
    ];
    setTodoDetails(details);
  }, [data.dueDate, data.priority, label?.name, project]);

  const handleDeleteTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const deletedTodoId = deleteATodoMutation({ todoId: data._id });
    if (deletedTodoId! !== undefined) {
      toast("🗑️ Task Deleted!", {
        description: `Task has been deleted successfully.`,
      });
    }
  };

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader className="w-full">
        <DialogTitle> {data.taskName}</DialogTitle>
        <DialogDescription>
          <p className="my-2 capitalize">{data.description}</p>
          <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0">
            <div className="flex gap-1">
              <ChevronDown className="w-4 h-4 text-primary" />
              <p className="font-bold flex text-sm text-gray-900">Sub-Tasks</p>
            </div>
            <div>
              <SuggestMissingTaskButton
                projectId={data.projectId}
                parentId={data._id}
                taskName={data.taskName}
                description={data.description}
                isSubTask={true}
              />
            </div>
          </div>
          <div className="pl-4">
            {inCompletedSubTodosByProject.map((subTask, idx) => {
              return (
                <Todo
                  key={subTask._id}
                  data={subTask}
                  handleOnChange={() =>
                    checkASubTodoMutation({ subTodoId: subTask._id })
                  }
                  isCompleted={subTask.isCompleted}
                />
              );
            })}
          </div>
          <AddTaskWrapper parentTask={data} />
          <div className="pl-4">
            {completedSubTodosByProject.map((subTask, idx) => {
              return (
                <Todo
                  key={subTask._id}
                  data={subTask}
                  handleOnChange={() =>
                    unCheckASubTodoMutation({ subTodoId: subTask._id })
                  }
                  isCompleted={subTask.isCompleted}
                />
              );
            })}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 bg-gray-50 lg:w-1/2">
        {todoDetails.map((detail, idx) => (
          <div
            key={`${detail.value} - ${idx}`}
            className="grid gap-2 p-4 border-b 2 w-full"
          >
            <Label className="flex items-start">{detail.labelName}</Label>
            <div className="flex text-left items-center justify-start gap-2 pb-2">
              {detail.icon}
              <p className="text-sm">{detail.value} </p>
            </div>
          </div>
        ))}
        <div className="flex gap-2 p-4 w-full justify-end">
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <Button variant={"outline"} type="submit">
              <Trash2 className="w-4 h-4 text-rose-500" />
            </Button>
          </form>
        </div>
      </div>
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
