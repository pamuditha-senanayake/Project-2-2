import React, { useState, useEffect } from "react";

const AdminOrderView = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/shipping", {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError("Failed to load orders. Please try again later.");
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Order Management</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Customer Name</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">City</th>
                        <th className="px-4 py-2">Contact Number</th>
                        <th className="px-4 py-2">Cart Items</th>
                        <th className="px-4 py-2">Total Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td className="border px-4 py-2">{order._id}</td>
                            <td className="border px-4 py-2">{order.shippingDetails.name}</td>
                            <td className="border px-4 py-2">{order.shippingDetails.address}</td>
                            <td className="border px-4 py-2">{order.shippingDetails.city}</td>
                            <td className="border px-4 py-2">{order.shippingDetails.contactNumber}</td>
                            <td className="border px-4 py-2">
                                <ul>
                                    {order.cartItems.map(item => (
                                        <li key={item.cart_id}>{item.product_name} - {item.quantity} pcs</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border px-4 py-2">
                                ${order.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderView;
