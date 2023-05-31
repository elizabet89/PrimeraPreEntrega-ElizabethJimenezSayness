const express = require('express');
const app = express();
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

// Configuración de los enrutadores
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



const port = 8081;


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});