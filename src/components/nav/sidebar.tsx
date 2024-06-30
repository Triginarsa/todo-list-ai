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
import { Github } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <UserProfile />
          {/* <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link> */}
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {primaryNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center gap-3 rounded-lg  px-3 py-2 transition-all hover:text-primary"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
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
