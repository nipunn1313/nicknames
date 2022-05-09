import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db }, groupId: Id, name: string) => {
    const person = {
        groupId: groupId,
        name: name,
    };
    db.insert("people", person)
});