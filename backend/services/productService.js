const Product = require('../models/Product');

const productService = {
  // Get all products for a user
  async getUserProducts(userId) {
    try {
      return await Product.find({ userId });
    } catch (error) {
      throw error;
    }
  },

  // Create a new product
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  },

  // Update a product
  async updateProduct(productId, userId, productData) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.userId !== userId) {
        throw new Error('Not authorized');
      }

      Object.keys(productData).forEach(key => {
        if (key !== 'userId') {
          product[key] = productData[key];
        }
      });

      return await product.save();
    } catch (error) {
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(productId, userId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.userId !== userId) {
        throw new Error('Not authorized');
      }

      await product.deleteOne();
      return { message: 'Product deleted' };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = productService; 