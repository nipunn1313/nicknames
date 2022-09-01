import { mutation } from "./_generated/server";

export default mutation(async ({db }, name: string) => {
    const group = {
        name: name,
    };
    db.insert("groups", group)
});
