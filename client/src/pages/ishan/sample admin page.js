import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import af from "../../images/af.jpg";

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
        const [message, setMessage] = useState(null);
        const [error, setError] = useState(null);

        useEffect(() => {
            const generatedId = `C${Math.floor(100000 + Math.random() * 900000)}`;
            setCategoryId(generatedId);
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();

            setMessage(null);
            setError(null);

            try {
                const response = await fetch("http://localhost:3001/service/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: categoryName}),
                });

                const result = await response.json();

                if (response.ok) {
                    setMessage(`Category '${result.name}' added successfully!`);
                    setCategoryName(''); // Clear the input field
                } else {
                    setError(result.error || "Failed to add category");
                }
            } catch (err) {
                console.error(err.message);
                setError("An error occurred. Please try again.");
            }
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
                <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular"
                     style={{
                         backgroundImage: `url(${homepic7})`,
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                     }}>
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
                                }}
                            >
                                <h1 className="lg:mx-32 text-4xl lg:text-7xl font-bold text-white mb-8">
                                    Add New Category
                                </h1>

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
                                    }}
                                >
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <label htmlFor="name"
                                                   className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                                placeholder="Enter category name"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </form>

                                    {message && <p className="success mt-4 text-black-600">{message}</p>}
                                    {error && <p className="error mt-4 text-red-600">{error}</p>}
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
