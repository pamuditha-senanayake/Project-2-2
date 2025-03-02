import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import homepic7 from "../../images/f.jpg";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles

const Layout = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [appointments, setAppointments] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [startDate, setStartDate] = useState(null); // Start date filter
    const [endDate, setEndDate] = useState(null);     // End date filter

    const services = [
        'Ladies Hair Cut', 'Men Hair Cut', 'Hair Coloring', 'Beard Trim', 'Facial Treatment', 'Manicure',
        'Pedicure', 'Hair Wash & Blow Dry', 'Full Body Massage', 'Eyebrow Shaping', 'Hair Straightening',
        'Nail Art', 'Spa Treatment', 'Makeup Application', 'Waxing - Full Body', 'Hot Oil Treatment',
        'Shampoo & Style', 'Men Shave', 'Eyebrow Tinting', 'Hair Extensions'
    ];

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
                    navigate('/'); // Redirect if the user is not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/');
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

    const isWithinDateRange = (appointmentDate) => {
        const appointmentTime = new Date(appointmentDate).getTime();
        const start = startDate ? new Date(startDate).getTime() : null;
        const end = endDate ? new Date(endDate).getTime() : null;

        if (start && end) {
            return appointmentTime >= start && appointmentTime <= end;
        } else if (start) {
            return appointmentTime >= start;
        } else if (end) {
            return appointmentTime <= end;
        }

        return true; // No date filters applied
    };

    const getFilteredAppointments = () => {
        let filtered = appointments;

        if (filter !== 'All') {
            filtered = filtered.filter(app => app.status === filter);
        }

        if (selectedService) {
            filtered = filtered.filter(app => app.service_names.includes(selectedService));
        }

        // Apply date range filter
        if (startDate || endDate) {
            filtered = filtered.filter(app => isWithinDateRange(app.appointment_date));
        }

        return filtered;
    };

    const timeslots = [
        "8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM",
        "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM",
        "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"
    ];

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('All Appointments', 14, 22);

        const filteredAppointments = getFilteredAppointments();
        const tableData = filteredAppointments.map(app => [
            app.firstname,
            app.service_names.join(', '),
            app.professional_name,
            formatDate(app.appointment_date),
            app.time_numbers.map(index => timeslots[index] || 'Unknown').join(', '),
            app.status
        ]);

        doc.autoTable({
            head: [['Name', 'Services', 'Professional', 'Date', 'Time Slots', 'Status']],
            body: tableData,
            startY: 30,
        });

        doc.save('appointments.pdf');
    };

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
                <div className="p-8 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">All Appointments</h1>
                    <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 space-x-2">
                        <select
                            className="border rounded px-4 py-2"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            className="border rounded px-4 py-2"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="">All Services</option>
                            {services.map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                            ))}
                        </select>
                        {/* Date filters */}
                        <div className="flex space-x-2">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                className="border rounded px-4 py-2"
                                placeholderText="Start Date"
                                dateFormat="yyyy-MM-dd"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                className="border rounded px-4 py-2"
                                placeholderText="End Date"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
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
                        <button
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                            onClick={generatePDF}
                        >
                            Generate PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
