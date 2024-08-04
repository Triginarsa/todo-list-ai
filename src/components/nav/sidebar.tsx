"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserProfile from "./user-profile";
import { primaryNavItems } from "@/utils";
import { Github, PlusIcon, Tag } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { use, useEffect, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddProjectDialog from "../projects/add-project-dialog";

interface MyListTitleType {
  [key: string]: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projectList = useQuery(api.projects.getProjects) ?? [];
  const LIST_OF_TITLE_IDS: MyListTitleType = {
    primary: "",
    projects: "My Projects",
  };
  const [navItems, setNavItems] = useState([...primaryNavItems]);

  const renderItems = (projectList: Array<Doc<"projects">>) => {
    return projectList.map(({ _id, name }, idx) => {
      return {
        ...(idx === 0 && { id: "projects" }),
        name,
        link: `/logged-in/projects/${_id.toString()}`,
        icon: <Tag className="w-4 h-4 text-primary" />,
      };
    });
  };

  useEffect(() => {
    if (projectList) {
      const projectItems = renderItems(projectList);
      const items = [...primaryNavItems, ...projectItems];
      setNavItems(items);
    }
  }, [projectList]);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 justify-between items-center border-b p-1 lg:h-[60px] lg:px-2">
          <UserProfile />
          {/* <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link> */}
        </div>

        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.id && (
                <div className="flex items-center mt-6 mb-2">
                  <p className="flex flex-1 text-base">
                    {LIST_OF_TITLE_IDS[item.id]}
                  </p>
                  {LIST_OF_TITLE_IDS[item.id] === "My Projects" && (
                    <AddProjectDialog />
                  )}
                </div>
              )}
              <Link
                key={index}
                href={item.link}
                className={cn(
                  "flex items-center gap-3 rounded-lg  px-3 py-2 transition-all hover:text-primary",
                  pathname === item.link
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Star on Github</CardTitle>
              <CardDescription>
                Show your support by starring this project on Github
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <a
                href="https://github.com/Triginarsa/todo-list-ai"
                target="_blank"
              >
                <Button size="sm" variant={"secondary"} className="w-full">
                  <Github className="w-4 h-4 mr-2 " />
                  Visit Github
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
