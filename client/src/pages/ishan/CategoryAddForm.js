import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash';
import { useNavigate } from 'react-router-dom';
import af from "../../images/bcimage.avif";
import Swal from 'sweetalert2'; // Import SweetAlert2

const Layout = () => {
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

    const CategoryForm = () => {
        const [categoryId, setCategoryId] = useState('');
        const [categoryName, setCategoryName] = useState('');

        useEffect(() => {
            const generatedId = `C${Math.floor(100000 + Math.random() * 900000)}`;
            setCategoryId(generatedId);
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch("http://localhost:3001/service/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: categoryName }),
                });

                const result = await response.json();

                if (response.ok) {
                    // Show success popup
                    Swal.fire({
                        title: "Category Added!",
                        text: `Category '${result.name}' added successfully!`,
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        window.location.reload(); // Refresh the page after clicking OK
                    });

                    setCategoryName('');
                } else {
                    // Show error popup if category already exists
                    if (result.error === "Category already exists") {
                        Swal.fire({
                            title: "Error!",
                            text: "This category is already added.",
                            icon: "error",
                            confirmButtonText: "OK"
                        }).then(() => {
                            window.location.reload(); // Refresh the page after clicking OK
                        });
                    } else {
                        // Handle other errors
                        Swal.fire({
                            title: "Error!",
                            text: result.error || "Failed to add category.",
                            icon: "error",
                            confirmButtonText: "OK"
                        }).then(() => {
                            window.location.reload(); // Refresh the page after clicking OK
                        });
                    }
                }
            } catch (err) {
                console.error(err.message);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.reload(); // Refresh the page after clicking OK
                });
            }
        };

        return (
            <div className="flex h-screen">
                <div className="w-[20%] h-full text-white">
                    <Sidebar />
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
                                <h1 className="lg:mx-32 text-4xl lg:text-7xl font-bold text-black mb-8 julius-sans-one-regular">
                                    Add New Category
                                </h1>
                                <br />
                                <br />
                                <br />
                                <div
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.32)',
                                        borderRadius: '30px',
                                        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                                        backdropFilter: 'blur(7.2px)',
                                        WebkitBackdropFilter: 'blur(7.2px)',
                                        border: '1px solid rgba(255, 255, 255, 0.99)',
                                        width: '90%',
                                        maxWidth: '550px',
                                        height: 'auto',
                                        padding: '20px',
                                        margin: '0 auto',
                                    }}><br />

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <label htmlFor="name"
                                                   className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
                                                Category Name
                                            </label>
                                            <br />
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
                                                className="text-white font-bold bg-pink-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-pink-900 dark:focus:ring-blue-800">
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <CategoryForm />;
};

export default Layout;
