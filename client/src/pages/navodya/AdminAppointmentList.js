import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import homepic7 from "../../images/f.jpg";

const Layout = () => {

    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
                    credentials: 'include' // Include credentials with the request
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/'); // Redirect if the user is not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const getDoneAppointmentDetails = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + "/api/appointmentdone/all/done"
                );
                console.log(response);
                setAppointments(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getDoneAppointmentDetails();
    }, []);

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

    const timeslots = [
        "8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM",
        "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM",
        "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"
    ];

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="p-8 bg-gray-100 ">
                    <h1 className="text-2xl font-bold mb-4 ">All Appointments</h1>
                    <div className="mb-4 flex flex-col md:flex-row">
                        <select
                            className="border rounded px-4 py-2"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Services</th>
                                <th className="px-4 py-2">Professional</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Time Slots</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {getFilteredAppointments().map(app => (
                                <tr key={app.appointment_id}>
                                    <td className="border px-4 py-2">{app.firstname}</td>
                                    <td className="border px-4 py-2">{app.service_names.join(', ')}</td>
                                    <td className="border px-4 py-2">{app.professional_name}</td>
                                    <td className="border px-4 py-2">{formatDate(app.appointment_date)}</td>
                                    <td className="border px-4 py-2">{app.time_numbers.map(index => timeslots[index] || 'Unknown').join(', ')}</td>
                                    <td className="border px-4 py-2">{app.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <button className="bg-gray-800 text-white px-4 py-2 rounded">Generate PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
