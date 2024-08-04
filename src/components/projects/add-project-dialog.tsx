"use client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

export default function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger id="closeDialog">
        <PlusIcon className="w-4 h-4 text-primary" />
      </DialogTrigger>
      <AddProjectDialogContent />
    </Dialog>
  );
}

function AddProjectDialogContent() {
  const form = useForm({ defaultValues: { name: "" } });
  const router = useRouter();

  const createAProject = useMutation(api.projects.createAProject);

  const onSubmit = async ({ name }: any) => {
    if (!name) {
      return;
    }
    try {
      const projectId = await createAProject({ name });
      if (projectId !== undefined) {
        toast("🚀 Successfully Created a New Project!", {
          description: `Project ${name} has been created successfully.`,
        });
        form.reset({ name: "" });
        router.push(`/logged-in/projects/${projectId}`);
      }
    } catch (error) {
      console.error(error);
      toast("🚨 Failed to Create a New Project", {
        description: `Failed to create a project ${name}.`,
      });
      form.reset({ name: "" });
    }
  };

  return (
    <DialogContent className="max-w-xl h-fit flex flex-col text-right">
      <DialogHeader className="w-full">
        <DialogTitle>Add a Project</DialogTitle>
      </DialogHeader>
      <DialogDescription className="capitalize text-start w-full">
        Enter the name of the project you want to create.
      </DialogDescription>
      <Form {...form}>
        <form
          className="flex gap-4 flex-col p-4 justify-end w-full border rounded-md"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Project name..."
                    className="w-full border-0 text-lg appearance-none bg-background pl-8 shadow-none h-10"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="hover:bg-orange-600 px-4">Add</Button>
        </form>
      </Form>
    </DialogContent>
  );
}
