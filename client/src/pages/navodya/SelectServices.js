import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const SelectServices = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [showAlert, setShowAlert] = useState(false); // Add state for the alert

    // Fetch all services
    useEffect(() => {
        const getAllServices = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + '/api/beautyservices/'
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
        setShowAlert(false); // Hide the alert if a service is added
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
        if (selectedServices.length > 0) {
            navigate("/professional", {state: {selectedServices}});
        } else {
            setShowAlert(true); // Show the alert if no services are selected
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 px-[200px]">
            <NavigationBar activeTab={1}/>

            <div className="flex flex-col md:flex-row w-full mt-[150px]">

                {/* Left side - Services */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8 max-h-screen overflow-y-auto">

                    {/* Custom alert - Conditionally render */}
                    {showAlert && (
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6"
                             role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>Please select at least one service before continuing.</p>
                        </div>
                    )}

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
                <div className="w-full md:w-1/3 h-auto bg-gray-200 p-8">
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
                        /* disabled={selectedServices.length === 0}*/
                        className={`w-full mt-6 h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-white 
                          ${selectedServices.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:before:left-0'}
                        `}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectServices;
