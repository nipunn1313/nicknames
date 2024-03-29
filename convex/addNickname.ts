import { mutation } from "./_generated/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db }, member: Id, nickname: string) => {
    const row = {
        member: member,
        nickname: nickname,
    };
    db.insert("nicknames", row)
});
