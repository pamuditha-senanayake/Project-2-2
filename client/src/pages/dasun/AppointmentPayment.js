import React, {useEffect, useState} from "react";
import NavigationBar from "../navodya/NavigationBar";
import {useNavigate, useParams} from "react-router-dom";

const AppointmentPayment = () => {
    const navigate = useNavigate();
    const {appointmentId} = useParams();

    const timeslots = [
        "8.00 AM - 9.00 AM", "9.00 AM - 10.00 AM", "10.00 AM - 11.00 AM",
        "11.00 AM - 12.00 PM", "12.00 PM - 1.00 PM", "1.00 PM - 2.00 PM",
        "2.00 PM - 3.00 PM", "3.00 PM - 4.00 PM", "4.00 PM - 5.00 PM",
        "5.00 PM - 6.00 PM"
    ];

    const [appointmentStatus, setAppointmentStatus] = useState();
    const [appointmentDate, setAppointmentDate] = useState();
    const [appointmentProfessionalName, setAppointmentProfessionalName] = useState();
    const [serviceNames, setServiceNames] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [totalCost, setTotalCost] = useState();
    const [totalTime, setTotalTime] = useState({hours: 0, minutes: 0});

    const [slip, setSlip] = useState(null); // Add state to store the uploaded slip
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const getAppointmentStatus = async () => {
            fetch(`http://localhost:3001/api/user/status/${appointmentId}`, {credentials: 'include'})
                .then((response) => response.json())
                .then((data) => {
                    setAppointmentStatus(data.status);
                    setAppointmentDate(data.appointment_date);
                    setAppointmentProfessionalName(data.professional_name);
                    setServiceNames(data.service_names || []);
                    setTimeSlots(data.time_slots || []);
                    setTotalCost(data.total_cost);
                    setTotalTime(data.total_time || {hours: 0, minutes: 0});
                })
                .catch((error) => console.error('Fetch error:', error));
        };

        if (appointmentId) {
            getAppointmentStatus();
        }
    }, [appointmentId]);

    const handlePay = () => {
        alert('Appointment is booked!'); // Show a message indicating the appointment is booked
        navigate(`/home`, {});
    };


    const handleSlipUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSlip(file);
        }
    };

    const handleUpload = async (appointmentId) => {
        if (!slip) {
            setErrorMsg("Please upload a payment slip.");
            return;
        }

        const formData = new FormData();
        formData.append("slip", slip);

        try {
            const response = await fetch(`http://localhost:3001/api/upload-slip/${appointmentId}`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Failed to upload the payment slip.");
            }

            alert("Slip uploaded successfully!");
        } catch (error) {
            console.error("Error uploading slip:", error);
            setErrorMsg("An error occurred while uploading the payment slip. Please try again.");
        }
    };

    const handleDelete = async (appointmentId) => {
        if (appointmentStatus === "pending") {
            try {
                const response = await fetch(`http://localhost:3001/api/user/delete?appointmentId=${appointmentId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete: ${response.statusText}`);
                }

                const data = await response.json();
                alert("Appointment deleted successfully.");
                navigate('/appointments');
            } catch (error) {
                console.error('Delete error:', error.message);
                setErrorMsg("An error occurred while trying to delete the appointment. Please try again later.");
            }
        } else {
            setErrorMsg("You cannot cancel a confirmed or rejected appointment.");
        }
    };

    const renderStatusContent = () => {
        switch (appointmentStatus) {
            case 'confirmed':
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✔</div>
                        <p className="text-xl font-bold">Appointment Confirmed</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✘</div>
                        <p className="text-xl font-bold">Appointment Rejected</p>
                    </div>
                );
            case 'pending':
            default:
                return (
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-xl font-bold">Appointment Pending</p>
                    </div>
                );
        }
    };

    // Calculate half of the total cost
    const halfTotalCost = totalCost ? (totalCost / 2).toFixed(2) : "0.00";

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 px-[200px]">
            <NavigationBar activeTab={5}/>

            <div className="flex flex-col md:flex-row w-full mt-[150px]">
                <div className="w-full md:w-2/3 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6">Appointment Status</h2>

                    <div className="bg-white rounded-lg p-8 mb-4">
                        <h3 className="text-lg font-semibold mb-4">Status</h3>
                        {renderStatusContent()}
                    </div>

                    <div className="bg-white rounded-lg p-8">
                        {errorMsg && (
                            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
                                 role="alert">
                                <p className="font-bold">Be Warned</p>
                                <p>{errorMsg}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="slip">
                                Upload Payment Slip
                            </label>
                            <input
                                type="file"
                                id="slip"
                                accept="image/*"
                                onChange={handleSlipUpload}
                                className="block w-full text-gray-900 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={() => handleUpload(appointmentId)}
                            className="w-full bg-blue-500 h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-white"
                        >
                            Upload Slip
                        </button>

                        <p className="text-center text-sm mt-2">• Make sure to upload the payment slip before
                            confirmation</p>
                    </div>
                </div>

                <div className="w-full md:w-1/3 bg-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
                    {serviceNames.length > 0 ? (
                        serviceNames.map((service, index) => (
                            <div key={index} className="mb-2">
                                <h3 className="text-lg font-semibold">{service}</h3>
                            </div>
                        ))
                    ) : (
                        <p>No services selected.</p>
                    )}
                    <hr className="my-4"/>
                    <div className="text-lg">
                        <p className="text-lg font-semibold">
                            Stylist Name: <span
                            className="font-normal">{appointmentProfessionalName || "Select Your Stylist"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Date: <span
                            className="font-normal">{appointmentDate ? new Date(appointmentDate).toLocaleDateString() : "Select A Date"}</span>
                        </p>
                        <p className="text-lg font-semibold">
                            Selected Time: <span
                            className="font-normal">{timeSlots.length > 0 ? timeSlots.map(index => timeslots[index]).join(", ") : "Select A Time Slot"}</span>
                        </p>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <p>Total Cost</p>
                        <p>LKR {totalCost || "0.00"}</p>
                    </div>

                    {/* Half of the total cost */}
                    <div className="flex justify-between">
                        <p>Amount to Pay (50%)</p>
                        <p>LKR {halfTotalCost}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Total Time</p>
                        <p>{totalTime.hours} Hours {totalTime.minutes} Minutes</p>
                    </div>
                    <div className="bg-white rounded-lg p-8 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                        <p className="text-sm">Bank Name: ABC Bank</p>
                        <p className="text-sm">Account Name: Salon Diamond</p>
                        <p className="text-sm">Account Number: 123456789</p>
                        <p className="text-sm">Branch: Main City Branch</p>
                    </div>
                    <div className="bg-white rounded-lg p-8 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                        <p className="text-sm">Bank Name: HNB Bank</p>
                        <p className="text-sm">Account Name: Salon Diamond</p>
                        <p className="text-sm">Account Number: 456789101112</p>
                        <p className="text-sm">Branch: Main City Branch</p>
                    </div>
                    <button
                        onClick={handlePay}
                        disabled={!slip} // Disable the button if slip is null
                        className={`w-full h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md ${slip ? 'bg-green-500 hover:scale-105 hover:shadow-lg' : 'bg-gray-400'} text-white`}
                    >
                        Confirm
                    </button>

                    {/* <button
                        onClick={() => handleDelete(appointmentId)}
                        className="w-full bg-red-500 h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg text-white mt-2"
                    >
                        Cancel Appointment
                    </button>*/}
                </div>
            </div>
        </div>
    );
};

export default AppointmentPayment;
