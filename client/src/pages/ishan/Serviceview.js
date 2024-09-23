import React, {useState, useEffect} from "react";
import axios from "axios";

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch all services on component mount
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
            await axios.put(`http://localhost:3001/services/services/${selectedService.id}`, selectedService);
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

    const handleChange = (e) => {
        setSelectedService({...selectedService, [e.target.name]: e.target.value});
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Services</h2>
            {message && <p className="mb-4 text-center">{message}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left text-gray-600">Name</th>
                        <th className="py-2 px-4 text-left text-gray-600">Description</th>
                        <th className="py-2 px-4 text-left text-gray-600">Price</th>
                        <th className="py-2 px-4 text-left text-gray-600">Time Taken</th>
                        <th className="py-2 px-4 text-left text-gray-600">Category ID</th>
                        <th className="py-2 px-4 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map(service => (
                        <tr key={service.id} className="border-b border-gray-200">
                            <td className="py-2 px-4">{service.name}</td>
                            <td className="py-2 px-4">{service.description}</td>
                            <td className="py-2 px-4">${service.price}</td>
                            <td className="py-2 px-4">{service.time_taken} mins</td>
                            <td className="py-2 px-4">{service.category_id}</td>
                            <td className="py-2 px-4 flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(service)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(service.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                >
                                    Delete
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
                            <label className="block font-semibold">Time Taken (mins)</label>
                            <input
                                type="number"
                                name="time_taken"
                                value={selectedService.time_taken}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded mb-2"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Category ID</label>
                            <p className="bg-gray-100 px-3 py-2 rounded mb-4">{selectedService.category_id}</p>
                        </div>
                        <button
                            onClick={handleUpdateService}
                            className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600"
                        >
                            Done
                        </button>
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
