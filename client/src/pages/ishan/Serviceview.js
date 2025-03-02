import React, {useEffect, useState, useMemo} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import homepic6 from "../../images/e.jpg"; // Import the plugin

const Layout = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("https://servertest-isos.onrender.com/service/categories");
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
                const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
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

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get("https://servertest-isos.onrender.com/service/services");
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
            try {
                await axios.delete(`https://servertest-isos.onrender.com/service/services/${id}`);
                // Update the state to remove the deleted service
                setServices(services.filter(service => service.id !== id));
                // Show success popup
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your service has been deleted.',
                    icon: 'success'
                });
            } catch (err) {
                console.error("Error deleting service:", err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete service.',
                    icon: 'error'
                });
            }
        }
    };

    const handleUpdateService = async () => {
        try {
            await axios.put(`https://servertest-isos.onrender.com/service/services/${selectedService.id}`, selectedService);
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

    // Time taken mapping as an array for easier manipulation
    const durationOptions = [
        {label: "15 minutes", interval: '15 minutes'},
        {label: "30 minutes", interval: '30 minutes'},
        {label: "45 minutes", interval: '45 minutes'},
        {label: "1 hour", interval: '1 hour'},
        {label: "2 hours", interval: '2 hours'},
        {label: "3 hours", interval: '3 hours'},
        {label: "4 hours", interval: '4 hours'},
    ];

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "duration") {
            // Find the interval string corresponding to the selected label
            const selectedOption = durationOptions.find(option => option.label === value);
            const interval = selectedOption ? selectedOption.interval : '0 minutes'; // Default to '0 minutes' if not found
            setSelectedService({...selectedService, duration: interval});
        } else {
            setSelectedService({...selectedService, [name]: value});
        }
    };

    const formatDuration = (duration) => {
        if (typeof duration === 'object') {
            if (duration.hours) {
                return `${duration.hours} hour${duration.hours > 1 ? 's' : ''}`;
            } else if (duration.minutes) {
                return `${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}`;
            }
        } else if (typeof duration === 'string') {
            return duration;
        }
        return "No duration available";
    };

    // Memoize category map for efficient lookup
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach(cat => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categories]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter services based on search term
    const filteredServices = services.filter(service => {
        const term = searchTerm.toLowerCase();
        const categoryName = getCategoryName(service.category_id).toLowerCase();
        return (
            service.name.toLowerCase().includes(term) ||
            service.description.toLowerCase().includes(term) ||
            categoryName.includes(term)
        );
    });

    // PDF Generation Function
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Services Report", 14, 22);

        // Subtitle
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        doc.setFontSize(12);
        doc.setTextColor(12, 10, 9);
        doc.text(`Total services: ${filteredServices.length}`, 14, 40);

        // Define table columns and rows
        const tableColumn = ["Service Name", "Description", "Price (Rs.)", "Time Taken", "Category"];
        const tableRows = [];

        filteredServices.forEach(service => {
            const serviceData = [
                service.name,
                service.description,
                service.price.toString(),
                formatDuration(service.duration),
                getCategoryName(service.category_id)
            ];
            tableRows.push(serviceData);
        });

        // Add table
        doc.autoTable({
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            styles: {font: "helvetica", fontSize: 10},
            headStyles: {fillColor: [22, 160, 133]},
            alternateRowStyles: {fillColor: [238, 238, 238]},
            margin: {left: 14, right: 14},
            tableLineColor: [44, 62, 80],
            tableLineWidth: 0.1
        });

        // Save PDF
        doc.save("services_report.pdf");
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">Services</h1>

                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border rounded-l px-4 py-2 flex-grow"
                    />
                    <button
                        onClick={generatePDF}
                        className="bg-green-500 text-white rounded-r px-4 py-2"
                    >
                        <FontAwesomeIcon icon={faFilePdf}/> Export to PDF
                    </button>
                </div>

                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Service Name</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Price (Rs.)</th>
                        <th className="border border-gray-300 px-4 py-2">Time Taken</th>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <tr key={service.id}>
                                <td className="border border-gray-300 px-4 py-2">{service.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.description}</td>
                                <td className="border border-gray-300 px-4 py-2">{service.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatDuration(service.duration)}</td>
                                <td className="border border-gray-300 px-4 py-2">{getCategoryName(service.category_id)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleEditClick(service)}
                                        className="text-blue-500 mr-2"
                                    >
                                        <FontAwesomeIcon icon={faEdit}/>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(service.id)}
                                        className="text-red-500"
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">No services
                                found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {showEditModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded">
                            <h2 className="text-lg font-bold">Edit Service</h2>
                            <form onSubmit={handleUpdateService}>
                                <div>
                                    <label className="block">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={selectedService.name}
                                        onChange={handleChange}
                                        className="border rounded w-full px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block">Description:</label>
                                    <textarea
                                        name="description"
                                        value={selectedService.description}
                                        onChange={handleChange}
                                        className="border rounded w-full px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block">Price (Rs.):</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={selectedService.price}
                                        onChange={handleChange}
                                        className="border rounded w-full px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block">Time Taken:</label>
                                    <select
                                        name="duration"
                                        value={selectedService.duration}
                                        onChange={handleChange}
                                        className="border rounded w-full px-2 py-1"
                                    >
                                        {durationOptions.map((option, index) => (
                                            <option key={index} value={option.label}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block">Category:</label>
                                    <select
                                        name="category_id"
                                        value={selectedService.category_id}
                                        onChange={handleChange}
                                        className="border rounded w-full px-2 py-1"
                                        required
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="bg-gray-500 text-white px-4 py-2 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2"
                                    >
                                        Update Service
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded">
                            <p>{message}</p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-blue-500 text-white px-4 py-2 mt-4"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
