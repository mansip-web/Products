const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../public/Products.json");
const outputPath = path.join(__dirname, "../supabase_migration.sql");

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

let sql = `-- Migration file for Supabase
-- Created automatically from Products.json

CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT
);

INSERT INTO products (id, name, category, price, image) VALUES
`;

const values = products
  .map((p) => {
    const name = p.name.replace(/'/g, "''"); // Escape single quotes
    const category = p.category.replace(/'/g, "''");
    const image = p.image.replace(/'/g, "''");
    return `(${p.id}, '${name}', '${category}', ${p.price}, '${image}')`;
  })
  .join(",\n");

sql += values + ";\n";

fs.writeFileSync(outputPath, sql);

console.log(`Migration file created at ${outputPath}`);
