import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export type PersonRow = {_id: Id, name: string};

export default query(async ({ db }): Promise<Array<PersonRow>> => {
    const people = await db.table("people").fullTableScan().collect();
    return people;
});