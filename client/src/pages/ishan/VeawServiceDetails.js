import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import su from "../../images/bcimage.avif";
import { jsPDF } from "jspdf";
import 'jspdf-autotable'; // Ensure you have this import for autoTable

const Layout = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

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

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
                    credentials: 'include'
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/');
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/');
            }
        };

        checkAdmin();
    }, [navigate]);

    const ServicesPage = () => {
        const [services, setServices] = useState([]);
        const [selectedService, setSelectedService] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const [message, setMessage] = useState("");
        const [showPopup, setShowPopup] = useState(false);

        useEffect(() => {
            const fetchServices = async () => {
                try {
                    const response = await axios.get("http://localhost:3001/service/services");
                    console.log("Fetched services:", response.data);
                    setServices(response.data);
                } catch (err) {
                    console.error("Error fetching services:", err);
                    setMessage("Failed to fetch services.");
                    setShowPopup(true);
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
                setShowPopup(true);
            } catch (err) {
                console.error("Error deleting service:", err);
                setMessage("Failed to delete service.");
                setShowPopup(true);
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
                setShowPopup(true);
                window.location.reload();
            } catch (err) {
                console.error("Error updating service:", err);
                setMessage("Failed to update service.");
                setShowPopup(true);
            }
        };

        // Report generation
        const generateReport = () => {
            const doc = new jsPDF();
            doc.text("Services Report", 20, 20);
            doc.autoTable({
                head: [['Service Name', 'Description', 'Price', 'Time Taken', 'Category']],
                body: services.map(service => [
                    service.name,
                    service.description,
                    `Rs.${service.price}`,
                    formatDuration(service.duration),
                    service.category_id
                ]),
                startY: 30,
            });
            doc.save('services_report.pdf');
        };

        // Time taken mapping as an array for easier manipulation
        const durationOptions = [
            { label: "15 minutes", interval: '15 minutes' },
            { label: "30 minutes", interval: '30 minutes' },
            { label: "45 minutes", interval: '45 minutes' },
            { label: "1 hour", interval: '1 hour' },
            { label: "2 hours", interval: '2 hours' },
            { label: "3 hours", interval: '3 hours' },
            { label: "4 hours", interval: '4 hours' },
            { label: "More than 5 hours", interval: '5 hours' }
        ];

        const handleChange = (e) => {
            const { name, value } = e.target;

            if (name === "duration") {
                // Find the interval string corresponding to the selected label
                const selectedOption = durationOptions.find(option => option.label === value);
                const interval = selectedOption ? selectedOption.interval : '0 minutes'; // Default to '0 minutes' if not found
                setSelectedService({ ...selectedService, duration: interval });
            } else {
                setSelectedService({ ...selectedService, [name]: value });
            }
        };

        const formatDuration = (duration) => {
            if (typeof duration !== 'string') {
                return "Invalid duration";
            }

            // Simple parser to convert interval string to a readable format
            return duration;
        };

        return (
            <div className="flex h-screen">
                <div className="w-[20%] h-full text-white">
                    <Sidebar />
                </div>
                <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular">
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
                            <h1 className="lg:mx-3 text-4xl lg:text-7xl font-bold text-black mb-8 julius-sans-one-regular">Services</h1>
                            <br/>

                            <button
                                onClick={generateReport}
                                className="lg:-scroll-mx-96 bg-black font-bold font-sans text-white py-2 px-4 rounded hover:bg-pink-700 mb-4"
                            >
                                Generate Report
                            </button>

                            <div className="overflow-x-auto">
                                <table className="lg:mx-5 max-h-full bg-white border border-gray-200 font-sans rounded-lg shadow-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Service Name</th>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Description</th>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Price</th>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Time Taken</th>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Category</th>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {services.map(service => (
                                        <tr key={service.id} className="border-b border-gray-200">
                                            <td className="py-2 px-4">{service.name}</td>
                                            <td className="py-2 px-4">{service.description}</td>
                                            <td className="py-2 px-4">Rs.{service.price}</td>
                                            <td className="py-2 px-4">
                                                {service.duration.hours ? (
                                                    <span>{service.duration.hours} hour{service.duration.hours > 1 ? 's' : ''}</span>
                                                ) : service.duration.minutes ? (
                                                    <span>{service.duration.minutes} minute{service.duration.minutes > 1 ? 's' : ''}</span>
                                                ) : (
                                                    <span>No duration available</span> // Optional: Show this if neither value exists
                                                )}
                                            </td>
                                            <td className="py-2 px-4">{getCategoryName(service.category_id)}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(service)}
                                                    className="bg-pink-500 text-white py-1 px-4 rounded hover:bg-pink-700"
                                                >
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(service.id)}
                                                    className="bg-black text-white py-1 px-4 rounded hover:bg-pink-200"
                                                >
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {showEditModal && selectedService && (
                                <div
                                    className="fixed inset-0 flex items-center justify-center font-sans bg-gray-800 bg-opacity-50">
                                    <div className="bg-white h-auto w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow-lg overflow-y-auto max-h-screen">
                                        <h2 className="text-xl font-bold mb-4">Edit Service</h2>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Service ID:</label>
                                            <input
                                                type="text"
                                                value={selectedService.id}
                                                className="w-full px-4 py-2 border rounded"
                                                readOnly
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Service Name:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedService.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Price:</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={selectedService.price}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Time Taken:</label>
                                            <select
                                                name="duration"
                                                value={
                                                    durationOptions.find(option => option.interval === selectedService.duration)?.label ||
                                                    "Select duration"
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded"
                                            >
                                                <option disabled>Select duration</option>
                                                {durationOptions.map(option => (
                                                    <option key={option.interval} value={option.label}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Description:</label>
                                            <textarea
                                                name="description"
                                                value={selectedService.description}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => setShowEditModal(false)}
                                                className="mr-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateService}
                                                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showPopup && (
                                <div
                                    className={`fixed top-4 right-4 ${message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'} text-white py-2 px-4 rounded shadow-lg flex items-center`}>
                                    <span>{message}</span>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="ml-4 text-white font-bold"
                                    >
                                        &times;
                                    </button>
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
