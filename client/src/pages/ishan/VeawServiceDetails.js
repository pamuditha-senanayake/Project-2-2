import React, {useEffect, useState, useMemo} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import homepic6 from "../../images/e.jpg";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Layout = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);


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

    const ServicesPage = () => {
        const [services, setServices] = useState([]);
        const [selectedService, setSelectedService] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const [message, setMessage] = useState("");
        const [showPopup, setShowPopup] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");

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

                // Update the state to reflect the updated service
                setServices(services.map(service =>
                    service.id === selectedService.id ? selectedService : service
                ));

                // Show success popup and refresh the page on confirmation
                Swal.fire({
                    title: 'Updated!',
                    text: 'Your service has been updated successfully.',
                    icon: 'success'
                }).then(() => {
                    // Refresh the page after the user clicks "OK"
                    window.location.reload();
                });

                setShowEditModal(false);
            } catch (err) {
                console.error("Error updating service:", err);

                // Show error popup
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update service.',
                    icon: 'error'
                }).then(() => {

                });
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

        // report generation

        const generatePDF = () => {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Services Report", 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            doc.setFontSize(12);
            doc.setTextColor(12, 10, 9);
            doc.text(`Total services: ${filteredServices.length}`, 14, 40);

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

            doc.save("services_report.pdf");
        };


        return (
            <div className="flex h-screen">
                <div className="w-[20%] h-full text-white">
                    <Sidebar/>
                </div>
                <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular overflow-auto">
                    <div className="flex h-screen">
                        <div className="w-full h-full p-4"
                             style={{
                                 backgroundImage: `url(${homepic6})`,
                                 backgroundSize: "cover",
                                 backgroundPosition: "center",
                                 backgroundRepeat: "no-repeat",
                                 minHeight: "100vh",
                                 padding: "20px",
                                 bottom: 0,

                             }}>
                            <h1 className="lg:mx-3 text-4xl lg:text-6xl font-bold text-black mb-8 julius-sans-one-regular">Services</h1>
                            <br/>

                            {/* Search and Generate PDF Buttons */}
                            <div className="lg:mx-5 mb-4 flex justify-between items-center ">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search ......"
                                    className="w-50 px-4 py-2 border rounded"
                                />
                                <button
                                    onClick={generatePDF}
                                    className="flex items-center bg-black text-white font-bold px-4 py-2 rounded hover:bg-pink-700 icon-button transition duration-300 ease-in-out transform hover:scale-110"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} className="mr-2 "/>
                                    Generate Report
                                </button>
                            </div>

                            {/*<h2 className="text-lg text-black mb-4 font-semibold border-b-2 border-gray-300 pb-2">*/}
                            {/*    Total services: {filteredServices.length}*/}
                            {/*</h2>*/}

                            <h2 className="text-lg text-black mb-4 font-semibold border-b-2 border-gray-300 pb-2">
                                Total services: {services.length}
                            </h2>

                            <div className="overflow-x-auto">
                                <table
                                    className=" min-w-full bg-white border border-gray-200 font-sans rounded-lg shadow-md">
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
                                    {filteredServices.map(service => (
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
                                                    <span>45 minutes</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4">{getCategoryName(service.category_id)}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(service)}
                                                    className="bg-pink-500 text-white py-1 px-4 rounded hover:bg-pink-700 icon-button transition duration-300 ease-in-out transform hover:scale-110"
                                                >
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(service.id)}
                                                    className="bg-black text-white py-1 px-4 rounded hover:bg-pink-700 icon-button transition duration-300 ease-in-out transform hover:scale-110"
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
                                    <div
                                        className="bg-white h-auto w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded shadow-lg overflow-y-auto max-h-screen">
                                        <h2 className="text-xl font-bold mb-4">Edit Service</h2>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Service ID:</label>
                                            <input
                                                type="text"
                                                value={selectedService.id}
                                                className="w-full px-2 py-2 "
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
                                                className="w-full px-2 py-2 border rounded"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block font-semibold">Price:</label>
                                            <div className="flex">
                                                    <span
                                                        className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                                        Rs.
                                                    </span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={selectedService.price}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-2 border rounded-r-md no-spinner"
                                                    // Disable the spinner arrows
                                                    onWheel={(e) => e.target.blur()} // Prevent scrolling input
                                                    inputMode="numeric"
                                                />
                                            </div>
                                        </div>

                                        <style jsx>{`
                                            input[type='number'] {
                                                -moz-appearance: textfield;
                                            }
                                            input[type='number']::-webkit-outer-spin-button,
                                            input[type='number']::-webkit-inner-spin-button {
                                                -webkit-appearance: none;
                                                margin: 0;
                                            }
                                        `}</style>


                                        <div className="mb-4">
                                            <label className="block font-semibold">Time Taken:</label>
                                            <select
                                                name="duration"
                                                value={
                                                    selectedService.duration.hours
                                                        ? `${selectedService.duration.hours} hour${selectedService.duration.hours > 1 ? 's' : ''}`
                                                        : selectedService.duration.minutes
                                                            ? `${selectedService.duration.minutes} minute${selectedService.duration.minutes > 1 ? 's' : ''}`
                                                            : ""}
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
                                                className="w-full px-2 py-2 border rounded"
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
                                    className={`popup-container ${message.includes('successfully') ? 'success' : 'error'}`}>
                                    <span className="popup-message">{message}</span>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="popup-button"
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

    return <ServicesPage/>;
};

export default Layout;
