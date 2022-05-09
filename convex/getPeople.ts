import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export type PersonRow = {_id: Id, groupId: Id, name: string};

export default query(async ({ db }, groupId: Id): Promise<Array<PersonRow>> => {
    return await db
        .table("people")
        .filter(q => q.eq(q.field("groupId"), groupId))
        .collect();
});