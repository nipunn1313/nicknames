import { mutation } from "./_generated/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db }, nicknameId: Id) => {
    db.delete(nicknameId)
});
