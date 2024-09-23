import { useEffect, useState } from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import { useNavigate } from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import axios from "axios";
import su from "../../images/af.jpg";

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

    const AddServicePage = () => {
        const [formData, setFormData] = useState({
            name: "",
            price: "",
            duration: "",
            description: "",
            category_id: ""
        });

        const [categories, setCategories] = useState([]);
        const [message, setMessage] = useState("");

        useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get("http://localhost:3001/service/categories");
                    setCategories(response.data);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            };
            fetchCategories();
        }, []);

        const handleChange = (e) => {
            const { id, value } = e.target;
            setFormData({ ...formData, [id]: value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await axios.post("http://localhost:3001/service/services", formData);
                setMessage("Service added successfully!");
                navigate('/vstb');
                setFormData({
                    name: "",
                    price: "",
                    duration: "",
                    description: "",
                    category_id: ""
                });
            } catch (error) {
                console.error("Error adding service:", error);
                setMessage("Failed to add service. Please try again.");
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
                    <Sidebar />
                </div>
                <div className="w-[80%] h-full bg-pink-500  julius-sans-one-regular"
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
                                    backgroundImage: `url(${su})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    minHeight: "100vh",
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(255, 255, 255, 0.32)",
                                        borderRadius: "40px",
                                        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
                                        backdropFilter: "blur(7.2px)",
                                        WebkitBackdropFilter: "blur(7.2px)",
                                        border: "1px solid rgba(255, 255, 255, 0.99)",
                                        width: "550px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <h1 className="text-7xl text-white font-bold mb-8">Add Service</h1>

                                    {message && <p className="mb-4 text-center text-white">{message}</p>}
                                    <form className="w-full" onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <label htmlFor="name" className="block mb-2 text-2xl font-bold text-gray-900">
                                                Service Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Service Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="category_id" className="block mb-2 text-2xl font-bold text-gray-900">
                                                Category
                                            </label>
                                            <select
                                                id="category_id"
                                                className="shadow-sm bg-gray-70 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select category
                                                </option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="price" className="block mb-2 text-2xl font-bold text-gray-900">
                                                Price
                                            </label>
                                            <input
                                                type="number"
                                                id="price"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="duration" className="block mb-2 text-2xl font-bold text-gray-900">
                                                Time Taken
                                            </label>
                                            <select
                                                id="duration"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select time taken
                                                </option>
                                                <option value="15 minutes">15 minutes</option>
                                                <option value="30 minutes">30 minutes</option>
                                                <option value="45 minutes">45 minutes</option>
                                                <option value="1 hour">1 hour</option>
                                                <option value="2 hours">2 hours</option>
                                            </select>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="description" className="block mb-2 text-2xl font-bold text-gray-900">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Service Description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Add Service
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <AddServicePage />;
};

export default Layout;
