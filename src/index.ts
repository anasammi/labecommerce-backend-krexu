import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from "./database";

// console.log("O aplicativo está funcionando!")
// console.log(products) 
// console.log(createUser("u003", "Ciclano", "ciclana@email.com", "123456"))
// console.table(users)
// console.log(getAllUsers())
console.log(createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://images.unsplash.com/photo"))
// console.log(getAllProducts())
console.log(searchProductsByName("gamer"))