import React, {useEffect, useState} from "react";
import NavigationBar from "./NavigationBar"; // Assuming you have a NavigationBar component
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importing the datepicker CSS
import AppointmentSummary from "./AppointmentSummary";
import {useLocation} from "react-router-dom"; // Import the summary component

const SelectDateTime = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const location = useLocation();
    const {selectedServices, selectedProfessional} = location.state || {
        selectedServices: [],
        selectedProfessional: null
    };


    // Example services data (this can be fetched from an API)
    const services = [
        {name: "Ladies Hair Cut", price: 2500, duration: "1 Hour", durationInHours: 1},
        {name: "Hair Trim", price: 600, duration: "30 mins", durationInHours: 0.5},
        {name: "Relaxing Crown", price: 600, duration: "2 Hours, 30 mins", durationInHours: 2.5},
    ];

    // Fetch available time slots from the database based on the selected date
    useEffect(() => {
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            axios
                .get(`/api/timeslots?date=${formattedDate}`)
                .then((response) => {
                    setAvailableTimeSlots(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching time slots:", error);
                });
        }
    }, [selectedDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time selection when a new date is selected
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
            {/* Navigation Bar */}
            <NavigationBar activeTab={3}/>

            <div className="flex flex-col md:flex-row w-full mt-4">
                {/* Left side - Date & Time Selection */}
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>

                    {/* Date Picker */}
                    <div className="bg-white rounded-lg p-4 mb-4 max-w-sm mx-auto">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateSelect}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            inline
                            calendarClassName="w-full max-w-xs text-sm"
                            className="w-full bg-gray-200 p-2 rounded-lg"
                        />
                    </div>

                    {/* Timeslots */}
                    <div className="flex flex-col gap-4">
                        {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`p-4 bg-gray-200 rounded-lg ${
                                        selectedTime === time
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-300"
                                    } transition`}
                                >
                                    {time}
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No available time slots for the selected date.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side - Appointment Summary */}
                <AppointmentSummary
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    services={services}
                />
            </div>
        </div>
    );
};

export default SelectDateTime;
