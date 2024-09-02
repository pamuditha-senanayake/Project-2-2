import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../sasanka/NavigationBar"; // Ensure you have this component

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const userId = 1; // Example user ID

    useEffect(() => {
        // Fetch cart items from the backend
        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:5000/cart/${userId}`);
                const data = await response.json();
                setCart(data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateQuantity = (itemId, newQuantity) => {
        fetch(`http://localhost:5000/cart/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, quantity: newQuantity }),
        })
            .then(() => {
                setCart(cart.map(item => item.item_id === itemId ? { ...item, quantity: newQuantity } : item));
            })
            .catch(error => console.error("Error updating quantity:", error));
    };

    const handleRemoveItem = (itemId) => {
        fetch(`http://localhost:5000/cart/${userId}/${itemId}`, { method: "DELETE" })
            .then(() => {
                setCart(cart.filter(item => item.item_id !== itemId));
            })
            .catch(error => console.error("Error removing item:", error));
    };

    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            <NavigationBar activeTab={3} />

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Cart Items */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                    <table className="w-full bg-gray-200 border-collapse">
                        <thead>
                        <tr className="bg-gray-300">
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map((item) => (
                            <tr key={item.item_id} className="border-b">
                                <td className="p-2 flex items-center">
                                    <img
                                        src={`data:image/jpeg;base64,${item.image}`} // Assuming `item.image` contains base64 image data
                                        alt="Product"
                                        style={{ width: '100px', height: 'auto' }}
                                        className="mr-4"
                                    />
                                    <span>{item.name}</span>
                                </td>
                                <td className="p-2">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.item_id, item.quantity - 1)}
                                            className="bg-blue-300 hover:bg-blue-400 p-1 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.item_id, item.quantity + 1)}
                                            className="bg-blue-300 hover:bg-blue-400 p-1 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="p-2">${item.price.toFixed(2)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleRemoveItem(item.item_id)}
                                        className="bg-red-300 hover:bg-red-400 p-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Right side - Summary */}
                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>
                    <hr className="my-4" />
                    <div className="flex justify-between mb-4">
                        <p>Total Cost</p>
                        <p>${totalCost.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
