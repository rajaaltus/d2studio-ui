import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";

export type DashboardStats = FunctionReturnType<typeof api.blocks.getDashboardStats>;

export type TopBlock = {
  name: string;
  downloads: number;
  trend: string;
};

export type TopCategory = {
  category: string;
  downloads: number;
};