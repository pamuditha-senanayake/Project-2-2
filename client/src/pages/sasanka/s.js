import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../'
function OrderPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                setOrders(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Order Page</h1>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        Order ID: {order._id} - Total: ${order.totalPrice}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrderPage;
