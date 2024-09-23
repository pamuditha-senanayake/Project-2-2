import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../pamuditha/nav';

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's cart
        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/user/cartget`, {
                    credentials: 'include',
                });
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
    }, []);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative or zero quantity

        const originalQuantity = cart.find(item => item.cart_id === cartItemId).quantity;

        // Optimistic UI update
        setCart(cart.map(item =>
            item.cart_id === cartItemId ? { ...item, quantity: newQuantity } : item
        ));

        try {
            const response = await fetch(`http://localhost:3001/api/user/update/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
                credentials: 'include', // Ensure this is included to send cookies
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            setError('Failed to update item quantity.');
            // Revert UI in case of error
            setCart(cart.map(item =>
                item.cart_id === cartItemId ? { ...item, quantity: originalQuantity } : item
            ));
        }
    };


    const handleRemoveItem = async (cartItemId) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/user/remove/${cartItemId}`, {
                    method: "DELETE",
                    credentials: 'include',
                });

                if (response.ok) {
                    setCart(cart.filter(item => item.cart_id !== cartItemId));
                } else {
                    console.error('Failed to remove item, status:', response.status);
                    setError('Failed to remove item.');
                }
            } catch (error) {
                console.error('Error removing item:', error);
                setError('Error removing item.');
            }
        }
    };

    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-6 mt-[100px] md:p-10" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <Navbar />
            {loading && <p className="text-gray-600 text-center mb-4">Loading your cart...</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {!loading && !error && (
                <div className="flex flex-col md:flex-row w-full mt-4">
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
                                    <tr key={item.cart_id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="p-4 flex items-center">
                                            <img
                                                src={`data:image/jpeg;base64,${item.image}`}
                                                alt={item.product_name}
                                                className="w-24 h-24 object-cover rounded-lg shadow-sm mr-4"
                                            />
                                            <span className="text-gray-800 font-medium">{item.product_name}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    aria-label="Decrease quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity - 1)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-semibold">{item.quantity}</span>
                                                <button
                                                    aria-label="Increase quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleRemoveItem(item.cart_id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
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

                    {/* Cart Summary */}
                    <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300 mt-4 md:mt-0">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Cart Summary</h2>
                        <div className="flex justify-between mb-4 text-lg font-medium text-gray-800">
                            <p>Total Cost</p>
                            <p>${totalCost.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-3 rounded-xl shadow-md hover:bg-gray-800 font-semibold"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
