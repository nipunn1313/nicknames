import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";

export type NicknameRow = {_id: Id, nickname: string};

export default query(async ({ db }, person: Id): Promise<Array<NicknameRow>> => {
    return await db
        .table("nicknames")
        .filter(q => q.eq(q.field("person"), person))
        .collect();
});