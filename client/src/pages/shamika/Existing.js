import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from "../../images/a2.jpg";

function App() {
    const [formData, setFormData] = useState({
        customerName: '',
        address: '',
        contactNo: '',
        email: '',
        inquiryDescription: '',
        issueCategory: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/tickets/submit', formData);
            toast.success('Successfully submitted!');

            let catalog;
            switch (formData.issueCategory) {
                case 'Booking and Appointment Issues':
                    catalog = '1';
                    break;
                case 'Payment and Billing Concerns':
                    catalog = '2';
                    break;
                case 'Service-Related Complaints':
                    catalog = '3';
                    break;
                case 'Product Inquiries and Issues':
                    catalog = '4';
                    break;
                case 'Technical Problems with the Online Platform':
                    catalog = '5';
                    break;
                default:
                    catalog = 'N/A';
            }

            // Send notification about the catalog
            await axios.put(`/api/tickets/update/${response.data.ticket.id}`, { catalogNo: catalog });
            alert(`Catalog ${catalog} has been sent.`);
        } catch (error) {
            toast.error('Error submitting the ticket.');
        }
    };

    return (

        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div className="flex flex-col w-[50%] h-full justify-center pl-9"
                     style={{
                         background: 'rgba(87, 40, 215, 0.2)',
                         borderRadius: '16px',
                         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                         backdropFilter: 'blur(5px)',
                         WebkitBackdropFilter: 'blur(5px)',
                         border: '1px solid rgba(255, 255, 255, 0.3)',
                     }}
                >
                    <div className="App">
                        <h1>Customer Support Ticket</h1>
                        <form onSubmit={handleSubmit}>
                            <label>Customer Name:</label>
                            <input type="text" name="customerName" onChange={handleChange} required/>
                            <label>Address:</label>
                            <input type="text" name="address" onChange={handleChange} required/>
                            <label>Contact No:</label>
                            <input type="text" name="contactNo" onChange={handleChange} required/>
                            <label>Email:</label>
                            <input type="email" name="email" onChange={handleChange} required/>
                            <label>Inquiry Description:</label>
                            <textarea name="inquiryDescription" onChange={handleChange} required/>
                            <label>Issue Category:</label>
                            <select name="issueCategory" onChange={handleChange} required>
                                <option>Booking and Appointment Issues</option>
                                <option>Payment and Billing Concerns</option>
                                <option>Service-Related Complaints</option>
                                <option>Product Inquiries and Issues</option>
                                <option>Technical Problems with the Online Platform</option>
                            </select>
                            <a
                                href="/ticket"
                                className="lg:mx-32 bg-yellow-600 hover:bg-amber-200  julius-sans-one-regular text-black font-medium py-3 px-6 rounded-md"
                            >
                                back
                            </a>
                            <a
                                href="/profile"
                                className="lg:mx-32 bg-yellow-600 hover:bg-amber-200  julius-sans-one-regular text-black font-medium py-3 px-6 rounded-md"
                            >
                                profile
                            </a>
                        </form>
                        <ToastContainer/>
                    </div>
                </div>
            </div>
        </div>
                    );
                    }

                    export default App;
