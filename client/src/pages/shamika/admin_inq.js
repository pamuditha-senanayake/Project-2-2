import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import { CSVLink } from "react-csv"; // Import CSVLink for CSV export

const Layout = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
                    credentials: 'include'
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/');
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/');
            }
        };

        checkAdmin();
        fetchInquiries();
    }, [navigate]);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/user/inquiries/viewall', {
                credentials: 'include'
            });
            const data = await response.json();
            setInquiries(data.inquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        }
    };

    const handleResponse = async (inquiry) => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/inquiries/${inquiry.id}/respond`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: responseMessage})
            });
            if (response.ok) {
                setResponseMessage('');
                fetchInquiries();
            } else {
                console.error('Failed to send response.');
            }
        } catch (error) {
            console.error('Error sending response:', error);
        }
    };

    const filteredInquiries = inquiries.filter((inquiry) => {
        if (filter === 'all') return true;
        if (filter === 'responded') return inquiry.responded;
        if (filter === 'notResponded') return !inquiry.responded;
        return true;
    });

    const notRespondedCount = inquiries.filter(inquiry => !inquiry.responded).length;

    // CSV Report data generation
    const csvData = inquiries.map(inquiry => ({
        Category: inquiry.category,
        Message: inquiry.message,
        Status: inquiry.responded ? 'Responded' : 'Pending'
    }));

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4">
                <div className="flex flex-col h-screen w-full">
                    <div className="pt-[20px] h-full flex flex-col w-full items-center justify-center">
                        <h1 className="text-4xl font-bold mb-6 text-black">Admin - Manage Inquiries</h1>

                        <div className="bg-white p-6 rounded shadow-lg w-[80%] overflow-auto h-[80%]">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inquiries</h2>

                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-red-600 mb-4">
                                    Not Responded Inquiries: {notRespondedCount}
                                </h2>

                                <label htmlFor="inquiryFilter" className="block mb-2 font-semibold">Filter Inquiries:</label>
                                <select
                                    id="inquiryFilter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border rounded p-2"
                                >
                                    <option value="all">All Inquiries</option>
                                    <option value="responded">Responded</option>
                                    <option value="notResponded">Not Responded</option>
                                </select>
                            </div>

                            {/* Inquiries Table */}
                            <table className="min-w-full bg-white">
                                <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Category</th>
                                    <th className="py-2 px-4 border-b">Message</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredInquiries.length > 0 ? (
                                    filteredInquiries.map((inquiry) => (
                                        <tr key={inquiry.id}>
                                            <td className="py-2 px-4 border-b">{inquiry.category}</td>
                                            <td className="py-2 px-4 border-b">{inquiry.message}</td>
                                            <td className="py-2 px-4 border-b">{inquiry.responded ? 'Responded' : 'Pending'}</td>
                                            <td className="py-2 px-4 border-b">
                                                {!inquiry.responded && (
                                                    <button
                                                        className="bg-pink-500 text-white px-4 py-2 rounded"
                                                        onClick={() => setSelectedInquiry(inquiry)}
                                                    >
                                                        Respond
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">No inquiries found.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                            {/* Report Generation Button */}
                            <div className="mt-4">
                                <CSVLink
                                    data={csvData}
                                    filename={"inquiries_report.csv"}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Download Report (CSV)
                                </CSVLink>
                            </div>
                        </div>

                        {/* Response Popup */}
                        {selectedInquiry && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                                    <h2 className="text-xl font-semibold">Respond to Inquiry</h2>
                                    <p className="mt-4">Category: {selectedInquiry.category}</p>
                                    <p>Message: {selectedInquiry.message}</p>
                                    <textarea
                                        className="border rounded p-2 w-full mt-4"
                                        placeholder="Type your response here..."
                                        rows="4"
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                    ></textarea>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            className="bg-pink-500 text-white px-4 py-2 rounded"
                                            onClick={() => {
                                                handleResponse(selectedInquiry);
                                                setSelectedInquiry(null);
                                            }}
                                        >
                                            Send Response
                                        </button>
                                        <button
                                            className="bg-gray-300 text-black px-4 py-2 rounded"
                                            onClick={() => setSelectedInquiry(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
