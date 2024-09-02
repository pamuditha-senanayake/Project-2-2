import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../sasanka/NavigationBar"; // Ensure this path is correct

const Checkout = () => {
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [cartItems, setCartItems] = useState([]); // Assume this is populated from a global state or context
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    // Calculate total cost
    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Handle checkout submission
    const handleCheckout = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingDetails,
                    cartItems,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Checkout successful:', result);

            // Redirect to confirmation page or thank you page
            navigate('/thank-you');
        } catch (error) {
            console.error('Error during checkout:', error);
            // Optionally handle errors or display an error message
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-8">
            <NavigationBar activeTab={4}/>
            <div className="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-bold mb-6">Checkout</h2>
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
                        <label htmlFor="postalCode" className="block text-lg font-medium mb-2">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingDetails.postalCode}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-lg font-medium mb-2">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={shippingDetails.country}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.item_id} className="flex justify-between mb-2">
                                    <span>{item.name}</span>
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
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer text-white"
                    >
                        Complete Purchase
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
