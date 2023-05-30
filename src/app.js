const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.json());

// Rutas para el manejo de productos
const productsRouter = express.Router();

// Ruta raíz GET
productsRouter.get('./', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const products = JSON.parse(data);
      res.json(products);
    }
  });
});

// Ruta GET :pid
productsRouter.get('./:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Ruta POST 
productsRouter.post('./', (req, res) => {
  const product = req.body;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const products = JSON.parse(data);
      const newProductId = generateProductId(products);
      product.id = newProductId;
      products.push(product);
      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error interno del servidor');
        } else {
          res.json(product);
        }
      });
    }
  });
});

// Ruta PUT /api/products/:pid
productsRouter.put('./:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const products = JSON.parse(data);
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct, id: productId };
        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.json(products[productIndex]);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Ruta DELETE /:pid
productsRouter.delete('./:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      let products = JSON.parse(data);
      products = products.filter((p) => p.id !== productId);
      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error interno del servidor');
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

app.use('./', productsRouter);

// Rutas para el carrito
const cartsRouter = express.Router();

// Ruta POST 
cartsRouter.post('./', (req, res) => {
  const cart = req.body;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const carts = JSON.parse(data);
      const newCartId = generateCartId(carts);
      cart.id = newCartId;
      carts.push(cart);
      fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error interno del servidor');
        } else {
          res.json(cart);
        }
      });
    }
  });
});

// Ruta GET /api/carts/:cid
cartsRouter.get('./:cid', (req, res) => {
  const cartId = req.params.cid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const carts = JSON.parse(data);
      const cart = carts.find((c) => c.id === cartId);
      if (cart) {
        res.json(cart.products);
      } else {
        res.status(404).send('Carrito no encontrado');
      }
    }
  });
});

// Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post('./:cid/./:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      let carts = JSON.parse(data);
      const cartIndex = carts.findIndex((c) => c.id === cartId);
      if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex((p) => p.product === productId);
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
        fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.json(cart.products);
          }
        });
      } else {
        res.status(404).send('Carrito no encontrado');
      }
    }
  });
});

app.use('./', cartsRouter);

// Función para generar un nuevo ID de producto
function generateProductId(products) {
  const ids = products.map((p) => p.id);
  let newId;
  do {
    newId = generateId();
  } while (ids.includes(newId));
  return newId;
}

// Función para generar un nuevo ID de carrito
function generateCartId(carts) {
  const ids = carts.map((c) => c.id);
  let newId;
  do {
    newId = generateId();
  } while (ids.includes(newId));
  return newId;
}

// Función para generar un ID aleatorio
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
