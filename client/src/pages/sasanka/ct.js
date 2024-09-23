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
        try {
            if (newQuantity < 1) {
                alert("Quantity must be at least 1.");
                return;
            }

            const response = await fetch(`http://localhost:3001/api/cart/update/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
                credentials: "include", // Ensure authentication is included
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const updatedItem = await response.json();
            console.log("Item updated successfully:", updatedItem);

            // Update the cart state with the new quantity
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.cart_id === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const confirmRemove = window.confirm("Are you sure you want to remove this item?");
            if (!confirmRemove) return;

            await fetch(`http://localhost:3001/api/user/remove/${cartItemId}`, {
                method: "DELETE",
                credentials: 'include',
            });
            setCart(cart.filter(item => item.cart_id !== cartItemId));
        } catch (error) {
            console.error("Error removing item:", error);
            setError('Failed to remove item.');
        }
    };

    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div
            className="flex flex-col w-full min-h-screen bg-gray-100 p-6 mt-[100px] md:p-10"
            style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#f7fafc', padding: '20px' }}
        >
            <Navbar />
            {loading && <p style={{ color: '#718096', textAlign: 'center', marginBottom: '16px' }}>Loading your cart...</p>}
            {error && <p style={{ color: '#f56565', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
            {!loading && !error && (
                <div className="flex flex-col md:flex-row w-full mt-4">
                    <div
                        className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300"
                        style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    >
                        <h2
                            className="text-3xl font-semibold mb-6 text-gray-800"
                            style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1a202c' }}
                        >
                            Shopping Cart
                        </h2>
                        {cart.length === 0 ? (
                            <p style={{ color: '#718096', textAlign: 'center' }}>Your cart is empty.</p>
                        ) : (
                            <table
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg"
                                style={{ width: '100%', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            >
                                <thead>
                                <tr style={{ backgroundColor: '#edf2f7', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', color: '#4a5568' }}>Product</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', color: '#4a5568' }}>Quantity</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', color: '#4a5568' }}>Price</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', color: '#4a5568' }}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map((item) => (
                                    <tr key={item.cart_id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                                        <td style={{padding: '16px', display: 'flex', alignItems: 'center'}}>
                                            <img
                                                src={selectedProduct.image ? `http://localhost:3001/uploads/${selectedProduct.image}` : 'default-image-url'}
                                                alt={selectedProduct.title}
                                                style={{
                                                    width: '96px',
                                                    height: '96px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginRight: '16px'
                                                }}
                                            />

                                            <span
                                                style={{color: '#1a202c', fontWeight: '500'}}>{item.product_name}</span>
                                        </td>
                                        <td style={{padding: '16px'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <button
                                                    aria-label="Decrease quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity - 1)}
                                                    style={{
                                                        backgroundColor: '#4299e1',
                                                        color: '#fff',
                                                        fontWeight: '700',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontSize: '18px', fontWeight: '600' }}>{item.quantity}</span>
                                                <button
                                                    aria-label="Increase quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}
                                                    style={{
                                                        backgroundColor: '#4299e1',
                                                        color: '#fff',
                                                        fontWeight: '700',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#1a202c' }}>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td style={{ padding: '16px' }}>
                                            <button
                                                onClick={() => handleRemoveItem(item.cart_id)}
                                                style={{
                                                    backgroundColor: '#f56565',
                                                    color: '#fff',
                                                    fontWeight: '700',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                }}
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
                    <div
                        className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300 mt-4 md:mt-0"
                        style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginTop: '16px' }}
                    >
                        <h2
                            className="text-3xl font-semibold mb-6 text-gray-800"
                            style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1a202c' }}
                        >
                            Cart Summary
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: '500', color: '#1a202c' }}>
                            <p>Total Cost</p>
                            <p>${totalCost.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            style={{
                                width: '100%',
                                backgroundColor: '#000',
                                color: '#fff',
                                padding: '12px 0',
                                borderRadius: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#000')}
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