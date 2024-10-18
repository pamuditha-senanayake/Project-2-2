import React, {useEffect, useState} from 'react';
import Navigation from '../pamuditha/nav';
import {useNavigate} from 'react-router-dom';
import homepic4 from "../../images/f.jpg";
import Swal from "sweetalert2";

const UserAppointments2 = () => {
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

    const timeslots = [
        "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM",
        "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM",
        "5:00 PM - 6:00 PM"
    ];

    const [activeButton, setActiveButton] = useState('appointments');

    const handleButtonClick = (buttonName) => {
        // Set active button and navigate
        setActiveButton(buttonName);
        navigate(buttonName === 'profile' ? '/userp' : buttonName === 'appointments' ? '/myappointment2' : '/wallet2');
    };


    const handleDelete = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
        });
        // Additional code for delete confirmation can be added here
    };

    return (
        <div
            className="flex flex-col h-screen w-full julius-sans-one-regular"
            style={{
                backgroundImage: `url(${homepic4})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Navigation/>

            <div className="flex items-center justify-center w-full h-full mt-[20px] overflow-hidden mb-2">
                <div
                    className="flex flex-row w-[90%] h-[90%] space-x-2 border-2 rounded-2xl py-3 px-3 mt-[100px] bg-white overflow-hidden"
                >
                    {/* Left Side */}
                    <div className="flex flex-col w-[20%] h-full rounded-2xl border-2">
                        <p className="p-4 text-3xl">Menu</p>

                        <div className="flex flex-col space-y-4 p-4">
                            <button
                                className={`${
                                    activeButton === 'profile' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('profile')}
                            >
                                Profile
                            </button>
                            <button
                                className={`${
                                    activeButton === 'appointments' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('appointments')}
                            >
                                Appointments
                            </button>
                            <button
                                className={`${
                                    activeButton === 'payment' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('payment')}
                            >
                                Payment
                            </button>

                            {/* Delete Button */}
                            {/*<button*/}
                            {/*    className="text-red-600 font-normal py-2 px-4 rounded-full hover:bg-pink-200 focus:outline-none"*/}
                            {/*    onClick={handleDelete}*/}
                            {/*>*/}
                            {/*    Delete*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col w-full h-full">
                        {/* Top Side */}
                        <div>
                            <h2 className="text-3xl mt-2">My Appointments </h2>
                        </div>


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
                                        <td className="border px-4 py-2">{app.name || 'N/A'}</td>
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
                </div>
            </div>
        </div>
    );
};

export default UserAppointments2;
