import React from "react";

const AppointmentSummary = ({ selectedDate, selectedTime, services, professional }) => {
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const totalHours = services.reduce((sum, service) => sum + service.durationInHours, 0);

    return (
        <div className="w-full md:w-1/3 bg-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
            {services.map((service, index) => (
                <div className="mb-2" key={index}>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p>LKR {service.price}</p>
                    <p>{service.duration}</p>
                </div>
            ))}
            <hr className="my-4" />
            <div className="text-lg">
                <p>Professional: {professional ? professional.name : "(Professional's name)"}</p>
                <p>Date: {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}</p>
                <p>Time: {selectedTime || "Select a time"}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
                <p>Total</p>
                <p>{totalHours} Hours</p>
                <p>LKR {totalPrice}</p>
            </div>
            <button
                className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-white"
                disabled={!selectedDate || !selectedTime}
            >
                Continue
            </button>
        </div>
    );
};

export default AppointmentSummary;
