const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz POST /api/carts
router.post('/', (req, res) => {
  
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
 
  const newId = generateId();

  const newCart = {
    id: newId,
    products: [],
  };

  carts.push(newCart);
 
  fs.writeFileSync('carrito.json', JSON.stringify(carts));
  res.json(newCart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find((c) => c.id === cartId);
  res.json(cart);
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cartIndex = carts.findIndex((c) => c.id === cartId);
  if (cartIndex !== -1) {
   
    const cart = carts[cartIndex];
    
    const existingProduct = cart.products.find((p) => p.id === productId);
    if (existingProduct) {
     
      existingProduct.quantity += quantity;
    } else {
    
      cart.products.push({ id: productId, quantity });
    }
    
    fs.writeFileSync('carrito.json', JSON.stringify(carts));
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;