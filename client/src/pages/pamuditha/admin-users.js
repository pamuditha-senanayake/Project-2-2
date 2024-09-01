// src/components/Layout.js
import React from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import { FaEdit, FaTrash } from 'react-icons/fa';

const Layout = () => {
    const users = [
        { userId: 1, name: 'John Doe', email: 'john.doe@example.com', phoneNumber: '123-456-7890' },
        { userId: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phoneNumber: '987-654-3210' },
        { userId: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', phoneNumber: '456-789-0123' },
    ];

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full bg-gray-800 text-white">
                <Sidebar />
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
                        {users.map(user => (
                            <tr key={user.userId} className="border-b border-gray-300">
                                <td className="py-2 px-4 text-gray-700">{user.userId}</td>
                                <td className="py-2 px-4 text-gray-700">{user.name}</td>
                                <td className="py-2 px-4 text-gray-700">{user.email}</td>
                                <td className="py-2 px-4 text-gray-700">{user.phoneNumber}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                        aria-label="Edit"
                                    >
                                        <FaEdit/>
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete"
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
        </div>
    );
};

export default Layout;
