import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Block Management Functions

export const createBlock = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("ui"), v.literal("component")),
    title: v.string(),
    description: v.string(),
    author: v.string(),
    version: v.string(),
    categories: v.array(v.string()),
    registryDependencies: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id("blocks"),
  handler: async (ctx, args) => {
    const existingBlock = await ctx.db
      .query("blocks")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existingBlock) {
      throw new Error(`Block with name "${args.name}" already exists`);
    }

    const now = Date.now();
    const blockId = await ctx.db.insert("blocks", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize analytics for new block
    await ctx.db.insert("blockAnalytics", {
      blockName: args.name,
      totalDownloads: 0,
      dailyDownloads: 0,
      weeklyDownloads: 0,
      monthlyDownloads: 0,
      downloadTrend: "stable",
      lastUpdated: now,
    });

    // Initialize stats for new block
    await ctx.db.insert("blockStats", {
      blockName: args.name,
      viewCount: 0,
      copyCount: 0,
      installCommandCopies: 0,
      previewInteractions: 0,
      updatedAt: now,
    });

    return blockId;
  },
});

export const getBlock = query({
  args: { name: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blocks"),
      _creationTime: v.number(),
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
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blocks")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
  },
});

export const listBlocks = query({
  args: {
    type: v.optional(v.union(v.literal("ui"), v.literal("component"))),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("blocks"),
      _creationTime: v.number(),
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
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("blocks")
      .withIndex("by_active", (q) => q.eq("isActive", true));

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    // Note: Category filtering can be added later with proper index support
    // if (args.category) {
    //   query = query.filter((q) => q.field("categories").includes(args.category));
    // }

    const limit = args.limit ?? 50;
    return await query.order("desc").take(limit);
  },
});

// Analytics Functions

export const trackDownload = mutation({
  args: {
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
    ipAddressHash: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  returns: v.id("blockDownloads"),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Record the download event
    const downloadId = await ctx.db.insert("blockDownloads", {
      ...args,
      timestamp: now,
    });

    // Update analytics asynchronously
    await ctx.scheduler.runAfter(0, api.blocks.updateBlockAnalytics, {
      blockName: args.blockName,
    });

    return downloadId;
  },
});

export const updateBlockAnalytics = mutation({
  args: { blockName: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get download counts
    const totalDownloads = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block", (q) => q.eq("blockName", args.blockName))
      .collect()
      .then((downloads) => downloads.length);

    const dailyDownloads = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block_timestamp", (q) =>
        q.eq("blockName", args.blockName).gte("timestamp", oneDayAgo),
      )
      .collect()
      .then((downloads) => downloads.length);

    const weeklyDownloads = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block_timestamp", (q) =>
        q.eq("blockName", args.blockName).gte("timestamp", oneWeekAgo),
      )
      .collect()
      .then((downloads) => downloads.length);

    const monthlyDownloads = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block_timestamp", (q) =>
        q.eq("blockName", args.blockName).gte("timestamp", oneMonthAgo),
      )
      .collect()
      .then((downloads) => downloads.length);

    const lastDownload = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block_timestamp", (q) => q.eq("blockName", args.blockName))
      .order("desc")
      .first();

    // Calculate trend (simplified)
    const previousWeekStart = oneWeekAgo - 7 * 24 * 60 * 60 * 1000;
    const previousWeekDownloads = await ctx.db
      .query("blockDownloads")
      .withIndex("by_block_timestamp", (q) =>
        q
          .eq("blockName", args.blockName)
          .gte("timestamp", previousWeekStart)
          .lt("timestamp", oneWeekAgo),
      )
      .collect()
      .then((downloads) => downloads.length);

    let downloadTrend = "stable";
    if (weeklyDownloads > previousWeekDownloads * 1.1) {
      downloadTrend = "up";
    } else if (weeklyDownloads < previousWeekDownloads * 0.9) {
      downloadTrend = "down";
    }

    // Update or create analytics record
    const existingAnalytics = await ctx.db
      .query("blockAnalytics")
      .withIndex("by_block", (q) => q.eq("blockName", args.blockName))
      .unique();

    if (existingAnalytics) {
      await ctx.db.patch(existingAnalytics._id, {
        totalDownloads,
        dailyDownloads,
        weeklyDownloads,
        monthlyDownloads,
        lastDownloadAt: lastDownload?.timestamp,
        downloadTrend,
        lastUpdated: now,
      });
    } else {
      await ctx.db.insert("blockAnalytics", {
        blockName: args.blockName,
        totalDownloads,
        dailyDownloads,
        weeklyDownloads,
        monthlyDownloads,
        lastDownloadAt: lastDownload?.timestamp,
        downloadTrend,
        lastUpdated: now,
      });
    }

    return null;
  },
});

export const getBlockAnalytics = query({
  args: { blockName: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blockAnalytics"),
      _creationTime: v.number(),
      blockName: v.string(),
      totalDownloads: v.number(),
      dailyDownloads: v.number(),
      weeklyDownloads: v.number(),
      monthlyDownloads: v.number(),
      lastDownloadAt: v.optional(v.number()),
      downloadTrend: v.string(),
      popularityRank: v.optional(v.number()),
      lastUpdated: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blockAnalytics")
      .withIndex("by_block", (q) => q.eq("blockName", args.blockName))
      .unique();
  },
});

