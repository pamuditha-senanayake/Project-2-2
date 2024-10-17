import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const SelectProfessional = () => {
    const location = useLocation();
    const {selectedServices} = location.state || {selectedServices: []};
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [professionals, setProfessionals] = useState([]);
    const [showAlert, setShowAlert] = useState(false);  // To manage alert visibility
    const navigate = useNavigate();

    // Fetch professionals based on selected services from the API
    useEffect(() => {
        const getProfessionals = async () => {
            try {
                if (selectedServices.length > 0) {
                    // Extract service IDs to be sent as query parameters
                    const serviceIds = selectedServices.map(service => service.id).join(',');
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/selectprofessionalservice?services=${serviceIds}`);
                    setProfessionals(response.data);
                } else {
                    setProfessionals([]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getProfessionals();
    }, [selectedServices]);

    const handleProfessionalSelect = (professional) => {
        setSelectedProfessional(professional);
        setShowAlert(false);  // Hide alert once a professional is selected
    };

    const handleRandomProfessionalSelect = () => {
        if (professionals.length > 0) {
            const randomIndex = Math.floor(Math.random() * professionals.length);
            setSelectedProfessional(professionals[randomIndex]);
            setShowAlert(false);  // Hide alert after random selection
        }
    };

    const handleContinue = () => {
        if (!selectedProfessional) {
            setShowAlert(true); // Show alert if no professional is selected
            return;
        }
        navigate("/date&time", {
            state: {
                selectedServices,
                selectedProfessional
            }
        });
    };

    // Calculate total cost
    const totalCost = selectedServices.reduce(
        (total, service) => total + parseFloat(service.price || 0),
        0
    );

    // Calculate total time
    const totalTime = selectedServices.reduce(
        (total, service) => {
            const serviceDuration = service.duration;
            const hours = serviceDuration.hours || 0;
            const minutes = serviceDuration.minutes || 0;
            total.hours += hours;
            total.minutes += minutes;
            return total;
        },
        {hours: 0, minutes: 0}
    );

    // Convert total minutes to hours if 60 or more
    const formattedTotalTime = {
        hours: totalTime.hours + Math.floor(totalTime.minutes / 60),
        minutes: totalTime.minutes % 60,
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 px-[200px]">
            <NavigationBar activeTab={2}/>

            <div className="flex flex-col md:flex-row w-full mt-[150px]">
                {/* Left side - Professional Selection */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Select Professional</h2>

                    {/* Alert if no professional is selected */}
                    {showAlert && (
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
                             role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>Please select a professional before continuing.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleRandomProfessionalSelect}
                            className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            <h3 className="text-lg font-semibold mt-2">Any Professional</h3>
                            <p className="text-sm">for maximum availability</p>
                        </button>

                        {professionals.map((professional) => (
                            <button
                                key={professional.id}
                                onClick={() => handleProfessionalSelect(professional)}
                                className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
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
                            <p>
                                {service.duration.hours ? `${service.duration.hours} hr` : ''}
                                {service.duration.hours && service.duration.minutes ? ' ' : ''}
                                {service.duration.minutes ? `${service.duration.minutes} min` : ''}
                            </p>
                        </div>
                    ))}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p className="text-lg font-semibold">
                            Stylist Name : <span
                            className="font-normal">{selectedProfessional ? selectedProfessional.name : "Select Your Stylist"}</span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {totalCost.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{`${formattedTotalTime.hours} Hour(s) ${formattedTotalTime.minutes} Min(s)`}</p>
                    </div>
                    <button
                        onClick={handleContinue}
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectProfessional;
