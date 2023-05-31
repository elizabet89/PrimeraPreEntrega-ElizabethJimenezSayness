const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz GET /api/products
router.get('/', (req, res) => {
  
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  res.json(products);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find((item) => item.id === productId);
  res.json(product);
});

// Ruta POST /api/products
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  
  const newId = generateId();

  const newProduct = {
    id: newId,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
 
  products.push(newProduct);
  
  fs.writeFileSync('productos.json', JSON.stringify(products));
  res.json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
   
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
   
    const deletedProduct = products.splice(productIndex, 1)[0];
   
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;

















