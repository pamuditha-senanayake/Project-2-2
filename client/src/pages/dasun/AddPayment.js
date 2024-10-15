import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import NavigationBar from "../navodya/NavigationBar";

const AppointmentDetails = ({appointmentId}) => {
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAppointmentDetails = async () => {
            try {
                // Construct the API endpoint with the passed appointmentId
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/user/appointment/${appointmentId}/fetch`,
                    {
                        credentials: 'include' // Include credentials for authentication
                    }
                );

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (data.error) {
                    console.error(data.error); // Log error if there is one
                    setError(data.error); // Set error state
                    return;
                }

                setAppointment(data); // Set the single appointment details if fetched successfully
            } catch (error) {
                console.error('Error fetching appointment details:', error);
                setError('Error fetching appointment details.'); // Set error state
                navigate('/'); // Redirect in case of an error
            }
        };

        if (appointmentId) {
            getAppointmentDetails(); // Fetch only if appointmentId is present
        }
    }, [navigate, appointmentId]);

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <NavigationBar activeTab={5}/>
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Appointment Details</h2>
            {error && <p className="text-red-600">{error}</p>}
            {appointment ? (
                <div>
                    <h3 className="text-lg font-semibold">Service(s):</h3>
                    {appointment.serviceNames.length > 0 ? (
                        appointment.serviceNames.map((service, index) => (
                            <div key={index} className="mb-2">
                                <h4 className="text-md">{service}</h4>
                            </div>
                        ))
                    ) : (
                        <p>No services selected.</p>
                    )}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p className="text-lg font-semibold">
                            Stylist Name: <span
                            className="font-normal">{appointment.professionalName || "Select Your Stylist"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Date: <span
                            className="font-normal">{appointment.date ? new Date(appointment.date).toLocaleDateString() : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time: <span
                            className="font-normal">{appointment.timeSlots.length > 0 ? appointment.timeSlots.join(", ") : "Select A Time Slot"}</span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {appointment.totalCost || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{appointment.totalTime.hours || appointment.totalTime.minutes ? `${appointment.totalTime.hours || 0} Hour(s) ${appointment.totalTime.minutes || 0} Min(s)` : "0 Hour(s) 0 Min(s)"}</p>
                    </div>
                    <button
                        onClick={() => navigate('/payment')}
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                    >
                        Pay Now
                    </button>
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600">Loading appointment details...</p>
            )}
        </div>
    );
};

export default AppointmentDetails;
