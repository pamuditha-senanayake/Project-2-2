import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import { useNavigate } from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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

    const ServicesPage = () => {
        const [services, setServices] = useState([]);
        const [selectedService, setSelectedService] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const [message, setMessage] = useState("");

        useEffect(() => {
            const fetchServices = async () => {
                try {
                    const response = await axios.get("http://localhost:3001/service/services");
                    setServices(response.data);
                } catch (err) {
                    console.error("Error fetching services:", err);
                    setMessage("Failed to fetch services.");
                }
            };

            fetchServices();
        }, []);

        const handleEditClick = (service) => {
            setSelectedService(service);
            setShowEditModal(true);
        };

        const handleDeleteClick = async (id) => {
            try {
                await axios.delete(`http://localhost:3001/service/services/${id}`);
                setServices(services.filter(service => service.id !== id));
                setMessage("Service deleted successfully!");
            } catch (err) {
                console.error("Error deleting service:", err);
                setMessage("Failed to delete service.");
            }
        };

        const handleUpdateService = async () => {
            try {
                await axios.put(`http://localhost:3001/service/services/${selectedService.id}`, selectedService);
                setServices(services.map(service =>
                    service.id === selectedService.id ? selectedService : service
                ));
                setShowEditModal(false);
                setMessage("Service updated successfully!");
            } catch (err) {
                console.error("Error updating service:", err);
                setMessage("Failed to update service.");
            }
        };

        // Duration options mapping
        const durationOptions = {
            "15 minutes": { minutes: 15 },
            "30 minutes": { minutes: 30 },
            "45 minutes": { minutes: 45 },
            "1 hour": { minutes: 60 },
            "2 hours": { minutes: 120 },
            "More than 2 hours": { minutes: 121 } // Adjust as needed
        };

        const handleChange = (e) => {
            const { name, value } = e.target;

            if (name === "duration") {
                // Convert the selected duration string back to minutes
                const minutes = durationOptions[value] ? durationOptions[value].minutes : value;
                setSelectedService({ ...selectedService, [name]: { minutes } });
            } else {
                setSelectedService({ ...selectedService, [name]: value });
            }
        };

        // Helper function to display duration in hours or minutes
        const formatDuration = (duration) => {
            if (duration.hours) {
                return `${duration.hours} hour${duration.hours > 1 ? 's' : ''}`;
            } else if (duration.minutes) {
                return `${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}`;
            } else {
                return "N/A";
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
                <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular"
                     style={{
                         backgroundImage: `url(${homepic7})`,
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                     }}>
                    <div className="flex h-screen">
                        <div className="w-full h-full container mx-auto mt-10 relative"
                             style={{
                                 backgroundImage: `url(${su})`,
                                 backgroundSize: 'cover',
                                 backgroundPosition: 'center',
                                 backgroundRepeat: 'no-repeat',
                                 margin: '0',
                                 padding: '0',
                             }}>
                            <h1 className="text-5xl font-bold mb-5">Services</h1>
                            {message && <p className="mb-4 text-center">{message}</p>}

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-gray-600">Name</th>
                                        <th className="py-2 px-4 text-left text-gray-600">Description</th>
                                        <th className="py-2 px-4 text-left text-gray-600">Price</th>
                                        <th className="py-2 px-4 text-left text-gray-600">Time Taken</th>
                                        <th className="py-2 px-4 text-left text-gray-600">Category</th>
                                        <th className="py-2 px-4 text-left text-gray-600">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {services.map(service => (
                                        <tr key={service.id} className="border-b border-gray-200">
                                            <td className="py-2 px-4">{service.name}</td>
                                            <td className="py-2 px-4">{service.description}</td>
                                            <td className="py-2 px-4">${service.price}</td>
                                            <td className="py-2 px-4">{formatDuration(service.duration)}</td>
                                            <td className="py-2 px-4">{service.category_id}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(service)}
                                                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-200"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(service.id)}
                                                    className="bg-black text-white py-1 px-4 rounded hover:bg-red-600"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {showEditModal && selectedService && (
                                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                    <div className="bg-white p-6 rounded shadow-lg">
                                        <h2 className="text-xl font-bold mb-4">Edit Service</h2>

                                        <div>
                                            <label className="block font-semibold">Service Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedService.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded mb-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold">Description</label>
                                            <textarea
                                                name="description"
                                                value={selectedService.description}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded mb-2"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block font-semibold">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={selectedService.price}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded mb-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold">Time Taken</label>
                                            <select
                                                name="duration"
                                                value={selectedService.duration ? Object.keys(durationOptions).find(key => durationOptions[key].minutes === selectedService.duration.minutes) : ""}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded mb-2"
                                            >
                                                <option value="" disabled>Select time taken</option>
                                                {Object.keys(durationOptions).map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-semibold">Category ID</label>
                                            <input
                                                type="text"
                                                name="category_id"
                                                value={selectedService.category_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded mb-2"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleUpdateService}
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => setShowEditModal(false)}
                                                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <ServicesPage />;
};

export default Layout;
