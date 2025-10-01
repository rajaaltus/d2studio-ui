"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function ServerPage() {
  const data = useQuery(api.myFunctions.listNumbers, { count: 3 });
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (!data) {
    return (
      <main className="p-8 flex flex-col gap-4 mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-center">Convex + Next.js</h1>
        <div className="flex items-center justify-center p-8">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 flex flex-col gap-4 mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold text-center">Convex + Next.js</h1>
      <div className="flex flex-col gap-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold">Client-loaded data</h2>
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      </div>
      <Button
        onClick={() => {
          void addNumber({ value: Math.floor(Math.random() * 10) });
        }}
      >
        Add a random number
      </Button>
    </main>
  );
}
