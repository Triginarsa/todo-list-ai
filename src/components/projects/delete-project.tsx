"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";

export default function DeleteProject({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const form = useForm();
  const router = useRouter();

  const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

  const onSubmit = async () => {
    if (projectId === GET_STARTED_PROJECT_ID) {
      toast("🚨 Cannot delete the Project", {
        description: `System project are not allowed to be deleted.`,
      });
      return;
    }

    try {
      const projectIdDelete = await deleteProject({ projectId });
      if (projectIdDelete !== undefined) {
        toast("🗑️ Project Deleted!", {
          description: `Project has been deleted successfully.`,
        });
        router.push(`/logged-in/projects`);
      }
    } catch (error) {
      console.error(error);
      toast("🚨 Failed to delete the Project", {
        description: `Failed to delete the project.`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="w-5 h-5 text-foreground hover:cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <button
              type="submit"
              className="flex items-center w-full p-2 text-left text-sm text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
