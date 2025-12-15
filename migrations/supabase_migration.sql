-- Migration file for Supabase
-- Created automatically from Products.json

CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT
);

INSERT INTO products (id, name, category, price, image) VALUES
(1, 'Laptop', 'Electronics', 1200, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww'),
(2, 'Headphones', 'Electronics', 200, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'),
(3, 'Shirt', 'Fashion', 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2hpcnR8ZW58MHx8MHx8fDA%3D'),
(4, 'Shoes', 'Fashion', 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D'),
(5, 'Coffee Mug', 'Home', 15, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwbXVnfGVufDB8fDB8fHww'),
(6, 'Sofa', 'Home', 1500, 'https://www.casafurnishing.in/wp-content/uploads/2022/11/L-shaped-corner-wooden-sofa-set-2.jpg'),
(7, 'Women''s Clothing', 'Fashion', 89, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDeUwO9Dwob7E20UusjCtQTS1lEl_I1Ri4jw&s'),
(8, 'Cotton T-Shirt', 'Fashion', 25, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60'),
(9, 'Hoodie', 'Fashion', 55, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&auto=format&fit=crop&q=60'),
(10, 'Sneakers', 'Fashion', 120, 'https://images.unsplash.com/photo-1528701800489-20be3c6a6305?w=500&auto=format&fit=crop&q=60'),
(11, 'Formal Shirt', 'Fashion', 45, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxtnKOirTZJ2AvkP8FIKIY-JI6m4u-1DImTw&s'),
(12, 'Jeans', 'Fashion', 60, 'https://www.mytheresa.com/me/en/women/re-done-low-rise-straight-jeans-blue-p00885629'),
(13, 'Women’s Dress', 'Fashion', 75, 'https://www.amazon.in/Gulkanya-STYLE-Printed-Western-Dresses/dp/B0DGY3461Y'),
(14, 'Bluetooth Speaker', 'Electronics', 99, 'https://www.sencor.com/waterproof-bluetooth-speaker/sirius-2-black'),
(15, 'Smartphone', 'Electronics', 899, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'),
(16, 'Smartwatch', 'Electronics', 199, 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&auto=format&fit=crop&q=60'),
(17, 'Wireless Earbuds', 'Electronics', 150, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60'),
(18, 'Gaming Mouse', 'Electronics', 59, 'https://images.unsplash.com/photo-1587202372775-a132c6c1cc2c?w=500&auto=format&fit=crop&q=60'),
(19, 'Mechanical Keyboard', 'Electronics', 130, 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=500&auto=format&fit=crop&q=60'),
(20, '4K Monitor', 'Electronics', 350, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60'),
(21, 'Indoor Plant', 'Home', 35, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60'),
(22, 'Wall Art Canvas', 'Home', 80, 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=500&auto=format&fit=crop&q=60'),
(23, 'Decorative Vase', 'Home', 40, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&auto=format&fit=crop&q=60'),
(24, 'Table Lamp', 'Home', 60, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60'),
(25, 'Cozy Blanket', 'Home', 45, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60'),
(26, 'Scented Candles', 'Home', 25, 'https://images.unsplash.com/photo-1523294587485-b43d7e1f3c4e?w=500&auto=format&fit=crop&q=60'),
(27, 'Wooden Shelf', 'Home', 120, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&auto=format&fit=crop&q=60');
