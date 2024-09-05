import React, {useState} from "react";
import NavigationBar from "./NavigationBar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useLocation, useNavigate} from "react-router-dom";

const SelectDateTime = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);
    const location = useLocation();
    const {selectedServices, selectedProfessional} = location.state || {
        selectedServices: [],
        selectedProfessional: null
    };

    let appointmentId = 0;

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

    const totalDurationInMinutes = formattedTotalTime.hours * 60 + formattedTotalTime.minutes;
    const totalSlotsNeeded = Math.ceil(totalDurationInMinutes / 60) || 1;

    const totalCost = selectedServices.reduce(
        (total, service) => total + parseFloat(service.price || 0),
        0
    );
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const appointmentData = {
                user_id: 5, // Replace with actual user ID
                professional_id: selectedProfessional ? selectedProfessional.id : null,
                appointment_date: selectedDate,
                total_time: `${formattedTotalTime.hours}:${formattedTotalTime.minutes}:00`,
                total_cost: totalCost
            };

            const serviceIds = selectedServices.map(service => service.id);
            const timeNumbers = selectedTimeSlots; // Assuming selectedTimeSlots contains time numbers

            // Send the POST request and get the response
            const response = await axios.post('http://localhost:3001/api/appointmentservice/confirm', {
                appointmentData,
                serviceIds,
                time_numbers: timeNumbers
            });

            // Accessing the response data
            appointmentId = response.data.appointmentId;
            console.log('Response data:', appointmentId);

        } catch (error) {
            console.error("Error saving appointment:", error);
            alert("An error occurred while saving the appointment.");
        }
    };

    const handleContinue = async () => {
        try {
            await handleSave();
            navigate('/confirm/' + appointmentId, {
                state: {
                    selectedServices,
                    selectedProfessional,
                    selectedTimeSlots,
                    selectedDate
                }
            });
        } catch (error) {
            console.error('Error during save or navigation:', error);
        }
    };

    const timeslots = ["8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM", "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM", "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM", "5.00 PM - 6.00 PM"];

    const handleDateSelect = async (date) => {
        const formattedDate = date.toLocaleDateString('en-CA');
        setSelectedDate(formattedDate);
        setSelectedTimeSlots([]);

        if (selectedProfessional && date) {
            try {
                const response = await axios.get(`http://localhost:3001/api/appointmentservice/unavailable/` + selectedProfessional.id + '/' + formattedDate);
                const bookedTimeSlots = response.data; // Assuming the response data contains the booked time slots
                setUnavailableTimeSlots(bookedTimeSlots);
            } catch (error) {
                console.error("Error fetching time slots:", error);
                setUnavailableTimeSlots([]);
            }
        }
    };

    const handleTimeSelect = (timeIndex) => {
        const selectedIndices = [];
        for (let i = timeIndex; i < timeIndex + totalSlotsNeeded; i++) {
            selectedIndices.push(i);
        }
        setSelectedTimeSlots(selectedIndices);
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
                            onChange={handleDateSelect}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            inline
                            calendarClassName="w-full max-w-xs text-sm"
                            className="w-full bg-gray-200 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Timeslots */}
                    <div className="flex flex-col gap-4 items-center justify-center">
                        {timeslots.map((time, index) => (
                            <button
                                key={index}
                                onClick={() => handleTimeSelect(index)}
                                className={`w-8/12 h-12 text-lg rounded-lg ${
                                    selectedTimeSlots.includes(index)
                                        ? "bg-blue-500 text-white"
                                        : unavailableTimeSlots.includes(index)
                                            ? "bg-gray-200 hover:bg-gray-300"
                                            : "bg-gray-500 text-white"
                                } transition`}
                                disabled={unavailableTimeSlots.includes(index) || index + totalSlotsNeeded > timeslots.length}
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
                            Stylist Name:
                            <span
                                className="font-normal">{selectedProfessional ? selectedProfessional.name : "Select Your Stylist"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Date:
                            <span className="font-normal">{selectedDate ? selectedDate : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time:
                            <span className="font-normal">
                                {selectedTimeSlots.length > 0
                                    ? selectedTimeSlots.map(index => timeslots[index]).join(", ")
                                    : "Select A Time Slot"}
                            </span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {totalCost.toFixed(2)}</p>
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
