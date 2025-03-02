import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import af from "../../images/bcimage.avif";
import Swal from 'sweetalert2';
import axios from 'axios';
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Layout = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

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

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/service/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`https://servertest-isos.onrender.com/service/categories/${id}`);
            setCategories(categories.filter(category => category.id !== id)); // Update state to remove deleted category
            Swal.fire({
                title: 'Deleted!',
                text: 'Your category has been deleted.',
                icon: 'success'
            });
        } catch (error) {
            console.error("Error deleting category:", error); // Fixed typo here
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete category.',
                icon: 'error'
            });
        }
    };

    const handleDeleteClick = async (id) => {
        // Show confirmation popup
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await deleteCategory(id); // Proceed with deletion if confirmed
        }
    };

    // Filter categories based on the search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white">
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular">
                <div className="flex h-screen">
                    <div className="w-full h-full">
                        <div
                            style={{
                                backgroundImage: `url(${af})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                minHeight: "100vh",
                                padding: "20px",
                            }}>
                            <h1 className="lg:mx-30 text-4xl lg:text-6xl font-bold text-black mb-8 julius-sans-one-regular">
                                Category List
                            </h1>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 px-4 py-2 mb-4 rounded"
                            />
                            <table
                                className="min-w-full bg-white border border-gray-200 font-sans rounded-lg shadow-md">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="py-2 px-4 text-left font-sans text-gray-600">Category ID</th>
                                    <th className="py-2 px-4 text-left font-sans text-gray-600">Category Name</th>
                                    <th className="py-2 px-4 text-left font-sans text-gray-600">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteClick(category.id)} // Use handleDeleteClick instead
                                                className="bg-black text-white py-1 px-4 rounded hover:bg-pink-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
