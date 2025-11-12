import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Action to bulk import blocks from registry data
export const importBlocksFromRegistry = action({
  args: {
    registryUrl: v.optional(v.string()),
  },
  returns: v.object({
    imported: v.number(),
    skipped: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const registryUrl = args.registryUrl ?? "https://d2studio.dev/registry.json";
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    try {
      // Fetch registry data (using fetch directly in action)
      const response = await fetch(registryUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch registry: ${response.status}`);
      }

      const registryData = await response.json();

      if (!registryData.items || !Array.isArray(registryData.items)) {
        throw new Error("Invalid registry format: missing items array");
      }

      // Process each item
      for (const item of registryData.items) {
        try {
          // Determine if block already exists
          const existing = await ctx.runQuery(api.blocks.getBlock, {
            name: item.name,
          });

          if (existing) {
            skipped++;
            continue;
          }

          // Map registry item to our block schema
          const blockType = item.type === "registry:ui" ? "ui" as const : "component" as const;
          const categories = Array.isArray(item.categories) ? item.categories : ["uncategorized"];

          await ctx.runMutation(api.blocks.createBlock, {
            name: item.name,
            type: blockType,
            title: item.title || item.name,
            description: item.description || "No description available",
            author: item.author || "D2 Studio",
            version: item.version || "1.0.0",
            categories,
            registryDependencies: item.registryDependencies,
            tags: item.tags,
            previewImage: item.previewImage || "/placeholder.svg",
            figmaUrl: item.figmaUrl || "https://www.figma.com",
            codeStatus: item.codeStatus || "coming_soon",
            codeUrl: item.codeUrl,
            blockType: item.blockType,
          });

          imported++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          errors.push(`Failed to import ${item.name}: ${errorMessage}`);
        }
      }

      return { imported, skipped, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Registry fetch failed: ${errorMessage}`);
      return { imported, skipped, errors };
    }
  },
});

// Sample data seeding for testing
export const seedSampleBlocks = mutation({
  args: {},
  returns: v.object({
    created: v.number(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const sampleBlocks = [
      {
        name: "comp-001",
        type: "component" as const,
        title: "Newsletter Form",
        description: "Simple newsletter subscription form with validation",
        author: "D2 Studio",
        version: "1.0.0",
        categories: ["forms", "marketing"],
        registryDependencies: ["input", "label", "button"],
        tags: ["newsletter", "subscription", "email"],
      },
      {
        name: "comp-010",
        type: "component" as const,
        title: "Hero Section",
        description: "Modern hero section with CTA buttons",
        author: "D2 Studio",
        version: "1.0.0",
        categories: ["marketing", "heroes"],
        registryDependencies: ["button", "card"],
        tags: ["hero", "landing", "cta"],
      },
      {
        name: "comp-020",
        type: "component" as const,
        title: "Contact Form",
        description: "Contact form with form validation",
        author: "D2 Studio",
        version: "1.0.0",
        categories: ["forms", "contact"],
        registryDependencies: ["input", "label", "button", "textarea"],
        tags: ["contact", "form", "validation"],
      },
      {
        name: "button",
        type: "ui" as const,
        title: "Button",
        description: "A button component with multiple variants",
        author: "shadcn",
        version: "1.0.0",
        categories: ["ui"],
        tags: ["button", "interactive"],
      },
      {
        name: "input",
        type: "ui" as const,
        title: "Input",
        description: "Form input component with validation states",
        author: "shadcn",
        version: "1.0.0",
        categories: ["ui", "forms"],
        tags: ["input", "form", "validation"],
      },
    ];

    let created = 0;
    const now = Date.now();

    for (const blockData of sampleBlocks) {
      // Check if block already exists
      const existing = await ctx.db
        .query("blocks")
        .withIndex("by_name", (q) => q.eq("name", blockData.name))
        .unique();

      if (!existing) {
        await ctx.db.insert("blocks", {
          ...blockData,
          previewImage: "/placeholder.svg",
          figmaUrl: "https://www.figma.com",
          codeStatus: "coming_soon",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });

        // Initialize analytics
        await ctx.db.insert("blockAnalytics", {
          blockName: blockData.name,
          totalDownloads: Math.floor(Math.random() * 100), // Random sample data
          dailyDownloads: Math.floor(Math.random() * 10),
          weeklyDownloads: Math.floor(Math.random() * 50),
          monthlyDownloads: Math.floor(Math.random() * 80),
          downloadTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
          lastUpdated: now,
        });

        // Initialize stats
        await ctx.db.insert("blockStats", {
          blockName: blockData.name,
          viewCount: Math.floor(Math.random() * 500),
          copyCount: Math.floor(Math.random() * 100),
          installCommandCopies: Math.floor(Math.random() * 80),
          previewInteractions: Math.floor(Math.random() * 200),
          updatedAt: now,
        });

        created++;
      }
    }

    return {
      created,
      message: `Created ${created} sample blocks with analytics data`,
    };
  },
});

// Update popularity ranks based on download counts
export const updatePopularityRanks = action({
  args: {},
  returns: v.object({
    updated: v.number(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get all analytics sorted by total downloads
    const allAnalytics = await ctx.runQuery(api.blocks.getPopularBlocks, {
      limit: 1000,
      timeframe: "total",
    });

    let updated = 0;

    for (let i = 0; i < allAnalytics.length; i++) {
      const analytics = allAnalytics[i];
      const newRank = i + 1;

      if (analytics.popularityRank !== newRank) {
        await ctx.runMutation(api.blocks.updateBlockAnalytics, {
          blockName: analytics.blockName,
        });
        updated++;
      }
    }

    return {
      updated,
      message: `Updated popularity ranks for ${updated} blocks`,
    };
  },
});