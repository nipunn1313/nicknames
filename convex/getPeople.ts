import { query } from "convex-dev/server";

export default query(async ({ db }): Promise<Array<string>> => {
    const people = await db.table("people").fullTableScan().collect();
    return people;
});