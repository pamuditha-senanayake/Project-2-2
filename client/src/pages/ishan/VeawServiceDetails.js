import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";
import su from "../../images/bcimage.avif";

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
        const [showPopup, setShowPopup] = useState(false);

        useEffect(() => {
            const fetchServices = async () => {
                try {
                    const response = await axios.get("http://localhost:3001/service/services");
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
            } catch (err) {
                console.error("Error updating service:", err);
                setMessage("Failed to update service.");
                setShowPopup(true);
            }
        };

        // Report generation function
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
            doc.save('services_report.pdf'); // Save the PDF
        };

        // Duration options mapping
        const durationOptions = {
            "15 minutes": { minutes: 15 },
            "30 minutes": { minutes: 30 },
            "45 minutes": { minutes: 45 },
            "1 hour": { minutes: 60 },
            "2 hours": { minutes: 120 },
            "5 hours": { minutes: 300 }
        };

        const handleChange = (e) => {
            const { name, value } = e.target;

            if (name === "duration") {
                // Convert the selected duration string back to minutes
                const minutes = durationOptions[value] ? durationOptions[value].minutes : 0; // Default to 0 if not found
                setSelectedService({ ...selectedService, duration: minutes }); // Update duration directly as a number
            } else {
                setSelectedService({ ...selectedService, [name]: value });
            }
        };

        const formatDuration = (duration) => {
            if (duration >= 60) {
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`;
            } else if (duration > 0) {
                return `${duration} minute${duration > 1 ? 's' : ''}`;
            } else {
                return "N/A";
            }
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
                            <h1 className="lg:mx-3 text-4xl lg:text-7xl font-bold text-black mb-8 julius-sans-one-regular">Services</h1><br/>

                            {/* Report Generation Button */}
                            <button
                                onClick={generateReport} // report
                                className="lg:mx-200 bg-black font-bold font-sans text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
                            >
                                Generate Report
                            </button>

                            <div className="overflow-x-auto">
                                <table className="lg:mx-5 max-h-full bg-white border border-gray-200 font-sans rounded-lg shadow-md">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left font-sans text-gray-600"> Service Name</th>
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
                                            <td className="py-2 px-4">{formatDuration(service.duration)}</td>
                                            <td className="py-2 px-4">{service.category_id}</td>
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
                                <div className="fixed inset-0 flex items-center justify-center font-sans bg-gray-800 bg-opacity-50">
                                    <div className="bg-white h-1/2 w-1/2 p-6 rounded shadow-lg">
                                        <h2 className="text-xl font-bold mb-4">Edit Service</h2>

                                        <div>
                                            <label className="block font-semibold">Service Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedService.name}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                            />

                                            <label className="block font-semibold">Description</label>
                                            <textarea
                                                name="description"
                                                value={selectedService.description}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                            />

                                            <label className="block font-semibold">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={selectedService.price}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                            />

                                            <label className="block font-semibold">Time Taken</label>
                                            <select
                                                name="duration"
                                                value={Object.keys(durationOptions).find(key => durationOptions[key].minutes === selectedService.duration) || ''}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                            >
                                                <option value="">Select Duration</option>
                                                {Object.keys(durationOptions).map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>

                                            <label className="block font-semibold">Category</label>
                                            <input
                                                type="text"
                                                name="category_id"
                                                value={selectedService.category_id}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded w-full p-2 mb-4"
                                            />
                                        </div>

                                        <button
                                            onClick={handleUpdateService}
                                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                                        >
                                            Update Service
                                        </button>
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 ml-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showPopup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded shadow-lg">
                                        <p>{message}</p>
                                        <button onClick={() => setShowPopup(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <ServicesPage />
        </div>
    );
};

export default Layout;
