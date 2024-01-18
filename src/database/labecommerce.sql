-- Active: 1702587051523@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

INSERT INTO users (id, name, email, password, created_at)
VALUES 
    ('u001', 'Fulano', 'fulano@email.com', 'fulano123', CURRENT_TIMESTAMP),
    ('u002', 'Ciclana', 'ciclana@email.com', 'ciclana99', '2023-01-17 12:35:28'),
    ('u003', 'Beltrana', 'beltrana@email.com', 'beltrana33', '2023-12-14 12:35:28');

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

--getAllUsers
SELECT * FROM users;

--getAllProducts
SELECT * FROM products;

SELECT * FROM products
WHERE name LIKE "%gamer%";

DELETE FROM users
WHERE id = 'u001';

DELETE FROM products
WHERE id = 'prod001';

UPDATE products
SET name = "Monitor Ultra Wide",
price = 1500,
description = "Monitor Ultra Wide Led Full HD",
image_url = "https://picsum.photos/seed/MonitorWide/400"
WHERE id = 'prod002';

CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL,
    buyer TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
        ON UPDATE CASCADE -- efeito cascata ao atualizar id na tabela users
        ON DELETE CASCADE -- efeito cascata ao deletar id na tabela users
);

INSERT INTO purchases (id, total_price, created_at, buyer)
VALUES
    ('pur001', 900, CURRENT_TIMESTAMP, 'u001'),
    ('pur002', 1500, CURRENT_TIMESTAMP, 'u001'),
    ('pur003', 250, CURRENT_TIMESTAMP, 'u002'),
    ('pur004', 250, CURRENT_TIMESTAMP, 'u003');

UPDATE purchases
SET total_price = 300
WHERE id = 'pur003';

SELECT 
    purchases.id AS purchase_id,
    purchases.buyer AS buyer_id,
    users.name AS buyer_name,
    users.email,
    purchases.total_price,
    purchases.created_at
FROM purchases INNER JOIN users
ON purchases.buyer = users.id;


CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('pur001', 'prod004', 3),
    ('pur002', 'prod002', 1),
    ('pur003', 'prod005', 3),
    ('pur004', 'prod001', 1);

SELECT 
    purchases_products.purchase_id AS purchaseId,
    purchases_products.product_id AS productId,
    purchases_products.quantity,
    products.name AS productName,
    products.price,
    products.description,
    products.image_url AS imageUrl,
    purchases.total_price AS totalPrice,
    purchases.created_at AS createdAt,
    purchases.buyer AS buyerId,
    users.name AS buyerName
FROM purchases_products
INNER JOIN products
ON purchases_products.product_id = products.id
INNER JOIN purchases
ON purchases.id = purchases_products.purchase_id
INNER JOIN users 
ON purchases.buyer = users.id;

DROP TABLE purchases_products;

DROP TABLE purchases;

DROP TABLE products;

DROP TABLE users;

UPDATE users
SET id = 'u001'
WHERE id = 'u000';

DELETE FROM users
WHERE id = 'u002';

DELETE FROM purchases
WHERE id = 'pur004';