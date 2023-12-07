import {
  users,
  products
} from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TUser } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

//-----USER------

//getAllUsers
app.get("/users", (req: Request, res: Response) => {
  res.send(users);
});

//createUser
app.post("/users", (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;
  const newUser: TUser = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  res.status(201).send("Cadastro realizado com sucesso");
});

//deleteUser
app.delete("/users/:id", (req: Request, res: Response) => {
  const idToDelete = req.params.id

  const index: number = users.findIndex (user => user.id === idToDelete)

  if(index >= 0) {
      users.splice(index, 1)
  }

  res.status(200).send("User apagado com sucesso")
})

//-----PRODUCT-----

//getAllProducts
app.get("/products", (req: Request, res: Response) => {
  const nameToFind = req.query.name as string;

  if (nameToFind !== undefined) {
    const result: TProduct[] = products.filter((product) =>
      product.name.toLowerCase().includes(nameToFind.toLowerCase())
    );

    res.send(result);
  }

  res.send(products);
});

//createProduct
app.post("/products", (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl } = req.body;
  const newProduct: TProduct = {
    id,
    name,
    price,
    description,
    imageUrl,
  };
  products.push(newProduct);
  res.status(201).send("Produto cadastrado com sucesso");
});

//deleteProduct
app.delete("/products/:id", (req: Request, res: Response) => {
  const idToDelete = req.params.id

  const index: number = products.findIndex (item => item.id === idToDelete)

  if(index >= 0) {
      products.splice(index, 1)
  }

  res.status(200).send("Produto apagado com sucesso")
})

//editProduct
app.put("/products/:id", (req: Request, res: Response) =>{
  const idToEdit = req.params.id

  const newId = req.body.id as string | undefined
  const newName = req.body.name as string | undefined
  const newPrice = req.body.price as number | undefined
  const newDescription = req.body.description as string | undefined
  const newImageUrl = req.body.imageUrl as string | undefined

  const result = products.find(item => item.id === idToEdit)

  if(result){
    result.id = newId || result.id
    result.name = newName || result.name
    result.price = newPrice || result.price
    result.description = newDescription || result.description
    result.imageUrl = newImageUrl || result.imageUrl
  }

  res.status(200).send("Produto atualizado com sucesso")
})