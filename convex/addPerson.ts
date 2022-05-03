import { mutation } from "convex-dev/server";

export default mutation(async ({db }, name: string) => {
    const person = {
        name: name,
    };
    db.insert("people", person)
});