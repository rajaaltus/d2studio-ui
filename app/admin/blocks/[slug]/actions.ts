"use server";

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function buildRegistryAction(block: {
    name: string;
    type: "ui" | "component";
    title: string;
    description: string;
    author: string;
    categories: string[];
    registryDependencies?: string[];
}) {
    if (process.env.NODE_ENV !== "development") {
        return {
            success: false,
            error: "Registry build is only available in development environment.",
        };
    }

    try {
        // 1. Sync block metadata with registry.json
        const registryPath = path.join(process.cwd(), "registry.json");
        const registryContent = await fs.readFile(registryPath, "utf-8");
        const registry = JSON.parse(registryContent);

        const registryType = `registry:${block.type}`;
        const filePath = block.type === "ui"
            ? `registry/default/ui/${block.name}.tsx`
            : `registry/default/components/${block.name}.tsx`;

        const newItem = {
            name: block.name,
            type: registryType,
            title: block.title,
            description: block.description,
            author: block.author,
            registryDependencies: block.registryDependencies || [],
            files: [
                {
                    path: filePath,
                    type: registryType
                }
            ],
            categories: block.categories
        };

        // Check if item already exists
        const existingItemIndex = registry.items.findIndex((item: any) => item.name === block.name);

        if (existingItemIndex > -1) {
            // Update existing item
            registry.items[existingItemIndex] = newItem;
        } else {
            // Add new item
            registry.items.push(newItem);
        }

        // Save updated registry.json
        await fs.writeFile(registryPath, JSON.stringify(registry, null, 2), "utf-8");

        // 2. Run the build command defined in package.json
        const { stdout, stderr } = await execAsync("npm run build:registry");

        // Optional: Check if build actually produced anything or if no files were found
        if (stdout.includes("0 components") || stdout.includes("No components found")) {
            return {
                success: false,
                output: stdout,
                error: "The build completed but found no components. Did you create the file in the correct registry folder?",
            };
        }

        return {
            success: true,
            output: stdout,
            error: stderr,
        };
    } catch (error: any) {
        return {
            success: false,
            output: error.stdout || "",
            error: error.stderr || error.message || "An unknown error occurred during build",
        };
    }
}
