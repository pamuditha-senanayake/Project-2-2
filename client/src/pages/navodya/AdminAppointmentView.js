import React, {useEffect, useState} from 'react';
import axios from "axios";

const AdminAppointmentView = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + "/api/appointmentdetails/all"
                );
                console.log(response);
                setAppointments(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getAppointments();
    }, []);

    const timeslots = ["8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"];

    const handleConfirm = async (id) => {
        try {
            const response = await axios.put(
                `http://localhost:3001/api/appointmentconfirmed/confirmed/${id}`
            );
            console.log('Appointment confirmed:', response.data);

            // Option 1: Reload the page
            window.location.reload();

            // Option 2: Navigate back to the same page (if using React Router)
            // navigate('/appointments');  // assuming you have the route
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.put(
                `http://localhost:3001/api/appointmentrejected/rejected/${id}`
            );
            console.log('Appointment rejected:', response.data);

            // Option 1: Reload the page
            window.location.reload();

            // Option 2: Navigate back to the same page
            // navigate('/appointments');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            {appointments.map(app => (
                <div key={app.appointment_id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-medium">{app.firstname}</div>
                        <div className="text-gray-500">
                            {app.service_names.join(', ')} - {app.total_time.hours} hours
                        </div>
                        <div className="text-gray-500">From LKR {app.total_cost}</div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-gray-700">
                            <div>Professional: {app.professional_name}</div>
                            <div>Date: {formatDate(app.appointment_date)} </div>
                            <div> Time: {app.time_numbers.map(index => timeslots[index] || 'Unknown').join(', ')}</div>
                        </div>
                        <div className="space-x-4">
                            {/* Show Confirm button if status is pending or confirmed */}
                            {app.status === 'pending' || app.status === 'confirmed' ? (
                                <button
                                    className="py-2.5 px-6 rounded-lg text-sm font-medium bg-green-500 text-teal-800"
                                    onClick={() => handleConfirm(app.appointment_id)}
                                >
                                    Confirm
                                </button>
                            ) : null}

                            {/* Show Reject button if status is pending or rejected */}
                            {app.status === 'pending' || app.status === 'rejected' ? (
                                <button
                                    className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-red-500"
                                    onClick={() => handleReject(app.appointment_id)}
                                >
                                    Reject
                                </button>
                            ) : null}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminAppointmentView;
