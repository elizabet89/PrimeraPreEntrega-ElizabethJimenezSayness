const express = require('express');
const fs = require('fs');
const cartsRouter = express.Router();

const CartManager= require('../cartManager');

const cartManager = new CartManager();

// Ruta raíz POST /api/carts
cartsRouter.post('/', (req, res) => {
  const { products } = req.body;
  const newCart = cartManager.createCart(products);

  res.json(newCart);
});

// Ruta GET /api/carts/:cid
cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;

  const cart = cartManager.getCartById(cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = cartManager.addProductToCart(cid, pid, quantity);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

module.exports = cartsRouter;

