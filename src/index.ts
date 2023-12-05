import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  searchProductsByName,
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

//getAllUsers
app.get("/users", (req: Request, res: Response) => {
  res.send(users);
});

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
