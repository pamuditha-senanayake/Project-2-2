import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import homepic6 from "../../images/e.jpg";
import Swal from 'sweetalert2';
import axios from 'axios';
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Layout = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Admin authentication check
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/api/user/admin', {
                    withCredentials: true // Include credentials with the request
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = response.data;
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

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/service/categories', {
                    withCredentials: true
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch categories.',
                    icon: 'error'
                });
            }
        };

        fetchCategories();
    }, []);

    // Generate a random category ID
    useEffect(() => {
        const generateCategoryId = () => {
            const generatedId = `C${Math.floor(100000 + Math.random() * 900000)}`;
            setCategoryId(generatedId);
        };
        generateCategoryId();
    }, []);

    // Delete category function
    const deleteCategory = async (id) => {
        try {
            await axios.delete(`https://servertest-isos.onrender.com/service/categories/${id}`, {
                withCredentials: true
            });
            setCategories(categories.filter(category => category.id !== id)); // Update state to remove deleted category
            Swal.fire({
                title: 'Deleted!',
                text: 'Your category has been deleted.',
                icon: 'success'
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete category.',
                icon: 'error'
            });
        }
    };

    // Handle delete button click with confirmation
    const handleDeleteClick = async (id) => {
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

    // Handle form submission to add a new category
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate category name
        if (!categoryName.trim()) {
            Swal.fire({
                title: "Error!",
                text: "Category name cannot be empty.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        try {
            const newCategory = {
                id: categoryId,
                name: categoryName.trim()
            };

            const response = await axios.post("https://servertest-isos.onrender.com/service/categories", newCategory, {
                withCredentials: true
            });

            if (response.status === 201 || response.status === 200) {
                // Show success popup
                Swal.fire({
                    title: "Category Added!",
                    text: `Category '${response.data.name}' added successfully!`,
                    icon: "success",
                    confirmButtonText: "OK"
                });

                // Update categories state without reloading
                setCategories([...categories, response.data]);
                setCategoryName('');
                setCategoryId(`C${Math.floor(100000 + Math.random() * 900000)}`); // Generate a new ID for the next category
            } else {
                // Handle unexpected status codes
                Swal.fire({
                    title: "Error!",
                    text: "Failed to add category.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } catch (error) {
            console.error(error);

            // Determine error message
            let errorMsg = "This category is already added.";
            if (error.response && error.response.data && error.response.data.error === "Category already exists") {
                errorMsg = "This category is already added.";
            }

            // Show error popup
            Swal.fire({
                title: "Error!",
                text: errorMsg,
                icon: "error",
                confirmButtonText: "OK"
            });
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


            <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular overflow-auto">
                <div
                    style={{
                        backgroundImage: `url(${homepic6})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh",
                        padding: "20px",
                    }}
                >

                    <h1 className="lg:mx-30 text-4xl lg:text-6xl font-bold text-black mb-8 julius-sans-one-regular">
                        Manage Categories
                    </h1>


                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 px-4 py-2 mb-4 rounded w-full max-w-md"
                    />

                    <h2 className="text-lg text-black mb-4 font-semibold border-b-2 border-gray-300 pb-2">
                        Total Categories: {categories.length}
                    </h2>


                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.32)',
                            borderRadius: '10px',
                            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(7.2px)',
                            WebkitBackdropFilter: 'blur(7.2px)',
                            border: '1px solid rgba(255, 255, 255, 0.99)',
                            width: '90%',
                            maxWidth: '550px',
                            height: 'auto',
                            padding: '20px',
                            margin: '0 auto 30px auto',
                        }}
                    >

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name"
                                       className="block mb-2 text-2xl font-bold text-gray-700 dark:text-black">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="shadow-sm bg-gray-100 border border-gray-900 text-gray-900 text-sm rounded-lg focus:ring-gray-100 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-500 dark:focus:border-gray-500 dark:shadow-sm-light"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="text-white font-bold bg-pink-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-pink-900 dark:focus:ring-blue-800 icon-button transition duration-300 ease-in-out transform hover:scale-110">
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </div>


                    <table className="min-w-full bg-white border border-gray-200 font-sans rounded-lg shadow-md">
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
                                        onClick={() => handleDeleteClick(category.id)}
                                        className="bg-black text-white py-1 px-4 rounded hover:bg-pink-700 icon-button transition duration-300 ease-in-out transform hover:scale-110"
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Layout;
