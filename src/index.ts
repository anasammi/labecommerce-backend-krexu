import { users, products } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TUser } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//-----USER------

//getAllUsers
app.get("/users", (req: Request, res: Response) => {
  try {
    res.send(users);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//createUser
app.post("/users", (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    if (
      id === undefined ||
      name === undefined ||
      email === undefined ||
      password === undefined
    ) {
      res.status(400);
      throw new Error(
        "O body deve conter os seguintes campos: id, name, email e password."
      );
    }

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ter o formato de string");
    }

    const result = users.find((user) => user.id === id);
    if (result) {
      res.status(400);
      throw new Error("Já existe um usuário cadastrado com esse 'id'");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser do tipo string");
    }

    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'email' deve ser do tipo string");
    }

    if (typeof password !== "string") {
      res.status(400);
      throw new Error("'password' deve ser do tipo string");
    }

    const findEmail = users.find((user) => user.email === email);
    if (findEmail) {
      res.status(400);
      throw new Error("Já existe um usuário cadastrado com esse 'email'");
    }

    const newUser: TUser = {
      id,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    res.status(201).send("Cadastro realizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//deleteUser
app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    if (idToDelete !== undefined) {
      const index: number = users.findIndex((user) => user.id === idToDelete);

      if (index >= 0) {
        users.splice(index, 1);
      } else {
        res.status(404);
        throw new Error("Conta não encontrada. Verifique o id.");
      }
    }

    res.status(200).send("User apagado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//-----PRODUCT-----

//getAllProducts
app.get("/products", (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name as string;

    if (nameToFind !== undefined) {
      if (nameToFind.length < 1) {
        res.status(400);
        throw new Error(
          "Query params 'name' deve possuir pelo menos 1 caracter"
        );
      }
      const result: TProduct[] = products.filter((product) =>
        product.name.toLowerCase().includes(nameToFind.toLowerCase())
      );

      res.send(result);
    }

    res.send(products);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//createProduct
app.post("/products", (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl } = req.body;

    if (
      id === undefined ||
      name === undefined ||
      price === undefined ||
      description === undefined ||
      imageUrl === undefined
    ) {
      res.status(400);
      throw new Error(
        "O body deve conter as seguintes propriedades: 'id', 'name', 'price', 'description' e 'imageUrl'"
      );
    }

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser do tipo string");
    }

    const result: TProduct | undefined = products.find(
      (product) => product.id === id
    );
    if (result) {
      res.status(400);
      throw new Error("Já existe um produto cadastrado com esse id");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser do tipo string");
    }

    if (typeof price !== "number") {
      res.status(400);
      throw new Error("'price' deve ser do tipo number");
    }

    if (typeof description !== "string") {
      res.status(400);
      throw new Error("'description' deve ser do tipo string");
    }

    if (typeof imageUrl !== "string") {
      res.status(400);
      throw new Error("'imageUrl' deve ser do tipo string");
    }

    const newProduct: TProduct = {
      id,
      name,
      price,
      description,
      imageUrl,
    };
    products.push(newProduct);
    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//deleteProduct
app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    if (idToDelete !== undefined) {
      const index: number = products.findIndex(
        (item) => item.id === idToDelete
      );

      if (index >= 0) {
        products.splice(index, 1);
      } else {
        res.status(404);
        throw new Error("Produto não encontrado. Verifique o id.");
      }
    }

    res.status(200).send("Produto apagado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

//editProduct
app.put("/products/:id", (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    if (idToEdit !== undefined) {
      const result = products.find((product) => product.id === idToEdit);
      if (!result) {
        res.status(404);
        throw new Error("Produto não encontrado. Verifique o id.");
      }
    }

    const newId = req.body.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newDescription = req.body.description;
    const newImageUrl = req.body.imageUrl;

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser do tipo string");
      }
    }

    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("'name' deve ser do tipo string");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(400);
        throw new Error("'price' deve ser do tipo number");
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400);
        throw new Error("'description' deve ser do tipo string");
      }
    }
    if (newImageUrl !== undefined) {
      if (typeof newImageUrl !== "string") {
        res.status(400);
        throw new Error("'imageUrl' deve ser do tipo string");
      }
    }

    const result: TProduct | undefined = products.find(
      (item) => item.id === idToEdit
    );

    if (result) {
      result.id = newId || result.id;
      result.name = newName || result.name;
      result.price = newPrice || result.price;
      result.description = newDescription || result.description;
      result.imageUrl = newImageUrl || result.imageUrl;
    }

    res.status(200).send("Produto atualizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});
