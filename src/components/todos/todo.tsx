import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Doc } from "../../../convex/_generated/dataModel";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { GitBranch, Calendar } from "lucide-react";
import moment from "moment";
import AddTaskDialog from "../add-task/add-task-dialog";

type Props = {
  data: Doc<"todos"> | Doc<"subTodos">;
  isCompleted?: boolean;
  handleOnChange: any;
  showDetails?: boolean;
};

function isSubTodo(
  data: Doc<"todos"> | Doc<"subTodos">
): data is Doc<"subTodos"> {
  return "parentId" in data;
}

function Todo({
  data,
  isCompleted,
  handleOnChange,
  showDetails = false,
}: Props) {
  return (
    <div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <Checkbox
              id="todo"
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
              checked={isCompleted}
              onCheckedChange={handleOnChange}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {data.taskName}
                </button>
                {showDetails && (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-1">
                      <GitBranch className="w-3 h-3 text-foreground/70" />
                      <p className="text-xs text-foreground/70"></p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary">
                        {moment(data.dueDate).format("LL")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
          </div>
          {!isSubTodo(data) && <AddTaskDialog data={data} />}
          {/* {!data?.parentId && <AddTaskDialog data={data} />} */}
        </div>
      </Dialog>
    </div>
  );
}

export default Todo;