export const getPopularBlocks = query({
  args: {
    limit: v.optional(v.number()),
    timeframe: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("total"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("blockAnalytics"),
      _creationTime: v.number(),
      blockName: v.string(),
      totalDownloads: v.number(),
      dailyDownloads: v.number(),
      weeklyDownloads: v.number(),
      monthlyDownloads: v.number(),
      lastDownloadAt: v.optional(v.number()),
      downloadTrend: v.string(),
      popularityRank: v.optional(v.number()),
      lastUpdated: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const timeframe = args.timeframe ?? "total";

    switch (timeframe) {
      case "daily":
        return await ctx.db
          .query("blockAnalytics")
          .withIndex("by_total_downloads")
          .order("desc")
          .take(limit);
      case "weekly":
        return await ctx.db
          .query("blockAnalytics")
          .withIndex("by_weekly")
          .order("desc")
          .take(limit);
      case "monthly":
        return await ctx.db
          .query("blockAnalytics")
          .withIndex("by_monthly")
          .order("desc")
          .take(limit);
      case "total":
      default:
        return await ctx.db
          .query("blockAnalytics")
          .withIndex("by_total_downloads")
          .order("desc")
          .take(limit);
    }
  },
});

export const trackBlockInteraction = mutation({
  args: {
    blockName: v.string(),
    interactionType: v.union(
      v.literal("view"),
      v.literal("copy"),
      v.literal("install_copy"),
      v.literal("preview"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingStats = await ctx.db
      .query("blockStats")
      .withIndex("by_block", (q) => q.eq("blockName", args.blockName))
      .unique();

    if (existingStats) {
      const updates: any = { updatedAt: now };

      switch (args.interactionType) {
        case "view":
          updates.viewCount = existingStats.viewCount + 1;
          updates.lastViewedAt = now;
          break;
        case "copy":
          updates.copyCount = existingStats.copyCount + 1;
          break;
        case "install_copy":
          updates.installCommandCopies = existingStats.installCommandCopies + 1;
          break;
        case "preview":
          updates.previewInteractions = existingStats.previewInteractions + 1;
          break;
      }

      await ctx.db.patch(existingStats._id, updates);
    } else {
      // Create new stats record
      const initialStats = {
        blockName: args.blockName,
        viewCount: args.interactionType === "view" ? 1 : 0,
        copyCount: args.interactionType === "copy" ? 1 : 0,
        installCommandCopies: args.interactionType === "install_copy" ? 1 : 0,
        previewInteractions: args.interactionType === "preview" ? 1 : 0,
        lastViewedAt: args.interactionType === "view" ? now : undefined,
        updatedAt: now,
      };

      await ctx.db.insert("blockStats", initialStats);
    }

    return null;
  },
});

export const getBlockStats = query({
  args: { blockName: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blockStats"),
      _creationTime: v.number(),
      blockName: v.string(),
      viewCount: v.number(),
      copyCount: v.number(),
      installCommandCopies: v.number(),
      previewInteractions: v.number(),
      averageTimeOnPage: v.optional(v.number()),
      bounceRate: v.optional(v.number()),
      lastViewedAt: v.optional(v.number()),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blockStats")
      .withIndex("by_block", (q) => q.eq("blockName", args.blockName))
      .unique();
  },
});

// Dashboard and Reporting Functions

export const getDashboardStats = query({
  args: {},
  returns: v.object({
    totalBlocks: v.number(),
    totalDownloads: v.number(),
    downloadsToday: v.number(),
    downloadsThisWeek: v.number(),
    topBlocks: v.array(
      v.object({
        name: v.string(),
        downloads: v.number(),
        trend: v.string(),
      }),
    ),
    topCategories: v.array(
      v.object({
        category: v.string(),
        downloads: v.number(),
      }),
    ),
  }),
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get total blocks count
    const totalBlocks = await ctx.db
      .query("blocks")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect()
      .then((blocks) => blocks.length);

    // Get total downloads
    const allDownloads = await ctx.db.query("blockDownloads").collect();
    const totalDownloads = allDownloads.length;

    // Get today's downloads
    const downloadsToday = allDownloads.filter(
      (d) => d.timestamp >= oneDayAgo,
    ).length;

    // Get this week's downloads
    const downloadsThisWeek = allDownloads.filter(
      (d) => d.timestamp >= oneWeekAgo,
    ).length;

    // Get top blocks
    const analytics = await ctx.db
      .query("blockAnalytics")
      .withIndex("by_total_downloads")
      .order("desc")
      .take(5);

    const topBlocks = analytics.map((a) => ({
      name: a.blockName,
      downloads: a.totalDownloads,
      trend: a.downloadTrend,
    }));

    // Get top categories (simplified aggregation)
    const categoryStats = new Map<string, number>();
    allDownloads.forEach((download) => {
      const current = categoryStats.get(download.category) ?? 0;
      categoryStats.set(download.category, current + 1);
    });

    const topCategories = Array.from(categoryStats.entries())
      .map(([category, downloads]) => ({ category, downloads }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5);

    return {
      totalBlocks,
      totalDownloads,
      downloadsToday,
      downloadsThisWeek,
      topBlocks,
      topCategories,
    };
  },
});
