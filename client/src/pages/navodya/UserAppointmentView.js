import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const UserAppointments = () => {
    const [filter, setFilter] = useState('All');
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserAppointments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/myappointment/fetch`, {
                    credentials: 'include' // Include credentials for authentication
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (data.error) {
                    console.error(data.error); // Log error if there is one
                    return;
                }

                setAppointments(data.appointments); // Set appointments if fetched successfully
            } catch (error) {
                console.error('Error fetching appointment details:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        getUserAppointments();
    }, [navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    };

    const getFilteredAppointments = () => {
        if (filter === 'All') {
            return appointments;  // Return all appointments if the filter is 'All'
        }
        return appointments.filter(app => app.status === filter);
    };

    const timeslots = ["8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"];

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
            <div className="mb-4">
                <select
                    className="border rounded px-4 py-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    {/* Added Pending option */}
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Services</th>
                        <th className="px-4 py-2">Professional</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Time Slots</th>
                        <th className="px-4 py-2">Cost</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getFilteredAppointments().map(app => (
                        <tr key={app.appointment_id}>
                            <td className="border px-4 py-2">{app.appointment_id || 'N/A'}</td>
                            <td className="border px-4 py-2">{app.service_names.join(', ') || 'N/A'}</td>
                            <td className="border px-4 py-2">{app.professional_name || 'N/A'}</td>
                            <td className="border px-4 py-2">{formatDate(app.appointment_date)}</td>
                            <td className="border px-4 py-2">{app.time_slots.map(index => timeslots[index] || 'Unknown').join(', ') || 'N/A'}</td>
                            <td className="border px-4 py-2">{app.total_cost || 'N/A'}</td>
                            <td className="border px-4 py-2">{app.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserAppointments;
