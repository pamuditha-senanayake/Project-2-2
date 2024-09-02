import React, {useEffect, useState} from "react";
import NavigationBar from "./NavigationBar";
import {useLocation} from "react-router-dom";

const ConfirmAppointment = () => {
    const location = useLocation();
    const {selectedServices, selectedProfessional, selectedDate, selectedTimeSlots, status} = location.state || {
        selectedServices: [],
        selectedProfessional: null,
        selectedDate: null,
        selectedTimeSlots: null,
        status: 'pending' // Default status
    };

    const [appointmentStatus, setAppointmentStatus] = useState(status);

    useEffect(() => {
        // Here you can fetch the actual status from the server if needed
        setAppointmentStatus(status);
    }, [status]);

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

    const formattedTotalTime = {
        hours: totalTime.hours + Math.floor(totalTime.minutes / 60),
        minutes: totalTime.minutes % 60,
    };

    const totalCost = selectedServices.reduce(
        (total, service) => total + parseFloat(service.price || 0),
        0
    );

    const renderStatusContent = () => {
        switch (appointmentStatus) {
            case 'confirmed':
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✔</div>
                        <p className="text-xl font-bold">Appointment Confirmed</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✘</div>
                        <p className="text-xl font-bold">Appointment Rejected</p>
                    </div>
                );
            case 'pending':
            default:
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-xl font-bold">Appointment Pending</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            <NavigationBar activeTab={4}/>

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Status */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Payment & Confirm</h2>

                    <div className="bg-white rounded-lg p-8 mb-4">
                        <h3 className="text-lg font-semibold mb-4">Status</h3>
                        {renderStatusContent()}
                    </div>

                    <div className="bg-white rounded-lg p-8">
                        <button
                            className="w-full bg-gray-300 h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-gray-700"
                            disabled
                        >
                            Cancel
                        </button>
                        <p className="text-center text-sm mt-2">• Only cancel within 30 mins</p>
                    </div>
                </div>

                {/* Right side - Appointment Summary */}
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
                        <p className="text-lg font-semibold">
                            Selected Date : <span
                            className="font-normal">{selectedDate ? selectedDate.toLocaleDateString() : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time : <span
                            className="font-normal">{selectedTimeSlots.length > 0 ? selectedTimeSlots.join(", ") : "Select A Time Slot"}</span>
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
                    {/*<button*/}
                    {/*    onClick={handleContinue}*/}
                    {/*    className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"*/}
                    {/*>*/}
                    {/*    Continue*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );
};

export default ConfirmAppointment;
