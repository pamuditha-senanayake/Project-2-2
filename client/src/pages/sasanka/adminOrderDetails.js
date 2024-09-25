import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar"; // Ensure this path is correct

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/order', {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to load orders.');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError("Failed to load orders. Please try again later.");
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to update status.');
            const updatedOrder = await response.json();
            setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
        } catch (error) {
            setError("Failed to update order status.");
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-8">
            <NavigationBar activeTab={2} />
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="max-w-6xl w-full mx-auto bg-white p-12 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Admin Order Management</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <table className="table-auto w-full text-left">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">Order ID</th>
                            <th className="px-4 py-2">User ID</th>
                            <th className="px-4 py-2">Shipping Address</th>
                            <th className="px-4 py-2">Total Cost</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="border px-4 py-2">{order.id}</td>
                                <td className="border px-4 py-2">{order.user_id}</td>
                                <td className="border px-4 py-2">{order.shipping_details.address}</td>
                                <td className="border px-4 py-2">${order.total_cost.toFixed(2)}</td>
                                <td className="border px-4 py-2">{order.status}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Mark as Shipped
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Mark as Delivered
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderManagement;
