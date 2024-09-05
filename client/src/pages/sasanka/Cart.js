import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar"; // Ensure you have this component

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = 1; // Replace with actual logic to fetch user ID dynamically

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/cart?userId=${userId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCart(data);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setError('Failed to load cart.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative or zero quantity

        fetch(`http://localhost:3001/api/cart/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, itemId, quantity: newQuantity }),
        })
            .then(() => {
                setCart(cart.map(item =>
                    item.product_id === itemId ? { ...item, quantity: newQuantity } : item
                ));
            })
            .catch(error => console.error("Error updating quantity:", error));
    };

    const handleRemoveItem = (itemId) => {
        fetch(`http://localhost:3001/api/cart/${userId}/${itemId}`, { method: "DELETE" })
            .then(() => {
                setCart(cart.filter(item => item.product_id !== itemId));
            })
            .catch(error => console.error("Error removing item:", error));
    };

    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-6 md:p-10" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <NavigationBar activeTab={3} />
            {loading && <p className="text-gray-600 text-center mb-4">Loading your cart...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {!loading && !error && (
                <div className="flex flex-col md:flex-row w-full mt-4">
                    {/* Left side - Cart Items */}
                    <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Shopping Cart</h2>
                        {cart.length === 0 ? (
                            <p className="text-gray-600 text-center">Your cart is empty.</p>
                        ) : (
                            <table className="w-full bg-gray-50 border border-gray-200 rounded-lg">
                                <thead>
                                <tr className="bg-gray-200 border-b">
                                    <th className="p-4 text-left font-medium text-gray-700">Product</th>
                                    <th className="p-4 text-left font-medium text-gray-700">Quantity</th>
                                    <th className="p-4 text-left font-medium text-gray-700">Price</th>
                                    <th className="p-4 text-left font-medium text-gray-700">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map((item) => (
                                    <tr key={item.product_id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="p-4 flex items-center">
                                            <img
                                                src={`data:image/jpeg;base64,${item.image}`} // Assuming `item.image` contains base64 image data
                                                alt={item.product_name}
                                                className="w-24 h-24 object-cover rounded-lg shadow-sm mr-4"
                                                style={{ border: '1px solid #e2e8f0' }}
                                            />
                                            <span className="text-gray-800" style={{ fontSize: '1rem', fontWeight: '500' }}>{item.product_name}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                                    style={{ border: 'none', outline: 'none' }}
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-semibold" style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                                    style={{ border: 'none', outline: 'none' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                                style={{ border: 'none', outline: 'none' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Right side - Summary */}
                    <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300 mt-4 md:mt-0">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Cart Summary</h2>
                        <hr className="my-4 border-gray-300" />
                        <div className="flex justify-between mb-4 text-lg font-medium text-gray-800">
                            <p>Total Cost</p>
                            <p>${totalCost.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-3 rounded-xl shadow-md hover:bg-gray-900 transition duration-300"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
