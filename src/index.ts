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
app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: TUser[] = await db("users");
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
app.post("/users", async (req: Request, res: Response): Promise<void> => {
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

    const [findId] = await db("users").where({ id: id });

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

    const [findEmail] = await db("users").where({ email: email });

    if (findEmail) {
      res.status(400);
      throw new Error("Já existe um usuário cadastrado com esse 'email'");
    }

    const newUser = {
      id,
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    };

    await db("users").insert(newUser);

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
      const [findUser] = await db("users").where({ id: idToDelete });

      if (findUser) {
        await db("users").del().where({ id: idToDelete });
      } else {
        res.status(404);
        throw new Error("Conta não encontrada. Verifique o id.");
      }
    }

    res.status(200).send({message: "User apagado com sucesso"});
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
      const product = await db("products")
        .select()
        .where("name", "LIKE", `%${nameToFind}%`);

      if (product.length > 0) {
        res.status(200).send(product);
      } else {
        res.status(404);
        throw new Error("Produto não encontrado");
      }
    } else {
      const result = await db("products");
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

    const [findId] = await db("products").where({ id: id });

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

    const newProduct = {
      id,
      name,
      price,
      description,
      image_url: imageUrl,
    };

    await db("products").insert(newProduct);

    res.status(201).send({message: "Produto cadastrado com sucesso"});
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

// deleteProduct
app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    if (idToDelete !== undefined) {
      const [findId] = await db("products").where({ id: idToDelete });

      if (findId) {
        await db("products").del().where({ id: idToDelete });
      } else {
        res.status(404);
        throw new Error("Produto não encontrado. Verifique o id.");
      }
    }

    res.status(200).send({message: "Produto apagado com sucesso"});
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

//editProductById
app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    if (idToEdit !== undefined) {
      const [product] = await db("products").where({ id: idToEdit });

      if (!product) {
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

      const updatedProduct = {
        id: newId || product.id,
        name: newName || product.name,
        price: newPrice || product.price,
        description: newDescription || product.description,
        image_url: newImageUrl || product.image_url,
      };
      await db("products").update(updatedProduct).where({ id: idToEdit });
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
//getPurchaseById
app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [purchase] = await db("purchases")
      .select(
        "purchases.id AS purchaseId",
        "purchases.buyer AS buyerId",
        "users.name AS buyerName",
        "users.email AS buyerEmail",
        "purchases.total_price AS totalPrice",
        "purchases.created_at AS createdAt"
      )
      .where({ "purchases.id": id })
      .innerJoin("users", "purchases.buyer", "=", "users.id");

    const [products] = await db("products")
      .select(
        "products.id AS id",
        "products.name AS name",
        "products.price AS price",
        "products.description AS description",
        "products.image_url AS imageUrl",
        "purchases_products.quantity AS quantity"
      )
      .innerJoin(
        "purchases_products",
        "products.id",
        "=",
        "purchases_products.product_id"
      ).where({"purchases_products.purchase_id":id})

    const result = {
      purchase,
      products: [
        products
      ]
    }

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

    const [findBuyer] = await db("users").where({id: buyer})

    if (!findBuyer) {
      res.status(404);
      throw new Error(
        "'buyer' não encontrado. Verifique se existe um usuário cadastrado com esse id."
      );
    }

    for (let product of products) {
      console.log(product)
      const [findProduct] = await db("products").where({id: product.id})
      if(findProduct){
        totalPrice += findProduct.price * product.quantity;
      }
      const newPurchase = {
        id,
        total_price: totalPrice,
        buyer,
        created_at: new Date().toISOString()
      }
      await db("purchases").insert(newPurchase)

      const newPurchaseProduct = {
        purchase_id: id,
        product_id: product.id,
        quantity: product.quantity,
      }

      await db("purchases_products").insert(newPurchaseProduct)
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

    const [purchase] = await db("purchases").where({id: idToDelete});

    if (!purchase) {
      res.status(400);
      throw new Error("Insira um id válido.");
    }

    await db("purchases").where({id: idToDelete})

    res.status(200).send({ message: "Pedido cancelado com sucesso." });
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
