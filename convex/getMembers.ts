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