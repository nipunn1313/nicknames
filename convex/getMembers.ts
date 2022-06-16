import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export type Member = {_id: Id, groupId: Id, userId: Id, name: string};

export default query(async ({ db }, groupId: Id): Promise<Array<Member>> => {
    let members: Array<Member> = await db
        .table("members")
        .filter(q => q.eq(q.field("groupId"), groupId))
        .collect();

    for (let member of members) {
        member.name = (await db.get(member.userId)).name;
    }

    return members;
});

export const alreadyMember = query(async ({db, auth}, groupId: Id): Promise<boolean> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated call to alreadyMember");
    }

    const user = await db
        .table("users")
        .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
        .unique();
    const existing = await db
        .table("members")
        .filter(q => q.eq(q.field("groupId"), groupId))
        .filter(q => q.eq(q.field("userId"), user._id))
        .first();

    console.log("alreadyMember = " + (existing !== null))
    return existing !== null;
});