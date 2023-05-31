const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz POST /api/carts
router.post('/', (req, res) => {
  // Leer el archivo carrito.json
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  // Generar un nuevo id para el carrito
  const newId = generateId();
  // Crear el nuevo carrito con los productos vacíos
  const newCart = {
    id: newId,
    products: [],
  };
  // Agregar el nuevo carrito al arreglo de carritos
  carts.push(newCart);
  // Escribir los carritos actualizados en el archivo carrito.json
  fs.writeFileSync('carrito.json', JSON.stringify(carts));
  res.json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  // Leer el archivo carrito.json y encontrar el carrito con el id proporcionado
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find((c) => c.id === cartId);
  res.json(cart);
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  // Leer el archivo carrito.json y encontrar el carrito con el id proporcionado
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cartIndex = carts.findIndex((c) => c.id === cartId);
  if (cartIndex !== -1) {
    // Obtener el carrito
    const cart = carts[cartIndex];
    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((p) => p.id === productId);
    if (existingProduct) {
      // Incrementar la cantidad del producto existente
      existingProduct.quantity += quantity;
    } else {
      // Agregar el producto al carrito con la cantidad especificada
      cart.products.push({ id: productId, quantity });
    }
    // Escribir los carritos actualizados en el archivo carrito.json
    fs.writeFileSync('carrito.json', JSON.stringify(carts));
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;