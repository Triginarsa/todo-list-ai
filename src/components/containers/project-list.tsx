"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Hash } from "lucide-react";

export default function ProjectList() {
  const projects = useQuery(api.projects.getProjects) ?? [];
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
      </div>
      <div className="flex flex-col gap-1 p-4">
        {projects?.map((project) => (
          <Link key={project._id} href={`/logged-in/projects/${project._id}`}>
            <div className="flex items-center justify-between p-2 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <Hash className="w-6 h-6 text-primary" />
                <span>{project.name}</span>
              </div>
              <div className="flex items-center gap-2"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
