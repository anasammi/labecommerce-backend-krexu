-- Active: 1702587051523@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

INSERT INTO users (id, name, email, password, created_at)
VALUES 
    ('u001', 'Fulano', 'fulano@email.com', 'fulano123', CURRENT_TIMESTAMP),
    ('u002', 'Ciclana', 'ciclana@email.com', 'ciclana99', '2023-01-17 12:35:28'),
    ('u003', 'Beltrana', 'beltrana@email.com', 'beltrana33', '2023-12-14 12:35:28');

SELECT * FROM users;

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url)
VALUES
    ('prod001', 'Mouse gamer', 250.0, 'Melhor mouse do mercado!', 'https://picsum.photos/seed/Mouse%20gamer/400'),
    ('prod002', 'Monitor', 900, 'Monitor LED Full HD 24 polegadas', 'https://picsum.photos/seed/Monitor/400'),
    ('prod003', 'Teclado gamer', 200, 'Teclado mecânico com numpad', 'https://picsum.photos/seed/Teclado%20gamer/400'),
    ('prod004', 'Headset', 300, 'Headset com cancelamento de ruído', 'https://picsum.photos/seed/Headset/400'),
    ('prod005', 'Fita LED RGB', 100, 'LED RGB pra deixar seu setup luminoso', 'https://picsum.photos/seed/Led/400');

SELECT * FROM products;

DROP TABLE products;