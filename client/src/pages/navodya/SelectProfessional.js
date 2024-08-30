import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const SelectProfessional = () => {
    const location = useLocation();
    const {selectedServices} = location.state || {selectedServices: []};
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [professionals, setProfessionals] = useState([]);
    const navigate = useNavigate();

    // Fetch professionals from the API
    useEffect(() => {
        const getProfessionals = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/selectprofessional");
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

    const handleRandomProfessionalSelect = () => {
        if (professionals.length > 0) {
            const randomIndex = Math.floor(Math.random() * professionals.length);
            setSelectedProfessional(professionals[randomIndex]);
        }

    };

    const handleContinue = () => {
        navigate("/date&time", {
            state: {
                selectedServices,
                selectedProfessional
            }
        });
    }

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

    // Format duration object into a string
    // const formatDuration = (duration) => {
    //     const hours = duration.hours || 0;
    //     const minutes = duration.minutes || 0;
    //     return `${hours} Hour(s) ${minutes} Min(s)`;
    // };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            <NavigationBar activeTab={2}/>

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Professional Selection */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Select Professional</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleRandomProfessionalSelect()}
                            className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            {/* <span className="text-3xl">{professional.icon}</span> */}
                            <h3 className="text-lg font-semibold mt-2">Any Professional</h3>
                            <p className="text-sm">for maximum availability</p>
                        </button>

                        {professionals.map((professional) => (
                            <button
                                key={professional.id}
                                onClick={() => handleProfessionalSelect(professional)}
                                className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                {/* <span className="text-3xl">{professional.icon}</span> */}
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
                        <p>LKR {totalCost.toFixed(2)}</p> {/* Ensure cost is displayed with two decimal places */}
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
