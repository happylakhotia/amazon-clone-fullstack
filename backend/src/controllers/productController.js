import * as productService from "../services/productService.js";

// Get all products matching query and category
export const getProducts = async (req, res, next) => {
  try {
    const { q, cat } = req.query;
    const products = await productService.getAllProducts({ q, cat });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

//Get a specific product detail
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};
