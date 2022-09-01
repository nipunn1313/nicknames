import { query } from "./_generated/server";
import { Id } from "convex-dev/values";

export type GroupRow = {_id: Id, name: string};

export default query(async ({ db }): Promise<Array<GroupRow>> => {
    const groups = await db.table("groups").collect();
    console.log(groups);
    return groups;
});
