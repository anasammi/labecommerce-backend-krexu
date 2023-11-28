import { TUser, TProduct } from "./types";

export const users: TUser[] = [
  {
    id: "u001",
    name: "Fulano",
    email: "fulano@email.com",
    password: "fulano123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u002",
    name: "Beltrana",
    email: "beltrana@email.com",
    password: "fbeltrana00",
    createdAt: new Date().toISOString(),
  },
];

export const products: TProduct[] = [
  {
    id: "prod001",
    name: "Mouse gamer",
    price: 250,
    description: "Melhor mouse do mercado!",
    imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
  },
  {
    id: "prod002",
    name: "Monitor",
    price: 900,
    description: "Monitor LED Full HD 24 polegadas",
    imageUrl: "https://picsum.photos/seed/Monitor/400",
  },
];

//------ USERS ----------

export const createUser = (
  id: string,
  name: string,
  email: string,
  password: string
): string => {
  const newUser: TUser = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return "Cadastro realizado com sucesso";
};

export const getAllUsers = (): TUser[] => {
  return users;
};

//---- PRODUCTS -------

export const createProduct = (
  id: string,
  name: string,
  price: number,
  description: string,
  imageUrl: string
): string => {
    const newProduct = {
        id,
        name,
        price,
        description,
        imageUrl
    }

    products.push(newProduct)

    return "Produto criado com sucesso"
};

export const getAllProducts = (): TProduct[] => {
    return products
}

export const searchProductsByName = (name: string): TProduct[] => {
    return products.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
}