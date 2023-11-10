import {defineSchema, defineTable} from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    iterpolation: defineTable({
        x: v.string(),
        y: v.string(),
        find: v.string(),
        userId: v.string(),
        result: v.string(),
        type: v.string(),
    })
    .index("by_user", ["userId"])
});
