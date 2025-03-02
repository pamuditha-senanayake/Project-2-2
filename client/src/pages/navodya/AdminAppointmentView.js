import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import homepic7 from "../../images/f.jpg";

const LayoutWithAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]); // State to hold filtered appointments
    const [filter, setFilter] = useState('All'); // State for filter (e.g., pending, all)
    const navigate = useNavigate();

    // Check if the user is an admin
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
                    credentials: 'include'
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/'); // Redirect if not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        checkAdmin();
    }, [navigate]);

    // Fetch all appointments
    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + "/api/appointmentdetails/all"
                );
                setAppointments(response.data);
                setFilteredAppointments(response.data); // Initialize with all appointments
            } catch (err) {
                console.error(err);
            }
        };
        getAppointments();
    }, []);

    // Time slots array
    const timeslots = [
        "8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM",
        "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM",
        "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"
    ];

    // Handle appointment confirmation
    const handleConfirm = async (id) => {
        try {
            const response = await axios.put(
                `https://servertest-isos.onrender.com/api/appointmentconfirmed/confirmed/${id}`
            );
            console.log('Appointment confirmed:', response.data);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    // Handle appointment rejection
    const handleReject = async (id) => {
        try {
            const response = await axios.put(
                `https://servertest-isos.onrender.com/api/appointmentrejected/rejected/${id}`
            );
            console.log('Appointment rejected:', response.data);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    // Filter appointments based on status
    const filterAppointments = (status) => {
        if (status === 'pending') {
            setFilteredAppointments(appointments.filter(app => app.status === 'pending'));
        } else {
            setFilteredAppointments(appointments); // Show all appointments
        }
        setFilter(status); // Update filter state
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar Section */}
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>

            {/* Main Content Section */}
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="p-8 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Appointments</h1>

                    {/* Filter Buttons */}
                    <div className="mb-4">
                        <button
                            className={`py-2 px-4 mr-2 ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            onClick={() => filterAppointments('All')}
                        >
                            All Appointments
                        </button>
                        <button
                            className={`py-2 px-4 ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            onClick={() => filterAppointments('pending')}
                        >
                            Pending Appointments
                        </button>
                    </div>

                    {/* Appointment List */}
                    {filteredAppointments.map(app => (
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
                                    <div>Date: {formatDate(app.appointment_date)}</div>
                                    <div>Time: {app.time_numbers.map(index => timeslots[index] || 'Unknown').join(', ')}</div>
                                </div>
                                <div className="space-x-4">
                                    {app.status === 'pending' || app.status === 'confirmed' ? (
                                        <button
                                            className="py-2.5 px-6 rounded-lg text-sm font-medium bg-green-500 text-teal-800"
                                            onClick={() => handleConfirm(app.appointment_id)}
                                        >
                                            Confirm
                                        </button>
                                    ) : null}
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
            </div>
        </div>
    );
};

export default LayoutWithAppointments;
