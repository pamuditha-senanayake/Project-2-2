import React, {useEffect, useState} from "react";
import NavigationBar from "./NavigationBar"; // Assuming you have a NavigationBar component
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importing the datepicker CSS
import {useLocation, useNavigate} from "react-router-dom"; // Import the summary component

const SelectDateTime = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const location = useLocation();
    const {selectedServices, selectedProfessional} = location.state || {
        selectedServices: [],
        selectedProfessional: null
    };

    const totalTime = selectedServices.reduce(
        (total, service) => {
            const serviceDuration = service.duration;
            const hours = serviceDuration.hours || 0;
            const minutes = serviceDuration.minutes || 0;
            total.hours += hours;
            total.minutes += minutes;
            return total;
        },
        {hours: 0, minutes: 0}
    );

    const formattedTotalTime = {
        hours: totalTime.hours + Math.floor(totalTime.minutes / 60),
        minutes: totalTime.minutes % 60,
    };

    // Treat durations <= 1 hour as 1 slot
    const totalDurationInMinutes = formattedTotalTime.hours * 60 + formattedTotalTime.minutes;
    const totalSlotsNeeded = Math.ceil(totalDurationInMinutes / 60) || 1; // Always use at least 1 slot

    const totalCost = selectedServices.reduce(
        (total, service) => total + parseFloat(service.price || 0),
        0
    );
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate("/confirm", {
            state: {
                selectedServices,
                selectedProfessional,
                selectedTimeSlots,
                selectedDate
            }
        });
    }

    const timeslots = ["8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"];

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
        setSelectedTimeSlots([]); // Reset time selection when a new date is selected
    };

    const handleTimeSelect = (timeIndex) => {
        const slotsToSelect = timeslots.slice(timeIndex, timeIndex + totalSlotsNeeded);
        setSelectedTimeSlots(slotsToSelect);
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
                    <div className="bg-white rounded-lg p-4 mb-4 max-w-sm mx-auto shadow-lg">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateSelect}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            inline
                            calendarClassName="w-full max-w-xs text-sm"
                            className="w-full bg-gray-200 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>


                    {/* Timeslots */}
                    <div className="flex flex-col gap-4">
                        {timeslots.map((time, index) => (
                            <button
                                key={index}
                                onClick={() => handleTimeSelect(index)}
                                className={`p-4 bg-gray-200 rounded-lg ${
                                    selectedTimeSlots.includes(time) ? "bg-blue-500 text-white" : "hover:bg-gray-300"
                                } transition`}
                                disabled={index + totalSlotsNeeded > timeslots.length} // Disable if not enough slots
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side - Summary */}
                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
                    {selectedServices.map((service) => (
                        <div key={service.id} className="mb-2">
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p>LKR {service.price}</p>
                            <p>
                                {service.duration.hours ? `${service.duration.hours} hr` : ''}
                                {service.duration.hours && service.duration.minutes ? ' ' : ''}
                                {service.duration.minutes ? `${service.duration.minutes} min` : ''}
                            </p>
                        </div>
                    ))}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p className="text-lg font-semibold">
                            Stylist Name : <span
                            className="font-normal">{selectedProfessional ? selectedProfessional.name : "Select Your Stylist"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Date : <span
                            className="font-normal">{selectedDate ? selectedDate.toLocaleDateString() : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time : <span
                            className="font-normal">{selectedTimeSlots.length > 0 ? selectedTimeSlots.join(", ") : "Select A Time Slot"}</span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {totalCost.toFixed(2)}</p> {/* Ensure cost is displayed with two decimal places */}
                    </div>
                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{`${formattedTotalTime.hours} Hour(s) ${formattedTotalTime.minutes} Min(s)`}</p>
                    </div>
                    <button
                        onClick={handleContinue}
                        className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
                    >
                        Continue
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SelectDateTime;
