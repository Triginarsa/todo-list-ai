"use client";
import { useAction } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import Sidebar from "@/components/nav/sidebar";
import MobileNavbar from "@/components/nav/mobile-navbar";
import Todos from "@/components/todos/todos";
import { Doc } from "../../../../../convex/_generated/dataModel";

export default function Search() {
  const { searchQuery } = useParams<{ searchQuery: string }>();

  const [searchResults, setSearchResults] = useState<Doc<"todos">[]>([]);
  const [searchInProgress, setSearchInProgress] = useState(false);

  const vectorSearch = useAction(api.search.searchTasks);

  console.log({ searchQuery });

  useEffect(() => {
    const handleSearch = async () => {
      setSearchResults([]);
      setSearchInProgress(true);
      try {
        const results = await vectorSearch({ query: searchQuery });
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching", error);
      } finally {
        setSearchInProgress(false);
      }
    };

    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, vectorSearch]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">
                Search results for{" "}
                <span className="font-bold">
                  {`"`}
                  {decodeURI(searchQuery)}
                  {`"`}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-1 p-4">
              {searchInProgress ? (
                <div>Loading...</div>
              ) : (
                <>
                  {searchResults.length === 0 ? (
                    <div>No results found</div>
                  ) : (
                    <Todos
                      items={searchResults.filter(
                        (item: any) => item.isCompleted === false
                      )}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
