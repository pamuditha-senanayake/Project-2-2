import db from '../db.js'; // Adjust import path as necessary

const getAllProducts = async () => {
    try {
        const result = await db.query("SELECT * FROM products");
        return result.rows;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
};

export default {
    getAllProducts
};
