import React from "react";
import { useMutation } from "convex/react";
// import { useToast } from "../ui/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import Todo from "./todo";
import { toast } from "sonner";

export default function Todos({ items }: { items: Array<Doc<"todos">> }) {
  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ todoId: task._id });
    } else {
      checkATodo({ todoId: task._id });

      toast("✅ Task completed", {
        description: task.taskName,
        action: {
          label: "Undo",
          onClick: () => unCheckATodo({ todoId: task._id }),
        },
      });
    }
  };
  return items.map((task: Doc<"todos">, idx: number) => (
    <Todo
      key={task._id}
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChangeTodo(task)}
    />
  ));
}
