import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [durationOptions] = useState([
        { label: "15 minutes", interval: '15 minutes' },
        { label: "30 minutes", interval: '30 minutes' },
        { label: "45 minutes", interval: '45 minutes' },
        { label: "1 hour", interval: '1 hour' },
        { label: "2 hours", interval: '2 hours' },
        { label: "3 hours", interval: '3 hours' },
        { label: "4 hours", interval: '4 hours' },
    ]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get("http://localhost:3001/service/services");
                setServices(response.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    const handleEditClick = (service) => {
        setSelectedService(service);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "duration") {
            const selectedOption = durationOptions.find(option => option.label === value);
            const interval = selectedOption ? selectedOption.interval : '';
            setSelectedService({ ...selectedService, duration: interval });
        } else {
            setSelectedService({ ...selectedService, [name]: value });
        }
    };

    const handleUpdateService = async () => {
        try {
            await axios.put(`http://localhost:3001/service/services/${selectedService.id}`, selectedService);
            setServices(services.map(service =>
                service.id === selectedService.id ? selectedService : service
            ));
            setSelectedService(null);
        } catch (err) {
            console.error("Error updating service:", err);
        }
    };

    return (
        <div>
            <h1>Services</h1>
            {services.map(service => (
                <div key={service.id}>
                    <h2>{service.name}</h2>
                    <button onClick={() => handleEditClick(service)}>Edit</button>
                </div>
            ))}

            {selectedService && (
                <div>
                    <h2>Edit Service</h2>
                    <input
                        type="text"
                        name="name"
                        value={selectedService.name}
                        onChange={handleChange}
                    />
                    <select
                        name="duration"
                        value={selectedService.duration}
                        onChange={handleChange}
                    >
                        <option disabled>Select duration</option>
                        {durationOptions.map(option => (
                            <option key={option.interval} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleUpdateService}>Update</button>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;