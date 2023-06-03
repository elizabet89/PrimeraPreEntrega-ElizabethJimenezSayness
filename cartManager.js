const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CartManager {
  
  
   createCart(products = []) {
       const cartId = uuidv4();

    const newCart = {
      id: cartId,
      products: products || [],
    };

    const cartsData = fs.readFileSync('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);
    carts.push(newCart);

    fs.writeFileSync('carrito.json', JSON.stringify(carts), 'utf8');
    return newCart;
  }
  getCartById(cartId) {
    const cartsData = fs.readFileSync('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find((cart) => cart.id === cartId);
    return cart ? cart.products : null;
  }
  addProductToCart(cartId, productId, quantity = 1) {
    const cartsData = fs.readFileSync('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);

    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      carts[cartIndex] = cart;

      fs.writeFileSync('carrito.json', JSON.stringify(carts), 'utf8');

      return cart;
    }

    return null;
  }
}

module.exports = CartManager;
