import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const SelectServices = () => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const navigate = useNavigate();

    // Fetch all services
    useEffect(() => {
        const getAllServices = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/beautyservices/"
                );
                console.log(response);
                setServices(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getAllServices();
    }, []);

    // Update total cost and total time whenever selectedServices changes
    useEffect(() => {
        const newTotal = selectedServices.reduce((acc, service) => acc + parseFloat(service.price), 0);
        const newTotalTime = selectedServices.reduce((acc, service) => {
            const hours = service.duration.hours || 0;
            const mins = service.duration.minutes || 0;
            return acc + parseInt(hours) * 60 + parseInt(mins);
        }, 0);

        setTotal(newTotal);
        setTotalTime(newTotalTime);
    }, [selectedServices]);

    const handleAddService = (service) => {
        setSelectedServices([...selectedServices, service]);
    };

    const handleRemoveService = (indexToRemove) => {
        setSelectedServices(selectedServices.filter((_, index) => index !== indexToRemove));
    };

    const formatTime = (mins) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours} Hour(s) ${minutes} Min(s)`;
    };

    const handleContinue = () => {
        navigate("/professional", {state: {selectedServices}});
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            <NavigationBar activeTab={1}/>

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Services */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Select Services</h2>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-gray-200 p-4 mb-4 flex justify-between items-center rounded-lg"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{service.name}</h3>
                                <p>
                                    {service.duration.hours ? `${service.duration.hours} hr` : ''}
                                    {service.duration.hours && service.duration.minutes ? ' ' : ''}
                                    {service.duration.minutes ? `${service.duration.minutes} min` : ''}
                                </p>
                                <p>From LKR {service.price}</p>
                            </div>
                            <button
                                title="Add Service"
                                className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                                onClick={() => handleAddService(service)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="50px"
                                    height="50px"
                                    viewBox="0 0 24 24"
                                    className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
                                >
                                    <path
                                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                        strokeWidth="1.5"
                                    ></path>
                                    <path d="M8 12H16" strokeWidth="1.5"></path>
                                    <path d="M12 16V8" strokeWidth="1.5"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right side - Selected Services */}
                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
                    {selectedServices.map((service, index) => (
                        <div
                            key={index}
                            className="mb-2 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{service.name}</h3>
                                <p>LKR {service.price}</p>
                                <p>
                                    {service.duration.hours ? `${service.duration.hours} hr` : ''}
                                    {service.duration.hours && service.duration.minutes ? ' ' : ''}
                                    {service.duration.minutes ? `${service.duration.minutes} min` : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemoveService(index)}
                                className="bg-red-300 hover:bg-red-400 p-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{formatTime(totalTime)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {total.toFixed(2)}</p> {/* Ensure cost is displayed with two decimal places */}
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

export default SelectServices;
