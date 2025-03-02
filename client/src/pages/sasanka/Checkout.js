import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import homepic6 from "../../images/e.jpg";

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
                const response = await fetch('https://servertest-isos.onrender.com/api/user/cartget', {
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
        const {name, value} = e.target;
        setShippingDetails({...shippingDetails, [name]: value});
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
            const response = await fetch('https://servertest-isos.onrender.com/api/user/checkout', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingDetails,
                    cartItems,
                }),
                credentials: 'include',
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
            console.error('Error during checkout:', error);
        }
    };

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (

        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-12"
             style={{
                 backgroundImage: `url(${homepic6})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 minHeight: "100vh",
                 padding: "20px",
             }}
        >
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg mt-20 shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleCheckout}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={shippingDetails.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-lg font-medium mb-2">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingDetails.address}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-lg font-medium mb-2">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingDetails.city}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className="block text-lg font-medium mb-2">Contact
                                Number</label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                value={shippingDetails.contactNumber}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
                        <ul className="space-y-2">
                            {cartItems.map(item => (
                                <li key={item.cart_id} className="flex justify-between text-lg">
                                    <span>{item.product_name}</span>
                                    <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-xl mt-4">
                            <span>Total Cost</span>
                            <span>Rs.{totalCost.toFixed(2)}</span>
                        </div>
                    </div>

                    <button

                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer shadow-md hover:bg-gray-800 transition-transform duration-200 transform hover:scale-105"
                    >
                        Confirm Purchase
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;