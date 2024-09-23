import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {FaEdit, FaTrash} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import homepic7 from "../../images/f.jpg";
import homepic6 from "../../images/c.jpg";
import logo from "../../images/logo.jpeg";
import Swal from 'sweetalert2'; // Import SweetAlert

const Layout = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null); // State to hold user data for editing
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query
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

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:3001/api/user/delete/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    // Update the state to remove the deleted user from the UI
                    setUsers(users.filter(user => user.id !== id));

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete the user.",
                        icon: "error"
                    });
                }
            }
        });
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
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update the user.",
                    icon: "error"
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(users.map(user => user.id === data.user.id ? data.user : user));
            setShowModal(false);

            Swal.fire({
                title: "Good job!",
                text: "User updated successfully!",
                icon: "success"
            });
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

    // Filter users based on search query
    const filteredUsers = users.filter(
        (user) =>
            (user.firstname && user.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.phone_number && user.phone_number.toString().includes(searchQuery))
    );


    // Handle report generation as PDF
    const generateReport = () => {
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.text('User Report', 14, 22);

        // Define table column headers and data
        const columns = ['User ID', 'Name', 'Email', 'Phone Number'];
        const data = filteredUsers.map(user => [
            user.id,
            user.firstname,
            user.email,
            user.phone_number
        ]);

        // Add table to PDF
        doc.autoTable({
            startY: 30, // Starting vertical position
            head: [columns],
            body: data,
            theme: 'grid',
            margin: {horizontal: 14},
            styles: {fontSize: 10},
        });

        // Add footer
        doc.setFontSize(10);
        doc.text('Generated by Salon Diamond- Admin', 14, doc.internal.pageSize.height - 10);

        // Save the PDF
        doc.save('users_report.pdf');
    };

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
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular overflow-auto"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
                    <h1 className="text-3xl">User Information</h1>
                    <br/>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />

                    {/* Report Generation Button */}
                    <button
                        onClick={generateReport}
                        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Generate Report
                    </button>

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
                        {filteredUsers.map((user) => (
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
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div
                        className="p-5 bg-white julius-sans-one-regular rounded-lg shadow-lg w-[800px] h-[500px] max-w-full">

                        <div className="flex flex-row ">
                            <div className="flex order-1 w-[50%] flex-col">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit User</h2>
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="firstname" className="block text-gray-600">Name</label>
                                        <input
                                            type="text"
                                            id="firstname"
                                            name="firstname"
                                            value={editUser.firstname || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="block text-gray-600">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={editUser.email || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone_number" className="block text-gray-600">Phone
                                            Number</label>
                                        <input
                                            type="text"
                                            id="phone_number"
                                            name="phone_number"
                                            value={editUser.phone_number || ''}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-800 transition-all"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="ml-3 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-800 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="flex order-2 w-[50%] justify-center items-center">
                                <img
                                    src={logo}
                                    alt="Description"
                                    className="w-48 h-48 object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Layout;
