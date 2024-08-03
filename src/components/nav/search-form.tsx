"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Search, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const form = useForm();
  const router = useRouter();

  const onSubmit = async ({ searchText }: any) => {
    console.log("submitted", { searchText });
    router.push(`/logged-in/search?q=${searchText}`);
  };

  return (
    <Form {...form}>
      <form
        className="lg:flex lg:items-center justify-end w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex gap-2 items-center w-full">
          <Search className="absolute left-2 w-5 h-5 text-foreground/60" />
          <FormField
            control={form.control}
            name="searchText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="searchText"
                    type="search"
                    required
                    placeholder="Search tasks..."
                    className="w-full appearance-none bg-background pl-8 shadow-none h-10"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="hover:bg-orange-600 px-4">
            <SearchIcon className="w-5 h-5 text-white" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
