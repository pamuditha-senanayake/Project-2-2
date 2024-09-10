import React, {useEffect, useState} from "react";
import NavigationBar from "./NavigationBar";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const ConfirmAppointment = () => {
    const navigate = useNavigate();
    const {appointmentId} = useParams();

    const timeslots = [
        "8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM",
        "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM",
        "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM",
        "5.00 PM - 6.00 PM"
    ];

    const [appointmentStatus, setAppointmentStatus] = useState();
    const [appointmentDate, setAppointmentDate] = useState();
    const [appointmentProfessionalName, setAppointmentProfessionalName] = useState();
    const [serviceNames, setServiceNames] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [totalCost, setTotalCost] = useState();
    const [totalTime, setTotalTime] = useState({hours: 0, minutes: 0}); // Default value

    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const getAppointmentStatus = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/api/appointmentstatus/status/${appointmentId}`
                );
                const data = response.data;
                setAppointmentStatus(data.status);
                setAppointmentDate(data.appointment_date);
                setAppointmentProfessionalName(data.professional_name);
                setServiceNames(data.service_names || []); // Ensure it's an array
                setTimeSlots(data.time_slots || []); // Ensure it's an array
                setTotalCost(data.total_cost);
                setTotalTime(data.total_time || {hours: 0, minutes: 0}); // Ensure default value
            } catch (err) {
                console.error(err);
            }
        };

        if (appointmentId) {
            getAppointmentStatus();
        }
    }, [appointmentId]);

    const handlePay = async () => {
        try {
            navigate("/pay", {
                state: {
                    appointmentId
                }
            });
        } catch (error) {
            console.error('Error during payment process or navigation:', error);
        }
    };

    const handleDelete = async () => {
        console.log("id " + appointmentId)
        try {
            if (appointmentStatus === "pending") {
                const response = await axios.delete(
                    `http://localhost:3001/api/appointmentdelete/delete/` + appointmentId
                );
                console.log(response);
            } else {
                setErrorMsg("You cannot cancel a confirmation or rejection appointment.");
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    <h2 className="text-2xl font-bold mb-6">Appointment Status</h2>

                    <div className="bg-white rounded-lg p-8 mb-4">
                        <h3 className="text-lg font-semibold mb-4">Status</h3>
                        {renderStatusContent()}
                    </div>

                    <div className="bg-white rounded-lg p-8">
                        {errorMsg && (
                            <div className="text-red-500 text-center mb-4">{errorMsg}</div>
                        )}
                        <button
                            onClick={handleDelete}
                            className="w-full bg-gray-300 h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-gray-700"
                        >
                            Cancel
                        </button>
                        <p className="text-center text-sm mt-2">• Only cancel before confirm or reject </p>
                    </div>
                </div>

                {/* Right side - Appointment Summary */}
                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
                    {serviceNames.length > 0 ? (
                        serviceNames.map((service, index) => (
                            <div key={index} className="mb-2">
                                <h3 className="text-lg font-semibold">{service}</h3>
                                {/* Assuming price and duration are not provided, they need to be displayed if available */}
                                {/* <p>LKR {service.price}</p> */}
                                {/* <p>
                                    {service.duration?.hours ? `${service.duration.hours} hr` : ''}
                                    {service.duration?.hours && service.duration?.minutes ? ' ' : ''}
                                    {service.duration?.minutes ? `${service.duration.minutes} min` : ''}
                                </p> */}
                            </div>
                        ))
                    ) : (
                        <p>No services selected.</p>
                    )}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p className="text-lg font-semibold">
                            Stylist Name: <span
                            className="font-normal">{appointmentProfessionalName || "Select Your Stylist"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Date: <span
                            className="font-normal">{appointmentDate ? new Date(appointmentDate).toLocaleDateString() : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time:
                            <span className="font-normal">
                                {timeSlots.length > 0
                                    ? timeSlots.map(index => timeslots[index]).join(", ")
                                    : "Select A Time Slot"}
                            </span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {totalCost || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{totalTime.hours || totalTime.minutes ? `${totalTime.hours || 0} Hour(s) ${totalTime.minutes || 0} Min(s)` : "0 Hour(s) 0 Min(s)"}</p>
                    </div>
                    <button
                        onClick={handlePay}
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAppointment;
