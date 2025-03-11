import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        username: v.string(),
        password: v.string(),
        email: v.string(),
        image: v.string(),
        clerkID: v.string(),
    }).index('by_clerk_id', ['clerkID']),
});