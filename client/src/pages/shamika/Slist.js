import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For redirection
import toast, { Toaster } from 'react-hot-toast';
import backgroundImage from "../../images/5.jpg"; // For toast messages

function Slist() {
    const navigate = useNavigate(); // Hook for redirection
    const initialTicketState = {
        ticket_no: '', // Automatically generated ticket number
        customer_id: '',
        category: 'Booking and Appointment Issues',
        status: 'Pending',
        catalog: '',
        notifications: '',
        remarks: ''
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

        if (name === 'category') {
            const autoResponse = getAutoResponse(value);
            setTicket((prevTicket) => ({
                ...prevTicket,
                catalog: autoResponse.catalog,
                notifications: autoResponse.notifications
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send POST request to server
            const { data } = await axios.post('http://localhost:5000/tickets', ticket);

            // Show success toast message
            toast.success('Successfully submitted!');

            // Redirect to the Support Tickets List page after 2 seconds
            setTimeout(() => {
                navigate('/Slist');
            }, 2000);

        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const handleReset = () => {
        setTicket(initialTicketState);
    };

    // Auto-response messages based on the category
    const getAutoResponse = (category) => {
        const responses = {
            'Booking and Appointment Issues': {
                catalog: 'Catalog 1: Thank you for contacting us regarding booking and appointment issues.',
                notifications: 'We will get back to you soon regarding your booking inquiry.'
            },
            'Payment and Billing Concerns': {
                catalog: 'Catalog 2: Thank you for reaching out about payment and billing concerns.',
                notifications: 'Your payment issue is being reviewed by our team.'
            },
            'Service-Related Complaints': {
                catalog: 'Catalog 3: Your complaint about our services has been logged.',
                notifications: 'We will address your service-related complaint shortly.'
            },
            'Technical Problems with the Online Platform': {
                catalog: 'Catalog 4: Your technical issue is under review.',
                notifications: 'We are working to fix your technical issue on our platform.'
            },
            'Product Inquiries and Issues': {
                catalog: 'Catalog 5: Your product inquiry has been received.',
                notifications: 'We will respond to your product inquiry shortly.'
            }
        };

        return responses[category] || {
            catalog: 'General inquiry',
            notifications: 'Your message has been received and is under review.'
        };
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
            <div className="flex flex-row w-[70%] h-[240px] bg-opacity-70">
                <div
                    className="left-div flex flex-col w-[60%] h-full justify-center pl-6 pamlogin1"
                    style={{
                        background: 'rgb(87, 40, 215, 0.2)',
                        borderRadius: '0',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >

                    <div className="App">
                    <div
                            className="lg:mx-0 text-1xl content-center justify-items-stretch text-gray-700  julius-sans-one-regular font-bold mb-6"
                           >
                            <form onSubmit={handleSubmit}
                                  style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',
                                      textAlign: 'left',
                                      marginBottom: '0.25rem'
                                  }}>
                                <div>
                                    <label style={{marginBottom: '0.5rem'}}>Ticket No.:</label>
                                    <input
                                        type="text"
                                        name="ticket_no"
                                        value={ticket.ticket_no}
                                        readOnly // Make sure it's read-only so the user can't modify it
                                    />
                                </div>

                                <div>
                                    <label style={{marginBottom: '0.5rem' }}>Customer ID:</label>
                                    <input
                                        type="text"
                                        name="customer_id"
                                        value={ticket.customer_id}
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
                                        <option value="Booking and Appointment Issues">Booking and Appointment Issues
                                        </option>
                                        <option value="Payment and Billing Concerns">Payment and Billing Concerns
                                        </option>
                                        <option value="Service-Related Complaints">Service-Related Complaints</option>
                                        <option value="Technical Problems with the Online Platform">Technical Problems
                                            with the Online Platform
                                        </option>
                                        <option value="Product Inquiries and Issues">Product Inquiries and Issues
                                        </option>
                                    </select>
                                </div>


                                <div>
                                    <label>Status:</label>
                                    <input
                                        type="text"
                                        name="status"
                                        value={ticket.status}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Catalog No:</label>
                                    <input
                                        type="text"
                                        name="catalog"
                                        value={ticket.catalog}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label>Notifications:</label>
                                    <input
                                        type="text"
                                        name="notifications"
                                        value={ticket.notifications}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
                <div className="lg:mx-10 bottflex space-x-8 pl-12">
                    <a
                        href="/supporthome"
                        className="flex items-center justify-center h-10 julius-sans-one-regular w-40 bg-black text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                    >
                        Back
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Slist;
