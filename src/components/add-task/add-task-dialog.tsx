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
import { Calendar, Flag, Hash, Tag } from "lucide-react";
import { format } from "date-fns";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

type Details = {
  labelName: string;
  value: string | number | undefined;
  icon: React.JSX.Element;
};

export default function AddTaskDialog({ data }: { data: Doc<"todos"> }) {
  const project = useQuery(api.projects.getProjectByProjectId, {
    projectId: data.projectId,
  });

  const label = useQuery(api.labels.getLabelByLabelId, {
    labelId: data.labelId,
  });

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

  return (
    <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
      <DialogHeader>
        <DialogTitle> {data.taskName}</DialogTitle>
        <DialogDescription>{data.description}</DialogDescription>
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
      </div>
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
