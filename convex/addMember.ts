import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db, auth}, groupId: Id) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated call to addMember");
    }
    const user = await db
        .table("users")
        .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
        .unique();
    const member = {
        groupId: groupId,
        userId: user._id,
    };
    db.insert("members", member)
});