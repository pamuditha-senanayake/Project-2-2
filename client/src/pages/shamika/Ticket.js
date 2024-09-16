import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from "../../images/5.jpg";

function Ticket() {

    // Initialize state with ticket fields
    const initialTicketState = {
        ticket_no: '', // Automatically generated ticket number
        customer_id: '',
        email: '',
        contact_no: '',
        category: 'Booking and Appointment Issues',
        inquiry_description: ''
    };

    const [ticket, setTicket] = useState(initialTicketState);

    // Automatically generate Ticket No. on component load
    useEffect(() => {
        const generatedTicketNo = `TICKET-${Math.floor(Math.random() * 100000)}`;
        setTicket((prevTicket) => ({
            ...prevTicket,
            ticket_no: generatedTicketNo
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket((prevTicket) => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/tickets', ticket);
            alert(`Ticket No. ${data.ticket_no} created successfully!`);
            handleReset();  // Reset form after successful submission
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    const handleReset = () => {
        setTicket(initialTicketState);
    };

    return (

        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div
                    className="left-div flex flex-col w-[75%] h-full justify-center pl-6 pamlogin1"
                    style={{
                        background: 'rgba(87, 40, 215, 0.2)',
                        borderRadius: '0',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >

                    <div className="App">
                        <h1 className="lg:mx-20 justify-center julius-sans-one-regular text-3xl font-bold text-rgb255 mb-4">New
                            Customer Support Ticket
                        </h1>
                        <div className="lg:mx-20 text-1xl justify-items-stretch text-black julius-sans-one-regular font-bold mb-12">
                            <form onSubmit={handleSubmit}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                                {/* Automatically Generated Ticket No */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }}>Ticket No.:</label>
                                    <input
                                        type="text"
                                        name="ticket_no"
                                        value={ticket.ticket_no}
                                        readOnly // Make sure it's read-only so the user can't modify it
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }}>Customer ID:</label>
                                    <input
                                        type="text"
                                        name="customer_id"
                                        value={ticket.customer_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }}>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={ticket.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }}>Contact No:</label>
                                    <input
                                        type="text"
                                        name="contact_no"
                                        value={ticket.contact_no}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: '0.5rem' }}>Category:</label>
                                    <select
                                        name="category"
                                        value={ticket.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Booking and Appointment Issues">Booking and Appointment Issues</option>
                                        <option value="Payment and Billing Concerns">Payment and Billing Concerns</option>
                                        <option value="Service-Related Complaints">Service-Related Complaints</option>
                                        <option value="Technical Problems with the Online Platform">Technical Problems with the Online Platform</option>
                                        <option value="Product Inquiries and Issues">Product Inquiries and Issues</option>
                                    </select>
                                </div>
                                <div style={{marginBottom: '1rem'}}>
                                    <label style={{marginBottom: '0.5rem'}}>Inquiry Description (Max 100
                                        characters):</label>

                                    <input
                                        type="text"
                                        name="inquiry_description"
                                        value={ticket.inquiry_description}
                                        onChange={handleChange}
                                        maxLength="400"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex 1 space-x-6 pl-12">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center h-10 julius-sans-one-regular w-40 bg-black text-white border-[1px] rounded-lg transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="flex items-center justify-center h-10 julius-sans-one-regular w-40 bg-black text-white border-[1px] rounded-lg transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                    >
                                        Re-set
                                    </button>
                                    <a
                                        href="/myticket"
                                        className="flex items-center justify-center h-10 julius-sans-one-regular w-25 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                    >
                                        My Ticket
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;
