import React, { useState } from 'react';
import axios from 'axios';

function Ticket() {
    const initialTicketState = {
        customer_id: '',
        email: '',
        contact_no: '',
        category: 'Booking and Appointment Issues',
        inquiry_description: ''
    };

    const [ticket, setTicket] = useState(initialTicketState);

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
        <div className="App">
            <h1>New Customer Support Ticket</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Customer ID:</label>
                    <input
                        type="text"
                        name="customer_id"
                        value={ticket.customer_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={ticket.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contact No:</label>
                    <input
                        type="text"
                        name="contact_no"
                        value={ticket.contact_no}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
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
                <div>
                    <label>Inquiry Description (Max 100 characters):</label>
                    <input
                        type="text"
                        name="inquiry_description"
                        value={ticket.inquiry_description}
                        onChange={handleChange}
                        maxLength="100"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleReset}>Reset</button>
            </form>
        </div>
    );
}

export default Ticket;
