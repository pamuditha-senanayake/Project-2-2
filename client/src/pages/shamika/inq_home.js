import React, {useEffect, useState} from 'react';
import Navigation from '../pamuditha/nav';
import {useNavigate} from 'react-router-dom';
import homepic4 from "../../images/f.jpg"; // Adjust the path if necessary
import Swal from 'sweetalert2'; // Import SweetAlert

const UserProfile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/customer', {
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

    return <InquiriesPage/>;  // Ensure we return the InquiriesPage component
};

function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    // Fetch inquiries on component mount
    useEffect(() => {
        fetch('http://localhost:3001/api/user/inquiries/view', {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                setInquiries(data.inquiries || []);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/user/inquiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({category, message}),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.id) {
                    setInquiries((prevInquiries) => [...prevInquiries, data]);
                }
                setCategory('');
                setMessage('');
            })
            .catch((error) => console.error('Submit error:', error));
    };

    return (
        <div className="flex flex-col h-screen w-full julius-sans-one-regular"
             style={{
                 backgroundImage: `url(${homepic4})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}
        >
            <Navigation/>
            <div className="mt-[150px] flex flex-col w-full items-center justify-center">
                <h1 className="text-4xl font-bold mb-6 text-black">Salon Inquiries</h1>


                <div className="flex flex-row w-full">
                    <div className="flex order-1 w-1/2">

                        <form onSubmit={handleSubmit}
                              className="bg-white p-6 rounded shadow-lg mb-6 w-[80%] h-full mx-auto">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit an Inquiry</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700">Category:</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Hair Services">Hair Services</option>
                                    <option value="Skin Care">Skin Care</option>
                                    <option value="Nail Services">Nail Services</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Message:</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="border rounded p-2 w-full"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded w-full">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>

                    <div className="flex order-2 w-1/2 ">
                        <div className="bg-white p-6 rounded shadow-lg w-[80%] overflow-auto max-h-[400px]">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Inquiries</h2>
                            <div className="grid gap-6">
                                {inquiries.length > 0 ? (
                                    inquiries.map((inquiry) => (
                                        <div key={inquiry.id} className="border rounded p-4 bg-gray-50">
                                            <h3 className="text-lg font-semibold text-pink-600">{inquiry.category}</h3>
                                            <p className="text-gray-800 mb-2">{inquiry.message}</p>
                                            <p className="text-sm text-gray-500">Status: {inquiry.responded ? 'Responded' : 'Pending'}</p>
                                            {inquiry.responded && (
                                                <div className="mt-2 bg-gray-100 p-2 rounded">
                                                    <h4 className="font-semibold">Response:</h4>
                                                    <p>{inquiry.responseMessage}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No inquiries found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div>

            </div>
        </div>
    );
}

export default UserProfile;
