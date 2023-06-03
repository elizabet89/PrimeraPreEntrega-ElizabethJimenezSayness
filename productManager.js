
const fs = require('fs');
class ProductManager {
  constructor() {
    this.products = [];
    this.Id = 1;
    this.path = './productos.json';
  }

  addProduct(product) {

    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return "Todos los campos son obligatorios";
    }

  
    this.products.forEach(product => {
      if (product.code === code) {
        return "El producto ya existe";
      }
    });

    let producto = {
      id: this.Id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock
    };
    
    this.products.push(producto);
    this.Id++;
    return "Producto agregado exitosamente";
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      return ('Error al leer el archivo de productos:', error ,[]);
      
    }
  }

  

  getProductById(id) {

    try {
      const data = fs.readFileSync(this.path, 'utf8');
      const products = JSON.parse(data);
      const product = products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        return 'Producto no encontrado';
      }
    } catch (error) {
     
      return 'Error al leer el archivo de productos';
    }
  }


  updateProduct(id, updatedProduct) {

    try {
      const data = fs.readFileSync(this.path, 'utf8');
      let products = JSON.parse(data);
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex !== -1) {
        const { id: productId, ...rest } = products[productIndex];
        products[productIndex] = { id: productId, ...updatedProduct, ...rest };
        fs.writeFileSync(this.path, JSON.stringify(products), 'utf8');
        return "Producto actualizado correctamente";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
    
      return 'Error al actualizar el producto';
    }

    }

    deleteProduct(id) {
      try {
        const data = fs.readFileSync(this.path, 'utf8');
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
          products.splice(productIndex, 1);
          fs.writeFileSync(this.path, JSON.stringify(products), 'utf8');
          return "Producto eliminado correctamente";
        } else {
          return "Producto no encontrado";
        }
      } catch (error) {
        return "Error al eliminar el producto";
      }
    }
}
module.exports = ProductManager;