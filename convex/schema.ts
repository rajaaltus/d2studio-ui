import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Keep existing numbers table for compatibility
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  }).index("email", ["email"]),
  numbers: defineTable({
    value: v.number(),
  }),

  // Block registry management
  blocks: defineTable({
    name: v.string(),
    type: v.union(v.literal("ui"), v.literal("component")),
    title: v.string(),
    description: v.string(),
    author: v.string(),
    version: v.string(),
    categories: v.array(v.string()),
    registryDependencies: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    previewImage: v.optional(v.string()), // Temporarily optional for migration
    figmaUrl: v.optional(v.string()), // Temporarily optional for migration
    codeStatus: v.optional(v.union(v.literal("coming_soon"), v.literal("available"))), // Temporarily optional for migration
    codeUrl: v.optional(v.string()),
    blockType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_type", ["type"])
    .index("by_category", ["categories"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"])
    .index("by_blockType", ["blockType"])
    .index("by_codeStatus", ["codeStatus"]),

  // Download tracking events
  blockDownloads: defineTable({
    blockName: v.string(),
    blockType: v.union(v.literal("ui"), v.literal("component")),
    category: v.string(),
    downloadSource: v.union(
      v.literal("cli"),
      v.literal("api"),
      v.literal("website"),
      v.literal("direct"),
    ),
    userAgent: v.optional(v.string()),
    ipAddressHash: v.optional(v.string()), // Hashed for privacy
    referrer: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_block", ["blockName"])
    .index("by_timestamp", ["timestamp"])
    .index("by_category", ["category"])
    .index("by_source", ["downloadSource"])
    .index("by_block_timestamp", ["blockName", "timestamp"]),

  // Aggregated analytics for performance
  blockAnalytics: defineTable({
    blockName: v.string(),
    totalDownloads: v.number(),
    dailyDownloads: v.number(),
    weeklyDownloads: v.number(),
    monthlyDownloads: v.number(),
    lastDownloadAt: v.optional(v.number()),
    downloadTrend: v.string(), // "up", "down", "stable"
    popularityRank: v.optional(v.number()),
    lastUpdated: v.number(),
  })
    .index("by_block", ["blockName"])
    .index("by_total_downloads", ["totalDownloads"])
    .index("by_weekly", ["weeklyDownloads"])
    .index("by_monthly", ["monthlyDownloads"])
    .index("by_rank", ["popularityRank"])
    .index("by_last_updated", ["lastUpdated"]),

  // Block usage statistics
  blockStats: defineTable({
    blockName: v.string(),
    viewCount: v.number(),
    copyCount: v.number(),
    installCommandCopies: v.number(),
    previewInteractions: v.number(),
    averageTimeOnPage: v.optional(v.number()),
    bounceRate: v.optional(v.number()),
    lastViewedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_block", ["blockName"])
    .index("by_views", ["viewCount"])
    .index("by_copies", ["copyCount"])
    .index("by_updated", ["updatedAt"]),

  // Category performance analytics
  categoryAnalytics: defineTable({
    categoryName: v.string(),
    totalBlocks: v.number(),
    totalDownloads: v.number(),
    avgDownloadsPerBlock: v.number(),
    mostPopularBlock: v.optional(v.string()),
    trendingBlocks: v.array(v.string()),
    lastUpdated: v.number(),
  })
    .index("by_category", ["categoryName"])
    .index("by_total_downloads", ["totalDownloads"])
    .index("by_avg_downloads", ["avgDownloadsPerBlock"])
    .index("by_last_updated", ["lastUpdated"]),

  // Core Categories table
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"]),
});
