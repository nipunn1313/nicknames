import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db }, person: Id, nickname: string) => {
    const row = {
        person: person,
        nickname: nickname,
    };
    db.insert("nicknames", row)
});