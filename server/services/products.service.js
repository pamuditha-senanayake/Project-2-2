import db from '../db.js';

const getAllProducts = async () => {
    const records = await db.query("SELECT * FROM products");
    return records.rows;
};

const getProductById = async (id) => {
    const record = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    return record.rows[0];
};

const deleteProduct = async (id) => {
    const affectedRows = await db.query("DELETE FROM products WHERE id = $1", [id]);
    return affectedRows.rowCount;
};

const addProduct = async (productData) => {
    const {title, price, category, description, quantity, image} = productData;
    const result = await db.query(
        "INSERT INTO products (title, price, category, description, quantity, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, price, category, description, quantity, image]
    );
    return result.rows[0];
};

const updateProduct = async (id, productData) => {
    const {title, price, category, description, quantity, image} = productData;
    const result = await db.query(
        "UPDATE products SET title = $1, price = $2, category = $3, description = $4, quantity = $5, image = $6   WHERE id = $7 RETURNING *",
        [title, price, category, description, quantity, image, id]
    );
    return result.rows[0];
};



export default {
    getAllProducts,
    getProductById,
    deleteProduct,
    addProduct,
    updateProduct

};