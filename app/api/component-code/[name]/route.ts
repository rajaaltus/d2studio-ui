import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import registryData from "@/registry.json";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;

    // Find the component in registry
    const component = registryData.items.find(
      (item) => item.name === name && item.type === "registry:component",
    );

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }

    // Get the file path from registry
    const componentFile = component.files?.find(
      (file) => file.type === "registry:component",
    );

    if (!componentFile) {
      return NextResponse.json(
        { error: "Component file not found" },
        { status: 404 },
      );
    }

    // Read the file content
    const filePath = join(process.cwd(), componentFile.path);
    const code = await readFile(filePath, "utf-8");

    return NextResponse.json({
      code,
      name: component.name,
      title: component.title,
      description: component.description,
    });
  } catch (error) {
    console.error("Error fetching component code:", error);
    return NextResponse.json(
      { error: "Failed to fetch component code" },
      { status: 500 },
    );
  }
}
