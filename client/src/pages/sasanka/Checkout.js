import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar"; // Ensure this path is correct

const Checkout = () => {
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        address: "",
        city: "",
        contactNumber: "",
    });
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(""); // For error messages
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/cartget', {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                setError("Failed to load cart items. Please try again later.");
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    const validatePhoneNumber = (number) => {
        const phonePattern = /^[0-9]{10}$/; // Simple validation for a 10-digit phone number
        return phonePattern.test(number);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!validatePhoneNumber(shippingDetails.contactNumber)) {
            setError("Please enter a valid 10-digit contact number.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/user/checkout', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingDetails,
                    cartItems,
                }),
                credentials: 'include', // Include credentials to handle authentication
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Checkout successful:', result);
                navigate('/addpayment');
            } else {
                throw new Error(result.message || 'Checkout failed');
            }
        } catch (error) {
            setError("Checkout failed. Please try again.");
            console.error('Error during checkout:', error); // Debug log
        }
    };

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-8">
            <NavigationBar activeTab={4} />
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="max-w-4xl w-full mx-auto bg-white p-12 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Checkout</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleCheckout}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={shippingDetails.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-lg font-medium mb-2">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingDetails.address}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="city" className="block text-lg font-medium mb-2">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingDetails.city}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contactNumber" className="block text-lg font-medium mb-2">Contact Number</label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                value={shippingDetails.contactNumber}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                            <ul>
                                {cartItems.map(item => (
                                    <li key={item.cart_id} className="flex justify-between mb-2">
                                        <span>{item.product_name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between font-semibold mt-2">
                                <span>Total Cost</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                        >
                            Confirm Purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
