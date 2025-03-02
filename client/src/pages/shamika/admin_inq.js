import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import homepic4 from "../../images/f.jpg";

const Layout = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]); // State to hold inquiries
    const [selectedInquiry, setSelectedInquiry] = useState(null); // State to manage selected inquiry for response
    const [responseMessage, setResponseMessage] = useState(''); // State for the response message
    const [filter, setFilter] = useState('all'); // State to manage filter selection

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
                    credentials: 'include' // Include credentials with the request
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/'); // Redirect if the user is not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        checkAdmin(); // Call the checkAdmin function
        fetchInquiries(); // Fetch inquiries when component mounts
    }, [navigate]);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('https://servertest-isos.onrender.com/api/user/inquiries/viewall', {
                credentials: 'include'
            });
            console.log('Inquiries Response:', response); // Log response
            const data = await response.json();
            console.log('Inquiries Data:', data); // Log data
            setInquiries(data.inquiries); // Set the inquiries state
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        }
    };

    const handleResponse = async (inquiry) => {
        // Handle sending the response
        try {
            const response = await fetch(`https://servertest-isos.onrender.com/api/user/inquiries/${inquiry.id}/respond`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: responseMessage})
            });
            if (response.ok) {
                setResponseMessage(''); // Clear the response message
                fetchInquiries(); // Optionally refetch inquiries here to refresh the list
            } else {
                console.error('Failed to send response.');
            }
        } catch (error) {
            console.error('Error sending response:', error);
        }
    };

    // Count the number of not responded inquiries
    const notRespondedCount = inquiries.filter(inquiry => !inquiry.responded).length;

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="flex flex-col h-screen w-full julius-sans-one-regular">
                    <div className="pt-[20px] h-full flex flex-col w-full items-center justify-center">
                        <h1 className="text-4xl font-bold mb-6 text-black">Admin - Manage Inquiries</h1>

                        {/* Display the count of not responded inquiries */}


                        <div className="bg-white p-6 rounded shadow-lg w-[80%] overflow-auto h-[80%]">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inquiries</h2>

                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-red-600 mb-4">
                                    Not Responded Inquiries: {notRespondedCount}
                                </h2>
                                <label htmlFor="inquiryFilter" className="block mb-2 font-semibold">Filter
                                    Inquiries:</label>

                                <select
                                    id="inquiryFilter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="all">All Inquiries</option>
                                    <option value="responded">Responded</option>
                                    <option value="notResponded">Not Responded</option>
                                </select>


                            </div>
                            <div className="grid gap-6">
                                {inquiries.length > 0 ? (
                                    inquiries.filter((inquiry) => {
                                        if (filter === 'all') return true; // Show all inquiries
                                        if (filter === 'responded') return inquiry.responded; // Show responded inquiries
                                        if (filter === 'notResponded') return !inquiry.responded; // Show not responded inquiries
                                        return true;
                                    }).map((inquiry) => (
                                        <div key={inquiry.id} className="border rounded p-4 bg-gray-50">
                                            <h3 className="text-lg font-semibold text-pink-600">{inquiry.category}</h3>
                                            <p className="text-gray-800 mb-2">{inquiry.message}</p>
                                            <p className="text-sm text-gray-500">Status: {inquiry.responded ? 'Responded' : 'Pending'}</p>
                                            {!inquiry.responded && (
                                                <button
                                                    className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setSelectedInquiry(inquiry);
                                                    }}
                                                >
                                                    Respond
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No inquiries found.</p>
                                )}
                            </div>
                        </div>

                        {/* Popup for response */}
                        {selectedInquiry && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                                    <h2 className="text-xl font-semibold">Respond to Inquiry</h2>
                                    <p className="mt-4">Category: {selectedInquiry.category}</p>
                                    <p>Message: {selectedInquiry.message}</p>
                                    <textarea
                                        className="border rounded p-2 w-full mt-4"
                                        placeholder="Type your response here..."
                                        rows="4"
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                    ></textarea>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            className="bg-pink-500 text-white px-4 py-2 rounded"
                                            onClick={() => {
                                                handleResponse(selectedInquiry);
                                                setSelectedInquiry(null); // Close the popup
                                            }}
                                        >
                                            Send Response
                                        </button>
                                        <button
                                            className="bg-gray-300 text-black px-4 py-2 rounded"
                                            onClick={() => setSelectedInquiry(null)} // Close the popup
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
