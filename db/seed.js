import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded. 🌱");

async function seed() {

}
