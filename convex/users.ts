import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
    args: {
        username: v.string(),
        password: v.string(),
        email: v.string(),
        image: v.string(),
        clerkID: v.string(),
    },
    handler: async ( ctx, args) => {

        await ctx.db.insert("users", {
            username: args.username,
            password: args.password,
            email: args.email,
            image: args.image,
            clerkID: args.clerkID,
        });
    }
});