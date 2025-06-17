import db from "./client.js"
import { createProduct } from "./queries/products.js"
import { createUser } from "./queries/users.js"


await db.connect();
await seedUsers();

await seedProducts();

await db.end();
console.log("🌱 Database seeded. 🌱");

async function seedUsers() {
  await createUser({username:"userone", password:"password1"})
  await createUser({username:"usertwo", password:"password2"})
}



async function seedProducts() {
  await createProduct({title:"Goodnight Moon", description: "A calming and gentle story about a little bunny saying goodnight to various objects in its room, helping children wind down before bedtime. ", price: 7.99})
  await createProduct({title:"The Very Hungry Caterpillar", description: "This book follows a caterpillar's journey as it eats various foods, eventually transforming into a butterfly.", price: 8.99})
  await createProduct({title:"Courdroy", description: "This book tells the story of a stuffed bear named Corduroy who is missing a button and is searching for a home.", price: 10.99})
  await createProduct({title:"The Tale of Peter Rabbit", description: "A classic adventure story about a mischievous rabbit who gets into trouble in Mr. McGregor's garden.", price: 12.99})
  await createProduct({title:"Green Eggs and Ham", description: "This is a whimsical story about a character named Sam-I-Am who tries to convince the reader to try green eggs and ham.", price: 6.99})
  await createProduct({title:"The Rainbow Fish", description: "The Rainbow Fish is a beautifully illustrated book about a colorful fish who learns to share his shiny scales with others.", price: 10.99})
  await createProduct({title:"Fox in Socks", description: "Fox in Socks is a tongue-twister of a book that follows the antics of a sly fox who tries to teach his friend Knox how to speak in rhyme.", price: 6.99})
  await createProduct({title:"No, David!", description: "A classic adventure story about a mischievous rabbit wDavid's unabashed good humor, mischievous smile, and laughter-inducing antics underline the love parents have for their children⁠—even when they misbehave.", price: 11.99})
  await createProduct({title:"Chicka Chicka Boom Boom", description: "n this lively alphabet rhyme, all the letters of the alphabet race each other up the coconut tree.", price: 8.99})
  await createProduct({title:"A Bad Case of the Stripes", description: "Camilla Cream is very worried about what other people think about her, but at the very moment she most wants to fit in, she becomes completely covered in colorful stripes! Specialists are called but the situation goes from bad to worse. Isn't there anyone who can help Camilla remember what it means to be herself?", price: 10.99})
}

