import db from '../db.js';

// Get all products
const getAllProducts = async () => {
    const records = await db.query("SELECT * FROM products");
    return records.rows;
};

// Get product by ID
const getProductById = async (id) => {
    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
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


// service.js (or your service file)

const getProductStats = async () => {
    try {
        // Query to get the total count of products that are in stock
        const totalProductsQuery = await db.query(
            "SELECT COUNT(*) AS total FROM products WHERE quantity > 0"
        );

        // Query to get the total value of in-stock products (price * quantity)
        const totalValueQuery = await db.query(
            "SELECT SUM(price * quantity) AS totalValue FROM products WHERE quantity > 0"
        );

        // Query to get the count of products that are out of stock
        const outOfStockQuery = await db.query(
            "SELECT COUNT(*) AS outOfStock FROM products WHERE quantity = 0"
        );

        return {
            totalProducts: totalProductsQuery.rows[0].total || 0, // Ensure a default of 0 if no data
            totalStoreValue: totalValueQuery.rows[0].totalvalue || 0, // Ensure 0 if sum is null
            outOfStock: outOfStockQuery.rows[0].outofstock || 0 // Default to 0 if no out-of-stock items
        };
    } catch (error) {
        throw new Error("Error fetching product stats: " + error.message);
    }
};




export default {
    getAllProducts,
    getProductById,
    deleteProduct,
    addProduct,
    updateProduct,
    getProductStats,
};
