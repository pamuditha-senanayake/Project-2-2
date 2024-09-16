import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For redirection
import toast, { Toaster } from 'react-hot-toast';
import backgroundImage from "../../images/5.jpg"; // For toast messages

function Myticket() {
    const navigate = useNavigate(); // Hook for redirection
    const initialTicketState = {
        ticket_no: '', // Automatically generated ticket number
        customer_id: '',
        email: '',
        contact_no: '',
        category: 'Booking and Appointment Issues',
        inquiry_description: '',
        status: 'Pending',
        catalog: '',
        notifications: '',
        remarks: ''
    };

    const [ticket, setTicket] = useState(initialTicketState);
    // Automatically generate Ticket No. on component load
    useEffect(() => {
        const generatedTicketNo = `TICKET-${100 + Math.floor(Math.random() * 100000)}`;
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
                        <Toaster/> {/* Component to display toast messages */}
                        <h1 className="lg:mx-10 justify-center julius-sans-one-regular text-3xl font-bold text-rgb255 mb-4">My
                            Ticket   </h1>
                        <div
                            className="lg:mx-20 text-1xl justify-items-stretch text-black julius-sans-one-regular font-bold mb-12 ">
                            <form onSubmit={handleSubmit}
                                  style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',
                                      textAlign: 'left'
                                  }}>
                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Ticket No.:</label>
                                    <input
                                        type="text"
                                        name="ticket_no"
                                        className="lg:mx-20  width: '1000px' border julius-sans-one-regular w-40 h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.ticket_no}
                                        readOnly // Make sure it's read-only so the user can't modify it
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Customer ID:</label>
                                    <input
                                        type="text"
                                        name="customer_id"
                                        className=" lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.customer_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="lg:mx-20 border width: '300px' julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Contact No:</label>
                                    <input
                                        type="text"
                                        name="contact_no"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.contact_no}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Category:</label>
                                    <select
                                        name="category"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}> Description:</label>
                                    <input
                                        type="text"
                                        name="inquiry_description"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.inquiry_description}
                                        onChange={handleChange}
                                        maxLength="400"
                                        required
                                    />
                                </div>
                                <div style={{marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Date:</label>
                                    <input
                                        type="text"
                                        name="current_date"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={Date}
                                        readOnly
                                    />
                                </div>
                                <div style={{marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Status:</label>
                                    <input
                                        type="text"
                                        name="status"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.status}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Catalog:</label>
                                    <input
                                        type="text"
                                        name="catalog"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.catalog}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Notifications:</label>
                                    <input
                                        type="text"
                                        name="notifications"
                                        className="lg:mx-20 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.notifications}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                                    <label style={{width: '150px', marginBottom: '0.5rem'}}>Remarks:</label>
                                    <input
                                        type="text"
                                        name="inquiry_description"
                                        className="lg:mx-20  border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.remarks}
                                        onChange={handleChange}
                                        maxLength="400"
                                        required
                                    />
                                </div>


                                <div className="lg:mx-20 flex 1 space-x-4 pl-12 mt-6-">
                                    <a
                                        href="/profile"
                                        className=" flex items-center justify-center h-10 julius-sans-one-regular w-40 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                    >
                                        Profile
                                    </a>
                                    <a
                                        href="/supporthome"
                                        className="flex items-center justify-center h-10 julius-sans-one-regular w-40 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                    >
                                        Back
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

export default Myticket;
