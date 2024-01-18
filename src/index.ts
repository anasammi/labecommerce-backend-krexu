import { users, products } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TUser } from "./types";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//-----USER------

//getAllUsers
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
      SELECT * FROM users;
    `);
    res.status(200).send(result);
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
app.post("/users", async (req: Request, res: Response) => {
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

    const [findId] = await db.raw(`
    SELECT * FROM users WHERE id = "${id}"
  `);

    if (findId) {
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

    const [findEmail] = await db.raw(`
    SELECT * FROM users WHERE email = "${email}"
    `);

    if (findEmail) {
      res.status(400);
      throw new Error("Já existe um usuário cadastrado com esse 'email'");
    }

    await db.raw(`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES ("${id}", "${name}", "${email}", "${password}", "${new Date().toISOString()}")
    `);

    res.status(201).send({ message: "Cadastro realizado com sucesso" });
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
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    if (idToDelete !== undefined) {
      const [findUser] = await db.raw(
        `SELECT * FROM users WHERE id = "${idToDelete}"`
      );
      if (findUser) {
        await db.raw(`DELETE FROM users WHERE id = '${idToDelete}'`);
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
app.get("/products", async (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name;

    if (nameToFind) {
      const [product] = await db.raw(`
        SELECT * FROM products WHERE name LIKE "%${nameToFind}%"
      `);

      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404);
        throw new Error("Produto não encontrado");
      }
    } else {
      const result = await db.raw(`
        SELECT * FROM products;
      `);

      res.status(200).send(result);
    }
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
app.post("/products", async (req: Request, res: Response) => {
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

    const [findId] = await db.raw(`
    SELECT * FROM products WHERE id = "${id}"
  `);

    if (findId) {
      res.status(400);
      throw new Error("Já existe um produto cadastrado com esse 'id'");
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

    await db.raw(`
    INSERT INTO products (id, name, price, description, image_url)
    VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")
  `);
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
app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    if (idToEdit !== undefined) {
      const [result] = await db.raw(`
        SELECT * FROM products WHERE id = "${idToEdit}";
      `);
      if (!result) {
        res.status(404);
        throw new Error("Produto não encontrado. Verifique o id.");
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

      await db.raw(`
      UPDATE products
      SET
        id = "${newId || result.id}",
        name = "${newName || result.name}",
        price = "${newPrice || result.price}",
        description = "${newDescription || result.description}",
        image_url = "${newImageUrl || result.imageUrl}"
      WHERE id = "${idToEdit}"
    `);
    }

    res.status(200).send({ message: "Produto atualizado com sucesso" });
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

//-------- PURCHASES --------
//createPurchase
app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, products, buyer } = req.body;
    let totalPrice = 0;

    if (id === undefined || products === undefined || buyer === undefined) {
      res.status(400);
      throw new Error(
        "O body deve conter as seguintes propriedades: 'id', 'products' e 'buyer'"
      );
    }
    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser do tipo string");
    }

    if (typeof buyer !== "string") {
      res.status(400);
      throw new Error("'buyer' deve ser do tipo string");
    }

    const [findBuyer] = await db.raw(`
      SELECT * FROM users WHERE id = "${buyer}";
    `);

    if (!findBuyer) {
      res.status(404);
      throw new Error(
        "'buyer' não encontrado. Verifique se existe um usuário cadastrado com esse id."
      );
    }

    for (let product of products) {
      const findProduct = await db.raw(`
      SELECT * FROM products WHERE id = "${products.id}"
      `);
      totalPrice += findProduct.price + product.quantity;
    }

    await db.raw(`
    INSERT INTO purchases (id, total_price, buyer, created_at)
    VALUES ("${id}", "${totalPrice}", "${buyer}", "${new Date().toISOString()}")
    `);

    for (let product of products) {
      const newPurchase = {
        purchase_id: id,
        product_id: product.id,
        quantity: product.quantity,
      };
      await db.raw(`
      INSERT INTO purchases_products (purchase_id, product_id, quantity)
      VALUES ("${newPurchase.purchase_id}", "${newPurchase.product_id}", "${newPurchase.quantity}")
      `);
    }

    res.status(201).send({ message: "Pedido realizado com sucesso!" });
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

//deletePurchaseById
app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    const result = await db("purchases")
    .delete()
    .where("id", "=", `${idToDelete}`)

  if (!result) {
    res.status(400)
    throw new Error("Insira um id válido.")
  }


  res.status(200).send({ message: "Pedido cancelado com sucesso." })
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
