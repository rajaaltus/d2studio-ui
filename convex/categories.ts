import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_sortOrder")
            .collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        sortOrder: v.number(),
    },
    handler: async (ctx, args) => {
        // Check for slug uniqueness
        const existing = await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
        if (existing) {
            throw new Error(`Category with slug "${args.slug}" already exists`);
        }

        const now = Date.now();
        return await ctx.db.insert("categories", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("categories"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        sortOrder: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;

        // If slug is being updated, check for uniqueness
        if (rest.slug) {
            const existing = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", rest.slug!))
                .unique();
            if (existing && existing._id !== id) {
                throw new Error(`Category with slug "${rest.slug}" already exists`);
            }
        }

        const now = Date.now();
        await ctx.db.patch(id, {
            ...rest,
            updatedAt: now,
        });
    },
});

export const remove = mutation({
    args: {
        id: v.id("categories"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
