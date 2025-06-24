import db from "./client.js"
import { createProduct } from "./queries/products.js"
import { createUser } from "./queries/users.js"
import { createOrder } from "./queries/orders.js";
import { createReview } from "./queries/reviews.js";


await db.connect();
await seedUsers();
await seedOrders();
await seedProducts();
await seedReviews();
await db.end();
console.log("🌱 Database seeded. 🌱");

async function seedUsers() {
  await createUser({username:"userone", password:"password1"})
  await createUser({username:"usertwo", password:"password2"})
}

async function seedOrders() {
  await createOrder({date:"02-04-2025", note: "1 Goodnight Moon, 1 No, David!, 1 Fox in Socks", user_id: 1})
  await createOrder({date:"04-23-2025", note: "1 Goodnight Moon ", user_id: 2})
}

async function seedProducts() {
  await createProduct({title:"Goodnight Moon", image_url:"https://m.media-amazon.com/images/I/91WuHblNkEL._UF1000,1000_QL80_.jpg", description: "A calming and gentle story about a little bunny saying goodnight to various objects in its room, helping children wind down before bedtime. ", price: 7.99})
  await createProduct({title:"The Very Hungry Caterpillar", image_url: "https://shopatdawn.com/cdn/shop/files/tvhcbook-2.webp?v=1683312686", description: "This book follows a caterpillar's journey as it eats various foods, eventually transforming into a butterfly.", price: 8.99})
  await createProduct({title:"Courdroy", image_url: "https://i.ebayimg.com/images/g/lp4AAOxy2d9SXolI/s-l960.webp", description: "This book tells the story of a stuffed bear named Corduroy who is missing a button and is searching for a home.", price: 10.99})
  await createProduct({title:"The Tale of Peter Rabbit", image_url: "https://m.media-amazon.com/images/I/61ASCNFMAlL.jpg", description: "A classic adventure story about a mischievous rabbit who gets into trouble in Mr. McGregor's garden.", price: 12.99})
  await createProduct({title:"Green Eggs and Ham", image_url: "https://m.media-amazon.com/images/I/71e4ln93HOL._UF1000,1000_QL80_.jpg", description: "This is a whimsical story about a character named Sam-I-Am who tries to convince the reader to try green eggs and ham.", price: 6.99})
  await createProduct({title:"The Rainbow Fish", image_url: "https://m.media-amazon.com/images/I/81ksqicYMFL.jpg", description: "The Rainbow Fish is a beautifully illustrated book about a colorful fish who learns to share his shiny scales with others.", price: 10.99})
  await createProduct({title:"Fox in Socks", image_url: "https://m.media-amazon.com/images/I/81FCWL2XNiL.jpg", description: "Fox in Socks is a tongue-twister of a book that follows the antics of a sly fox who tries to teach his friend Knox how to speak in rhyme.", price: 6.99})
  await createProduct({title:"No, David!", image_url: "https://m.media-amazon.com/images/I/91RMJosYFFL.jpg", description: "A classic adventure story about a mischievous rabbit wDavid's unabashed good humor, mischievous smile, and laughter-inducing antics underline the love parents have for their children⁠—even when they misbehave.", price: 11.99})
  await createProduct({title:"Chicka Chicka Boom Boom", image_url: "https://m.media-amazon.com/images/I/61rGNycNKbL._UF1000,1000_QL80_.jpg", description: "n this lively alphabet rhyme, all the letters of the alphabet race each other up the coconut tree.", price: 8.99})
  await createProduct({title:"A Bad Case of the Stripes", image_url: "https://m.media-amazon.com/images/I/710zduPY9aL.jpg", description: "Camilla Cream is very worried about what other people think about her, but at the very moment she most wants to fit in, she becomes completely covered in colorful stripes! Specialists are called but the situation goes from bad to worse. Isn't there anyone who can help Camilla remember what it means to be herself?", price: 10.99})
}

async function seedReviews() {
  await createReview({rating: 5, comment: "5 Stars: My 4-year-old absolutely loves this book! We've read it together every night for the past two weeks and she still asks to read it again!", product_id: 1, user_id: 1})
  await createReview({rating: 5, comment: "5 Stars: Great addition to our bedtime story collection. My twin boys (ages 3 and 3) both sit still for the entire book, which is saying something!", product_id: 8, user_id: 1})
  await createReview({rating: 5, comment: "5 Stars: Bought this for my daughter's 4th birthday and it was an instant favorite. She's now reading simple words on her own and this book is perfect for her level.", product_id: 7, user_id: 1})
  await createReview({rating: 3, comment: "3 Stars: Decent book overall. My 6-year-old enjoyed it but didn't love it as much as some of his other favorites. The story is fine and the illustrations are nice, but it didn't quite capture his imagination like I hoped it would.", product_id: 1, user_id: 2})
}
