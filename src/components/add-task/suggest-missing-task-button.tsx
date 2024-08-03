import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  projectId: Id<"projects">;
  isSubTask?: boolean;
  taskName?: string;
  description?: string;
  parentId: Id<"todos">;
};

export default function SuggestMissingTaskButton({
  projectId,
  isSubTask = false,
  taskName = "",
  description = "",
  parentId,
}: Props) {
  const [isLoadingSuggestMissingTask, setIsLoadingSuggestMissingTask] =
    React.useState(false);

  const suggestMissingTasks =
    useAction(api.openai.suggestMissingTasksWithAi) ?? [];

  const suggestMissingSubTasks =
    useAction(api.openai.suggestMissingSubTasksWithAi) ?? [];

  const handleSuggestMissingTask = async () => {
    setIsLoadingSuggestMissingTask(true);
    try {
      await suggestMissingTasks({ projectId });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSuggestMissingTask(false);
    }
  };

  const handleSuggestMissingSubTask = async () => {
    setIsLoadingSuggestMissingTask(true);
    try {
      await suggestMissingSubTasks({
        projectId,
        taskName,
        description,
        parentId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSuggestMissingTask(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        onClick={
          isSubTask ? handleSuggestMissingSubTask : handleSuggestMissingTask
        }
        disabled={isLoadingSuggestMissingTask}
      >
        {isLoadingSuggestMissingTask ? (
          <div className="flex items-center gap-2">
            <span>Loading...</span>
            <Loader className="w-6 h-6 text-primary" />
          </div>
        ) : (
          "Suggest Missing Tasks (AI)"
        )}
      </Button>
    </>
  );
}
