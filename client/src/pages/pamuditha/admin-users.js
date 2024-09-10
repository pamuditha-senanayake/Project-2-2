import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {FaEdit, FaTrash} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';


const Layout = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null); // State to hold user data for editing
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
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

        checkAdmin();
    }, [navigate]);

    // Fetch user data from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            console.log('Fetching user data...'); // Debug log before fetching data
            try {
                const response = await fetch('http://localhost:3001/api/user', {
                    credentials: 'include' // Include credentials with the request
                });
                console.log('Response status:', response.status); // Debug log for response status

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data); // Debug log for fetched data
                setUsers(data.users); // Assuming `setUsers` is a state updater function for user data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers(); // Call the async function and handle the promise.
    }, []); // Empty dependency array means this effect runs once after the initial render.


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'  // Include credentials with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Update the state to remove the deleted user from the UI
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editUser) return;

        try {
            const response = await fetch(`http://localhost:3001/api/user/update/${editUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials with the request
                body: JSON.stringify({
                    firstname: editUser.firstname,
                    email: editUser.email,
                    phone_number: editUser.phone_number,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(users.map(user => user.id === data.user.id ? data.user : user));
            setShowModal(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full bg-gray-800 text-white">
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular">
                <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
                    <h1 className="text-3xl">User Information</h1>
                    <br/>
                    <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 border-b border-gray-300">
                            <th className="py-2 px-4 text-left">User ID</th>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Phone Number</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-300">
                                <td className="py-2 px-4 text-gray-700">{user.id}</td>
                                <td className="py-2 px-4 text-gray-700">{user.firstname}</td>
                                <td className="py-2 px-4 text-gray-700">{user.email}</td>
                                <td className="py-2 px-4 text-gray-700">{user.phone_number}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                        aria-label="Edit"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        <FaEdit/>
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <FaTrash/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for editing user */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl mb-4">Edit User</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label htmlFor="firstname" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"  // Ensure the name attribute matches your state key
                                    value={editUser.firstname || ''}  // Default to an empty string if undefined
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editUser.email}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone_number" className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    name="phone_number"
                                    value={editUser.phone_number}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 p-2 w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
