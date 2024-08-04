"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon, Text } from "lucide-react";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { GET_STARTED_PROJECT_ID } from "@/utils";

const FormSchema = z.object({
  taskName: z.string().min(2, { message: "Task name is too short" }),
  description: z.string().optional(),
  priority: z.string().min(1, { message: "Priority is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  projectId: z.string().min(2, { message: "Project ID is required" }),
  labelId: z.string().min(2, { message: "Label ID is required" }),
});

export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: MyProjectId,
}: {
  setShowAddTask: Dispatch<SetStateAction<boolean>>;
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) {
  const projectId =
    MyProjectId ||
    parentTask?.projectId ||
    (GET_STARTED_PROJECT_ID as Id<"projects">);
  const labelId =
    parentTask?.labelId || ("jx71gafy5py7cak8q8mem7xetn6w144y" as Id<"labels">);
  const priority = parentTask?.priority?.toString() || "3";
  const parentId = parentTask?._id;
  const projects = useQuery(api.projects.getProjects) ?? [];
  const labels = useQuery(api.labels.getLabels) ?? [];

  // without using embedded
  // const createATodoMutation = useMutation(api.todos.createATodo);
  // const createASubTodoMutation = useMutation(api.subTodos.createASubTodo);

  // with using embedded
  const createASubTodoEmbeddings = useAction(
    api.subTodos.createASubTodoAndEmbeddings
  );
  const createTodoEmbeddings = useAction(api.todos.createTodoAndEmbeddings);

  const defaultValues = {
    taskName: "",
    description: "",
    priority,
    dueDate: new Date(),
    projectId,
    labelId,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: "",
      description: "",
      priority,
      dueDate: new Date(),
      projectId,
      labelId: "jx71gafy5py7cak8q8mem7xetn6w144y" as Id<"labels">,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { taskName, description, priority, dueDate, projectId, labelId } =
      data;

    if (projectId) {
      if (parentId) {
        const mutationId = createASubTodoEmbeddings({
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
          parentId: parentId as Id<"todos">,
        });
        if (mutationId !== undefined) {
          toast("✅ Create a Sub Task!", {
            description: taskName,
          });
          form.reset({ ...defaultValues });
        }
      } else {
        const mutationId = createTodoEmbeddings({
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });
        if (mutationId !== undefined) {
          toast("✅ Create a Task!", {
            description: taskName,
          });
          form.reset({ ...defaultValues });
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full space-y-2 p-2 my-2 rounded-xl pt-4">
          <CardContent>
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0 ring-0 border-0 border-border/0 rounded-none font-semibold text-lg"
                      id="taskName"
                      placeholder="Enter your Task name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-start gap-2">
                      <Text className="w-4 h-4 ml-3 mt-3 opacity-50" />
                      <Textarea
                        className="focus-visible:ring-0 ring-0 border-0 border-border/0 rounded-none resize-none"
                        placeholder="Enter your Task name"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "flex flex-gap 2 w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Highest</SelectItem>
                        <SelectItem value="2">Hight</SelectItem>
                        <SelectItem value="3">Medium</SelectItem>
                        <SelectItem value="4">Low</SelectItem>
                        <SelectItem value="5">Lowest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="labelId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={labelId || field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {labels.map((label: Doc<"labels">, idx) => (
                          <SelectItem key={idx} value={label._id}>
                            {label?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col gap-4 lg:flex-row justify-between">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="w-full lg:w-[300px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={projectId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project: Doc<"projects">, idx) => (
                        <SelectItem key={idx} value={project._id}>
                          {project?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 w-full md:gap-2 md:self-end md:justify-end">
              <Button
                className="w-full md:w-fit"
                variant="secondary"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full md:w-fit"
                variant="default"
                type="submit"
              >
                Add Task
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
