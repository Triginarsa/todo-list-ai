import Task from "@/components/main/task";
import UserProfile from "@/components/main/user-profile";
import { Button } from "@/components/ui/button";
import React from "react";

export default function LoggedInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>todolist</h1>
      <UserProfile />
      <Task />
    </main>
  );
}
