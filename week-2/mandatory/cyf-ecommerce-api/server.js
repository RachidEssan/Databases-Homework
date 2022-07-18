const express = require('express');
const app = express();
const { Pool } = require('pg');

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: '',
  port: 5432,
});

app.get('/customers', function (req, res) {
  pool.query('SELECT * FROM customers', (error, result) => {
    res.json(result.rows);
  });
});

app.get('/suppliers', function (req, res) {
  pool.query('SELECT * FROM suppliers', (error, result) => {
    res.json(result.rows);
  });
});

app.get('/products', function (req, res) {
  pool.query(
    'SELECT product_name, supplier_name FROM products INNER JOIN suppliers ON suppliers.id = supplier_id;',
    (error, result) => {
      res.json(result.rows);
    }
  );
});