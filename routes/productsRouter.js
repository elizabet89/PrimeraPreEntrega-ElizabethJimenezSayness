const express = require('express');
const fs = require('fs');
const router = express.Router();

//============================
const ProductManager = require('../productManager');
const productManager = new ProductManager();

//============================

// Ruta raíz GET /api/products
router.get('/', (req, res) => {
  const products =productManager.getProducts();
  res.json(products);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = productManager.getProductById(productId);
  res.json(product);
});

// Ruta POST /api/products
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

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
 
  const message = productManager.addProduct(newProduct);

  const productsData = fs.readFileSync(productosFilePath, 'utf8');
  const products = JSON.parse(productsData);

  
  products.push(newProduct);

  fs.writeFileSync(productosFilePath, JSON.stringify(products), 'utf8');

  res.send(message);
  // products.push(newProduct);
  
  // fs.writeFileSync('productos.json', JSON.stringify(products));
  // res.json(newProduct);

});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const message = productManager.updateProduct( productId, updatedProduct);

  const productsData = fs.readFileSync(productosFilePath, 'utf8');
  const products = JSON.parse(productsData);
  const productIndex = products.findIndex(product => product.id ===  productId);

  if (productIndex !== -1) {
    
    products[productIndex] = updatedProduct;

    fs.writeFileSync(productosFilePath, JSON.stringify(products), 'utf8');
  }

  res.send(message);
  

});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const message = productManager.deleteProduct(productId);

  const productsData = fs.readFileSync(productosFilePath, 'utf8');
  const products = JSON.parse(productsData);

  const updatedProducts = products.filter(product => product.id !== productId );

  fs.writeFileSync(productosFilePath, JSON.stringify(updatedProducts), 'utf8');

  res.send(message);

});

module.exports = router;

















