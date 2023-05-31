const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz GET /api/products
router.get('/', (req, res) => {
  // Leer el archivo productos.json y devolver los productos
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  res.json(products);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  // Leer el archivo productos.json y encontrar el producto con el id proporcionado
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find((item) => item.id === productId);
  res.json(product);
});

// Ruta POST /api/products
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  // Leer el archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  // Generar un nuevo id para el producto
  const newId = generateId();
  // Crear el nuevo producto
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
  // Agregar el nuevo producto al arreglo de productos
  products.push(newProduct);
  // Escribir los productos actualizados en el archivo productos.json
  fs.writeFileSync('productos.json', JSON.stringify(products));
  res.json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  // Leer el archivo productos.json y encontrar el producto con el id proporcionado
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    // Actualizar el producto con los campos enviados desde el body
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    // Escribir los productos actualizados en el archivo productos.json
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  // Leer el archivo productos.json y encontrar el producto con el id proporcionado
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    // Eliminar el producto del arreglo de productos
    const deletedProduct = products.splice(productIndex, 1)[0];
    // Escribir los productos actualizados en el archivo productos.json
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;

















// const express = require('express');
// const router = express.Router();

// // Ruta raíz GET /api/products
// router.get('/', (req, res) => {
//   // Lógica para listar todos los productos de la base
//   res.send('Listado de productos');
// });

// // Ruta GET /api/products/:pid
// router.get('/:pid', (req, res) => {
//   const productId = req.params.pid;
//   // Lógica para obtener el producto con el id proporcionado
//   res.send(`Detalle del producto con ID: ${productId}`);
// });
// module.exports = router;