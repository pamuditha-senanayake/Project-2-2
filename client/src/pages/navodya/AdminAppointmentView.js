import React, {useEffect, useState} from 'react';
import axios from "axios";

const AdminAppointmentView = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/appointmentdetails/all"
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
                        <div className="text-lg font-medium">{app.user_name}</div>
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
                            <button
                                className={`px-4 py-2 rounded ${app.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => handleConfirm(app.appointment_id)}
                            >
                                Confirm
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${app.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => handleReject(app.appointment_id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminAppointmentView;
