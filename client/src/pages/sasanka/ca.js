import Sidebar from '../com/admindash';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import af from "../../images/bcimage.avif";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState, useMemo } from 'react';

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
        const [searchTerm, setSearchTerm] = useState("");

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
                    await axios.delete(`http://localhost:3001/service/services/${id}`);
                    setServices(services.filter(service => service.id !== id));

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

        // Corrected Time Taken Options
        const durationOptions = [
            { label: "15 minutes", interval: '15 minutes' },
            { label: "30 minutes", interval: '30 minutes' },
            { label: "45 minutes", interval: '45 minutes' },
            { label: "1 hour", interval: '1 hour' },
            { label: "2 hours", interval: '2 hours' },
            { label: "3 hours", interval: '3 hours' },
            { label: "4 hours", interval: '4 hours' },
        ];

        const handleChange = (e) => {
            const { name, value } = e.target;

            if (name === "duration") {
                const selectedOption = durationOptions.find(option => option.label === value);
                const interval = selectedOption ? selectedOption.interval : '0 minutes'; // Default to '0 minutes' if not found
                setSelectedService({ ...selectedService, duration: interval });
            } else {
                setSelectedService({ ...selectedService, [name]: value });
            }
        };

        const formatDuration = (duration) => {
            if (typeof duration === 'string') {
                const parts = duration.split(' ');
                const timeUnit = parts[1];
                const timeValue = parseInt(parts[0], 10);

                return `${timeValue} ${timeUnit}${timeValue > 1 ? 's' : ''}`;
            }
            return "No duration available";
        };

        const categoryMap = useMemo(() => {
            const map = {};
            categories.forEach(cat => {
                map[cat.id] = cat.name;
            });
            return map;
        }, [categories]);

        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        const filteredServices = services.filter(service => {
            const term = searchTerm.toLowerCase();
            const categoryName = getCategoryName(service.category_id).toLowerCase();
            return (
                service.name.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term) ||
                categoryName.includes(term)
            );
        });

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
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                styles: { font: "helvetica", fontSize: 10 },
                headStyles: { fillColor: [22, 160, 133] },
                alternateRowStyles: { fillColor: [238, 238, 238] },
                margin: { left: 14, right: 14 },
                tableLineColor: [44, 62, 80],
                tableLineWidth: 0.1
            });

            doc.save("services_report.pdf");
        };

        return (
            <div>
                <Sidebar />
                <div className="services-container">
                    <h2>Services</h2>
                    <input
                        type="text"
                        placeholder="Search services"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={generatePDF}>
                        <FontAwesomeIcon icon={faFilePdf} /> Generate PDF
                    </button>

                    <table>
                        <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Time Taken</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredServices.map((service) => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>{service.price}</td>
                                <td>{formatDuration(service.duration)}</td>
                                <td>{getCategoryName(service.category_id)}</td>
                                <td>
                                    <button onClick={() => handleEditClick(service)}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteClick(service.id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundImage: `url(${af})`, backgroundSize: 'cover' }}>
            <ServicesPage />
        </div>
    );
};

export default Layout;
