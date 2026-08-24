import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const blockInput = v.object({
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
  previewImage: v.optional(v.string()),
  codeStatus: v.optional(
    v.union(v.literal("coming_soon"), v.literal("available")),
  ),
  codeUrl: v.optional(v.string()),
  blockType: v.optional(v.string()),
  accessTier: v.optional(v.union(v.literal("free"), v.literal("pro"))),
});

const categoryInput = v.object({
  name: v.string(),
  slug: v.string(),
  sortOrder: v.number(),
});

export const seedContent = internalMutation({
  args: {
    blocks: v.array(blockInput),
    categories: v.array(categoryInput),
  },
  returns: v.object({
    blocksInserted: v.number(),
    blocksUpdated: v.number(),
    blocksDeactivated: v.number(),
    categoriesInserted: v.number(),
    categoriesUpdated: v.number(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    let blocksInserted = 0;
    let blocksUpdated = 0;
    let blocksDeactivated = 0;
    let categoriesInserted = 0;
    let categoriesUpdated = 0;

    const seedBlockNames = new Set(args.blocks.map((b) => b.name));

    for (const block of args.blocks) {
      const existing = await ctx.db
        .query("blocks")
        .withIndex("by_name", (q) => q.eq("name", block.name))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...block, updatedAt: now });
        blocksUpdated++;
      } else {
        await ctx.db.insert("blocks", {
          ...block,
          createdAt: now,
          updatedAt: now,
        });
        blocksInserted++;
      }
    }

    const allBlocks = await ctx.db.query("blocks").collect();
    for (const b of allBlocks) {
      if (!seedBlockNames.has(b.name) && b.isActive) {
        await ctx.db.patch(b._id, { isActive: false, updatedAt: now });
        blocksDeactivated++;
      }
    }

    for (const cat of args.categories) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...cat, updatedAt: now });
        categoriesUpdated++;
      } else {
        await ctx.db.insert("categories", {
          ...cat,
          createdAt: now,
          updatedAt: now,
        });
        categoriesInserted++;
      }
    }

    return {
      blocksInserted,
      blocksUpdated,
      blocksDeactivated,
      categoriesInserted,
      categoriesUpdated,
    };
  },
});
