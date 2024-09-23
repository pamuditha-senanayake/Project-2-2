import pool from "../db.js"; // Adjust import path as necessary

const checkout = async (userId, shippingDetails, cartItems) => {
    const client = await pool.connect(); // Get a client from the pool

    try {
        await client.query('BEGIN'); // Start transaction

        // Calculate total cost
        const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Insert order into orders table
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, shipping_details, total_cost) VALUES ($1, $2, $3) RETURNING id',
            [userId, shippingDetails, totalCost]
        );

        const orderId = orderResult.rows[0].id;

        // Insert each item into order_items table
        for (const item of cartItems) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Clear cart after checkout
        await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        await client.query('COMMIT'); // Commit transaction

        return { message: 'Checkout successful', orderId };
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw new Error(`Checkout failed: ${err.message}`);
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export default {
    checkout,
};
