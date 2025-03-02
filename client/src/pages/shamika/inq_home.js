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

    return <InquiriesPage/>;  // Ensure we return the InquiriesPage component
};

function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [editInquiryId, setEditInquiryId] = useState(null); // State to track which inquiry is being edited
    const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    // Fetch inquiries on component mount
    useEffect(() => {
        fetch('https://servertest-isos.onrender.com/api/user/inquiries/view', {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                setInquiries(data.inquiries || []);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://servertest-isos.onrender.com/api/user/inquiries', {
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

    // Handle inquiry deletion
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://servertest-isos.onrender.com/api/user/inquiries/delete/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })
                    .then((response) => {
                        if (response.ok) {
                            setInquiries((prevInquiries) => prevInquiries.filter((inquiry) => inquiry.id !== id));
                            Swal.fire('Deleted!', 'Your inquiry has been deleted.', 'success');
                        } else {
                            Swal.fire('Error!', 'There was an issue deleting your inquiry.', 'error');
                        }
                    })
                    .catch((error) => console.error('Delete error:', error));
            }
        });
    };

    // Handle inquiry editing
    const handleEdit = (id) => {
        const inquiryToEdit = inquiries.find((inquiry) => inquiry.id === id);
        if (inquiryToEdit) {
            setCategory(inquiryToEdit.category);
            setMessage(inquiryToEdit.message);
            setEditInquiryId(id); // Set the id of the inquiry being edited
            setModalVisible(true); // Show the modal
        }
    };

    // Handle the update of inquiry
    const handleUpdate = () => {
        if (editInquiryId) {
            fetch(`https://servertest-isos.onrender.com/api/user/inquiries/update/${editInquiryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({category, message}),
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.updated) {
                        setInquiries((prevInquiries) =>
                            prevInquiries.map((inquiry) =>
                                inquiry.id === editInquiryId ? {...inquiry, category, message} : inquiry
                            )
                        );
                        setModalVisible(false); // Hide the modal
                        setEditInquiryId(null); // Reset edit inquiry id
                        setCategory('');
                        setMessage('');
                        Swal.fire({
                            title: 'Updated!',
                            text: 'Your inquiry has been updated.',
                            icon: 'success',
                        });
                        // Refetch inquiries to refresh the UI
                        fetch('https://servertest-isos.onrender.com/api/user/inquiries/view', {credentials: 'include'})
                            .then((response) => response.json())
                            .then((updatedInquiries) => {
                                setInquiries(updatedInquiries.inquiries || []);
                            })
                            .catch((error) => console.error('Error fetching updated inquiries:', error));
                    }
                })
                .catch((error) => console.error('Update error:', error));
        }
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
                                                    <p>{inquiry.response_message}</p>
                                                </div>
                                            )}
                                            {/* Render Edit button for not responded inquiries */}
                                            {!inquiry.responded && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(inquiry.id)}
                                                        className="mt-2 text-blue-500 hover:text-blue-700 mr-4">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(inquiry.id)}
                                                        className="mt-2 text-red-500 hover:text-red-700">
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No inquiries found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for editing inquiries */}
                {modalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-2xl font-semibold mb-4">Edit Inquiry</h2>
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

                            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Update Inquiry
                            </button>
                            <button onClick={() => setModalVisible(false)}
                                    className="ml-2 text-red-500 hover:text-red-700">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;