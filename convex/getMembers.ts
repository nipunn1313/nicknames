import { query } from "./_generated/server";
import { Id } from '../convex/_generated/dataModel';

export type Member = {
	  _id: Id,
	  groupId: Id,
    userId: Id,
    name: string,
    email: string,
    isItMe: boolean,
};

export default query(async ({ db, auth }, groupId: Id): Promise<Array<Member>> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated call to getMembers");
    }

    let members: Array<Member> = await db
        .table("members")
        .filter(q => q.eq(q.field("groupId"), groupId))
        .collect();

    for (let member of members) {
        const user = await db.get(member.userId);
        member.name = user.name;
        member.email = user.email;
        member.isItMe = identity.tokenIdentifier == user.tokenIdentifier;
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

    return existing !== null;
});
