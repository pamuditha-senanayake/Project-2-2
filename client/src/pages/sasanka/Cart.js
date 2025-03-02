import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from '../pamuditha/nav';
import Swal from 'sweetalert2';


const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/customer', {
                    credentials: 'include' // Include credentials with the request
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (!data.isUser) {
                    navigate('/'); // Redirect if the user is not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        checkUser();
    }, [navigate]);

    useEffect(() => {
        // Fetch the user's cart
        const fetchCart = async () => {
            try {
                const response = await fetch(`https://servertest-isos.onrender.com/api/user/cartget`, {
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
                Swal.fire({
                    title: "Invalid Quantity",
                    text: "Quantity must be at least 1.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }


            const response = await fetch(`https://servertest-isos.onrender.com/api/cart/update/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({quantity: newQuantity}),
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
                    item.cart_id === cartItemId ? {...item, quantity: newQuantity} : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        // Show confirmation popup
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await fetch(`https://servertest-isos.onrender.com/api/user/remove/${cartItemId}`, {
                    method: "DELETE",
                    credentials: 'include',
                });
                // Update the state to remove the deleted cart item
                setCart(cart.filter(item => item.cart_id !== cartItemId));
                // Show success popup
                Swal.fire({
                    title: 'Removed!',
                    text: 'Your item has been removed from the cart.',
                    icon: 'success'
                });
            } catch (error) {
                console.error("Error removing item:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to remove item.',
                    icon: 'error'
                });
            }
        }
    };


    const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (

        <div

            className="flex flex-col w-full min-h-screen bg-gray-100 p-6 mt-[100px] md:p-10"
            style={{fontFamily: 'Roboto, sans-serif', backgroundColor: '#f7fafc', padding: '20px'}}

        >
            <Navbar/>
            {loading &&
                <p style={{color: '#718096', textAlign: 'center', marginBottom: '16px'}}>Loading your cart...</p>}
            {error && <p style={{color: '#f56565', textAlign: 'center', marginBottom: '16px'}}>{error}</p>}
            {!loading && !error && (
                <div className="flex flex-col md:flex-row w-full mt-4">

                    <div

                        className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300"
                        style={{
                            backgroundColor: '#fff',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h2
                            className="text-3xl font-semibold mb-6 text-gray-800"
                            style={{fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1a202c'}}
                        >
                            Shopping Cart
                        </h2>
                        {cart.length === 0 ? (
                            <p style={{color: '#718096', textAlign: 'center'}}>Your cart is empty.</p>
                        ) : (
                            <table
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#f7fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                <thead>

                                <tr style={{backgroundColor: '#edf2f7', borderBottom: '1px solid #e2e8f0'}}>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontWeight: '500',
                                        color: '#4a5568'
                                    }}>Product
                                    </th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontWeight: '500',
                                        color: '#4a5568'
                                    }}>Quantity
                                    </th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontWeight: '500',
                                        color: '#4a5568'
                                    }}>Price
                                    </th>
                                    <th style={{
                                        padding: '16px',
                                        textAlign: 'left',
                                        fontWeight: '500',
                                        color: '#4a5568'
                                    }}>Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map((item) => (
                                    <tr key={item.cart_id} style={{
                                        borderBottom: '1px solid #e2e8f0',
                                        transition: 'background-color 0.2s'
                                    }}>
                                        <td style={{padding: '16px', display: 'flex', alignItems: 'center'}}>
                                            <img

                                                src={item.product_image ? `https://servertest-isos.onrender.com/uploads/${item.product_image}` : 'default-image-url'}
                                                alt={item.product_title}
                                                style={{
                                                    width: '96px',
                                                    height: '96px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginRight: '16px'
                                                }}
                                            />
                                            <span style={{
                                                color: '#1a202c',
                                                fontWeight: '500'
                                            }}>{item.product_title}</span>
                                        </td>

                                        <td style={{padding: '16px'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <button
                                                    className="flex items-center bg-pink-300 text-white font-bold px-3 py-2 rounded-lg shadow-md cursor-pointer hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-110"
                                                    aria-label="Decrease quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity - 1)}
                                                    // style={{
                                                    //     backgroundColor: '#edb9e8',
                                                    //     color: '#fff',
                                                    //     fontWeight: '700',
                                                    //     padding: '8px 16px',
                                                    //     borderRadius: '8px',
                                                    //     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    //     cursor: 'pointer',
                                                    // }}
                                                >
                                                    -
                                                </button>
                                                <span
                                                    style={{fontSize: '18px', fontWeight: '600'}}>{item.quantity}</span>
                                                <button
                                                    className="flex items-center bg-pink-300 text-white font-bold px-3 py-2 rounded-lg shadow-md cursor-pointer hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-110"

                                                    aria-label="Increase quantity"
                                                    onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}
                                                    // style={{
                                                    //     backgroundColor: '#edb9e8',
                                                    //     color: '#fff',
                                                    //     fontWeight: '700',
                                                    //     padding: '8px 16px',
                                                    //     borderRadius: '8px',
                                                    //     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    //     cursor: 'pointer',
                                                    //
                                                    // }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '16px',
                                            color: '#1a202c'
                                        }}>Rs.{(item.price * item.quantity).toFixed(2)}</td>
                                        <td style={{padding: '16px'}}>
                                            <button

                                                className="flex items-center bg-pink-800 text-white font-bold px-3 py-2 rounded-lg shadow-md cursor-pointer hover:bg-pink-500 transition duration-300 ease-in-out transform hover:scale-110"

                                                onClick={() => handleRemoveItem(item.cart_id)}
                                                // style={{
                                                //     backgroundColor: '#ad4982',
                                                //     color: '#fff',
                                                //     fontWeight: '700',
                                                //     padding: '8px 16px',
                                                //     borderRadius: '8px',
                                                //     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                //     cursor: 'pointer',
                                                // }}
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
                        style={{
                            backgroundColor: '#fff',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            marginTop: '16px'
                        }}
                    >
                        <h2
                            className="text-3xl font-semibold mb-6 text-gray-800"
                            style={{fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1a202c'}}
                        >
                            Cart Summary
                        </h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                            fontSize: '18px',
                            fontWeight: '500',
                            color: '#1a202c'
                        }}>
                            <p>Total Cost</p>
                            <p>Rs.{totalCost.toFixed(2)}</p>
                        </div>
                        <button
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer shadow-md transition-transform duration-200 transform hover:scale-105"

                            onClick={handleCheckout}
                            // style={{
                            //     width: '100%',
                            //     backgroundColor: '#000',
                            //     color: '#fff',
                            //     padding: '12px 0',
                            //     borderRadius: '16px',
                            //     fontWeight: '600',
                            //     cursor: 'pointer',
                            //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            //     transition: 'background-color 0.2s',
                            // }}
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