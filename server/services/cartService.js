import db from '../db.js'; // Adjust import according to your project structure

const addOrUpdateItem = async (userId, itemId, quantity) => {
    try {
        const result = await db.query(
            `
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = EXCLUDED.quantity
            RETURNING *
            `,
            [userId, itemId, quantity]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(`Failed to add or update item: ${err.message}`);
    }
};

const getCartItems = async (userId) => {
    try {
        const result = await db.query(
            `
            SELECT
                ci.cart_id,  
                ci.user_id,
                p.id AS product_id,
                p.name AS product_name,
                p.price,
                ci.quantity

            FROM
                cart ci
            JOIN
                products p ON ci.product_id = p.id
            WHERE
                ci.user_id = $1
            `,
            [userId]
        );
        return result.rows;
    } catch (err) {
        throw new Error(`Failed to retrieve cart items: ${err.message}`);
    }
};

const updateItemQuantity = async (cartId, quantity) => {
    try {
        const result = await db.query(
            `
            UPDATE cart
            SET quantity = $1
            WHERE cart_id = $2   -- Updated column name
            RETURNING *
            `,
            [quantity, cartId]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(`Failed to update item quantity: ${err.message}`);
    }
};

const removeItem = async (cartId) => {
    try {
        await db.query(
            `
            DELETE FROM cart
            WHERE cart_id = $1  -- Updated column name
            `,
            [cartId]
        );
    } catch (err) {
        throw new Error(`Failed to remove item from cart: ${err.message}`);
    }
};

export default {
    addOrUpdateItem,
    getCartItems,
    updateItemQuantity,
    removeItem
};
