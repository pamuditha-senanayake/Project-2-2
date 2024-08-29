import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const SelectProfessional = () => {
    const location = useLocation();
    const {selectedServices} = location.state || {selectedServices: []};
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [professionals, setProfessionals] = useState([]);

    // Fetch professionals from the API
    useEffect(() => {
        const getProfessionals = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/professionals/");
                setProfessionals(response.data);
                console.log(response);
            } catch (err) {
                console.error(err);
            }
        };
        getProfessionals();
    }, []);

    const handleProfessionalSelect = (professional) => {
        setSelectedProfessional(professional);
    };

    // Calculate total cost
    const totalCost = selectedServices.reduce(
        (total, service) => total + parseFloat(service.price || 0),
        0
    );

    // Format duration object into a string
    const formatDuration = (duration) => {
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        return `${hours} Hour(s) ${minutes} Min(s)`;
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            <NavigationBar activeTab={2}/>

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Professional Selection */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Select Professional</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {professionals.map((professional) => (
                            <button
                                key={professional.id}
                                onClick={() => handleProfessionalSelect(professional)}
                                className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                {/*<span className="text-3xl">{professional.icon}</span>*/}
                                <h3 className="text-lg font-semibold mt-2">{professional.name}</h3>
                                <p className="text-sm">{professional.specialty}</p>
                                <p className="text-sm">{professional.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side - Summary */}
                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
                    {selectedServices.map((service) => (
                        <div key={service.id} className="mb-2">
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p>LKR {service.price}</p>
                            <p>{formatDuration(service.duration)}</p>
                        </div>
                    ))}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p>With Name: {selectedProfessional ? selectedProfessional.name : "(Professional's name)"}</p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>4 Hours</p>
                        <p>LKR {totalCost.toFixed(2)}</p> {/* Ensure cost is displayed with two decimal places */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectProfessional;
