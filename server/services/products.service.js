import db from '../db.js';

// Get all products
const getAllProducts = async () => {
    const records = await db.query("SELECT * FROM products");
    return records.rows;
};

// Get product by ID
const getProductById = async (id) => {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        throw new Error('Invalid product ID');
    }
    const record = await db.query("SELECT * FROM products WHERE id = $1", [productId]);
    return record.rows[0];
};

// Delete product by ID
const deleteProduct = async (id) => {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        throw new Error('Invalid product ID');
    }
    const affectedRows = await db.query("DELETE FROM products WHERE id = $1", [productId]);
    return affectedRows.rowCount;
};

// Add new product
const addProduct = async (productData) => {
    const { title, price, category, description, quantity, image } = productData;
    const result = await db.query(
        "INSERT INTO products (title, price, category, description, quantity, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, price, category, description, quantity, image]
    );
    return result.rows[0];
};

// Update product
const updateProduct = async (id, productData) => {
    const { title, price, category, description, quantity, image } = productData;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        throw new Error('Invalid product ID');
    }
    const result = await db.query(
        "UPDATE products SET title = $1, price = $2, category = $3, description = $4, quantity = $5, image = $6 WHERE id = $7 RETURNING *",
        [title, price, category, description, quantity, image, productId]
    );
    return result.rows[0];
};

// Get product statistics
const getStats = async () => {
    try {
        const totalProductsResult = await db.query("SELECT COUNT(*) FROM products");
        const totalValueResult = await db.query("SELECT COALESCE(SUM(price * quantity), 0) AS totalValue FROM products");
        const outOfStockResult = await db.query("SELECT COUNT(*) FROM products WHERE quantity = 0");

        return {
            totalProducts: parseInt(totalProductsResult.rows[0].count, 10),
            totalValue: parseFloat(totalValueResult.rows[0].totalValue),
            outOfStock: parseInt(outOfStockResult.rows[0].count, 10),
        };
    } catch (error) {
        console.error('Error in getStats:', error);
        throw error;
    }
};

export default {
    getAllProducts,
    getProductById,
    deleteProduct,
    addProduct,
    updateProduct,
    getStats,
};
