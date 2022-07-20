const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cyf_ecommerce',
  password: '',
  port: 5432,
});

app.use(bodyParser.json());

// WEEK 2 EXERCISES

// Get all customers

app.get('/customers', function (req, res) {
  pool.query('SELECT * FROM customers', (error, result) => {
    res.json(result.rows);
  });
});

// Get customer by id

app.get('/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query('SELECT * FROM customers WHERE id=$1', [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

// Get all suppliers

app.get('/suppliers', function (req, res) {
  pool.query('SELECT * FROM suppliers', (error, result) => {
    res.json(result.rows);
  });
});

// WEEK 3 EXERCISES

// Get all product and supplier names / Get product by name

app.get('/products', function (req, res) {
  const productName = req.query.name;
  let query =
    'SELECT product_name, supplier_name FROM products INNER JOIN suppliers ON suppliers.id = supplier_id;';
  if (productName) {
    query = `SELECT product_name, supplier_name FROM products
    INNER JOIN suppliers ON suppliers.id = supplier_id
    WHERE product_name LIKE '%${productName}%' ORDER BY product_name;`;
  }

  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

// Add a new customer

app.post('/customers', function (req, res) {
  const newCustomerName = req.body.name;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerCountry = req.body.country;
  pool
    .query('SELECT * FROM customers WHERE name=$1', [newCustomerName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send('A customer with the same name already exists!');
      } else {
        const query =
          'INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)';
        pool
          .query(query, [
            newCustomerName,
            newCustomerAddress,
            newCustomerCity,
            newCustomerCountry,
          ])
          .then(() => res.send('Customer created!'))
          .catch((e) => console.error(e));
      }
    });
});

// Add a new product

app.post('/products', function (req, res) {
  const newProductName = req.body.product_name;
  const newProductPrice = req.body.unit_price;
  const newProductSupplier = req.body.supplier_id;

  pool
    .query('SELECT * FROM suppliers WHERE id=$1', [newProductSupplier])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(400).send('Supplier could not be found...');
      } else if (!Number.isInteger(newProductPrice) || newProductPrice <= 0) {
        return res
          .status(400)
          .send('The product price should be a positive integer.');
      } else {
        pool
          .query(
            'INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)',
            [newProductName, newProductPrice, newProductSupplier]
          )
          .then(() => res.send('Product added!'))
          .catch((e) => console.error(e));
      }
    });
});

// Create new order

app.post('/customers/:customerId/orders', function (req, res) {
  const customerId = req.params.customerId;
  const newOrderReference = req.body.order_reference;
  const newOrderDate = req.body.order_date;
  pool
    .query('SELECT * FROM customers WHERE name=$1', [customerId])
    .then((result) => {
      if (result.rows.length > 0) {
        return res.status(400).send('Customer could not be found...');
      } else {
        pool
          .query(
            'INSERT INTO orders (order_reference, order_date, customer_id) VALUES ($1, $2, $3)',
            [newOrderReference, newOrderDate, customerId]
          )
          .then(() => res.send('Order added!'))
          .catch((e) => console.error(e));
      }
    });
});

// Update all customer data

app.put('/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;
  const keys = Object.keys(req.body);
  let fields_to_update = '';
  let update_values = [customerId];

  for (let i = 0; i < keys.length; i++) {
    if (i > 0 && i < keys.length) {
      fields_to_update += ', ';
    }
    fields_to_update += `${keys[i]}=$${i + 2}`;
    update_values.push(req.body[keys[i]]);
  }

  let update_query = `UPDATE customers SET ${fields_to_update} WHERE id=$1`;
  pool
    .query(update_query, update_values)
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});

// Delete orders and associated items

app.delete('/orders/:orderId', function (req, res) {
  const orderId = req.params.orderId;

  pool
    .query('DELETE FROM order_items WHERE order_id=$1', [orderId])
    .then(() => {
      pool
        .query('DELETE FROM orders WHERE id=$1', [orderId])
        .then(() => res.send(`Order ${orderId} deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

// Delete orders and associated items

app.delete('/customers/:customerId', function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query('SELECT * FROM orders WHERE customer_id=$1', [customerId])
    .then((result) => {
      if (result.rows.length > 0) {
        return res.status(400).send('This Customer has pending orders!');
      } else {
        pool
          .query('DELETE FROM customers WHERE id=$1', [customerId])
          .then(() => res.send(`Customer ${customerId} deleted!`))
          .catch((e) => console.error(e));
      }
    })
    .catch((e) => console.error(e));
});

// Get orders by customer id

app.get('/customers/:customerId/orders', function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query(
      `SELECT order_reference, order_date, product_name, unit_price, supplier_name, quantity FROM customers
    INNER JOIN orders ON customers.id = customer_id
    INNER JOIN order_items ON orders.id = order_id
    INNER JOIN products ON products.id = product_id
    INNER JOIN suppliers ON suppliers.id = supplier_id
    WHERE customers.id=$1`,
      [customerId]
    )
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});
