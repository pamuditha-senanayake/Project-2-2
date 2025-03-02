import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import Sidebar from "../com/admindash";
import su from "../../images/up.jpg";

const EditServicePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        time: '',
        description: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`https://servertest-isos.onrender.com/api/services/${id}`);
                setService(response.data);
                setFormData({
                    name: response.data.name,
                    price: response.data.price,
                    time: response.data.time,
                    description: response.data.description,
                    categoryId: response.data.categoryId || '',
                });
            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchService();
        fetchCategories();
    }, [id]);

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://servertest-isos.onrender.com/api/services/${id}`, formData);
            navigate('/admin/services');
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

    if (!service) return <div>Loading...</div>;

    return (
        <div className="flex h-screen">
            <div className="w-[15%] h-full bg-gray-800 text-white">
                <Sidebar/>
            </div>
            <div className="w-[85%] h-full">
                <div
                    style={{
                        backgroundImage: `url(${su})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh",
                        padding: "20px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.32)',
                            borderRadius: '40px',
                            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(7.2px)',
                            WebkitBackdropFilter: 'blur(7.2px)',
                            border: '1px solid rgba(255, 255, 255, 0.99)',
                            width: '550px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h1 className="text-7xl text-white font-bold mb-8">
                            Edit Service
                        </h1>
                        <form className="w-full" onSubmit={handleSubmit} style={{paddingBottom: '60px'}}>
                            <div className="mb-6">
                                <label htmlFor="name"
                                       className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
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
                                <label htmlFor="price"
                                       className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
                                    Price
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="time"
                                       className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
                                    Time Taken
                                </label>
                                <select
                                    id="time"
                                    className="shadow-sm bg-gray-50 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select time taken</option>
                                    <option value="15 minutes">15 minutes</option>
                                    <option value="30 minutes">30 minutes</option>
                                    <option value="45 minutes">45 minutes</option>
                                    <option value="1 hour">1 hour</option>
                                    <option value="2 hours">2 hours</option>
                                    <option value="50 minutes">50 minutess</option>
                                    <option value="More than 2 hours">More than 2 hours</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description"
                                       className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
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
                            <div className="mb-6">
                                <label htmlFor="categoryId"
                                       className="block mb-2 text-2xl font-bold text-gray-900 dark:text-black">
                                    Category
                                </label>
                                <select
                                    id="categoryId"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Update Service
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditServicePage;
