import React, {useState, useEffect} from "react";
import Sidebar from "../com/admindash";
import axios from "axios";
import {FaEdit, FaTrash} from "react-icons/fa"; // Import icons if not already imported
import {message} from "antd";
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";

function AdminTestimonials() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
                    credentials: 'include' // Include credentials with the request
                });

                if (response.status === 403 || response.status === 401) {
                    navigate('/'); // Redirect if not authorized
                    return;
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    navigate('/'); // Redirect if the user is not an admin
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                navigate('/'); // Redirect in case of an error
            }
        };

        checkAdmin();
    }, [navigate]);

    const [testimonials, setTestimonials] = useState([]);
    const [filteredTestimonials, setFilteredTestimonials] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [currentPageRating, setCurrentPageRating] = useState(1);
    const [userData, setUserData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of testimonials per page
    const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
    const totalPagesRating = Math.ceil(
        filteredTestimonials.filter((t) => t.rating).length / itemsPerPage
    );

    const [expandedRows, setExpandedRows] = useState({});

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    "https://servertest-isos.onrender.com/api/user/profile",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials: "include", // Include cookies for session
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched user data:", data); // Log the fetched data
                    setUserData(data);
                } else {
                    console.error(
                        "Failed to fetch user data, status:",
                        response.status
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching user data:",
                    error
                );
            }
        };

        fetchUserData();
    }, []);

    // Toggle function to switch between expanded and collapsed text
    const toggleExpand = (index) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Calculate indices for pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const startIndexRating = (currentPageRating - 1) * itemsPerPage;
    const endIndexRating = startIndexRating + itemsPerPage;

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPageRating = () => {
        if (currentPageRating > 1) {
            setCurrentPageRating(currentPageRating - 1);
        }
    };

    const handleNextPageRating = () => {
        if (currentPageRating < totalPagesRating) {
            setCurrentPageRating(currentPageRating + 1);
        }
    };

    // Retrieve the email from localStorage
    const customerEmail = localStorage.getItem("customerEmail");

    // Fetch all testimonials function
    const fetchAllTestimonials = async () => {
        try {
            const response = await axios.get(
                "https://servertest-isos.onrender.com/api/testimonials"
            );
            setTestimonials(response.data);
        } catch (err) {
            console.error("Error fetching testimonials:", err);
            message.error("Failed to fetch testimonials. Please try again later.");

        }
    };

    // Update filtered testimonials when search term or testimonials data changes
    useEffect(() => {
        const tempList = testimonials.filter(
            (testimonial) =>
                (testimonial.id &&
                    testimonial.id
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (testimonial.description &&
                    testimonial.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (testimonial.title &&
                    testimonial.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (testimonial.status &&
                    testimonial.status
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (testimonial.rating &&
                    testimonial.rating.toString().includes(searchTerm))
        );
        setFilteredTestimonials(tempList);
    }, [searchTerm, testimonials]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fetch testimonials on component mount
    useEffect(() => {
        fetchAllTestimonials();
    }, []);

    // Function to convert testimonials to CSV format
    function convertToCSV(data) {
        if (data.length === 0) {
            return ""; // Return an empty string if there's no data
        }

        // Get the headers (keys from the first object in the array)
        const headers = Object.keys(data[0]);
        const headerRow = headers.join(",");

        // Convert each row to a CSV string
        const rows = data.map((row) => {
            return headers
                .map((header) => {
                    const value = row[header];
                    // Convert null or undefined values to an empty string
                    return value !== null && value !== undefined ? value.toString() : "";
                })
                .join(",");
        });

        // Combine the header and rows into one CSV string
        return [headerRow, ...rows].join("\n");
    }

    // Function to trigger CSV download
    const downloadCSV = () => {
        if (testimonials.length === 0) {
            alert("No testimonials to download.");
            return;
        }

        const csv = convertToCSV(testimonials);
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", "testimonials.csv");
        document.body.appendChild(a); // Append to body to work in some browsers
        a.click();
        document.body.removeChild(a); // Clean up
    };

    // Function to handle testimonial deletion
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(`https://servertest-isos.onrender.com/api/testimonials/${id}`);
                setTestimonials((prevTestimonials) =>
                    prevTestimonials.filter((testimonial) => testimonial.id !== id)
                );
                message.success("Testimonial deleted successfully.");
            } catch (err) {
                console.error("Error deleting testimonial:", err);
                message.error("Failed to delete testimonial. Please try again later.");
            }
        }
    };

    // Function to handle testimonial approval
    const handleApprove = async (id) => {
        try {
            await axios.put(`https://servertest-isos.onrender.com/api/testimonials/approve/${id}`, {
                status: "approved",
            });
            setTestimonials((prevTestimonials) =>
                prevTestimonials.map((testimonial) =>
                    testimonial.id === id
                        ? {...testimonial, status: "approved"}
                        : testimonial
                )
            );
            message.success("Testimonial approved successfully.");
        } catch (err) {
            console.error("Error approving testimonial:", err);
            message.error("Failed to approve testimonial. Please try again later.");
        }
    };

    // Function to handle modal submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (selectedTestimonial) {
            await handleApprove(selectedTestimonial.id);
            setShowModal(false);
        }
    };

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
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="p-6 h-full bg-white rounded-lg shadow-md overflow-x-auto">
                    <h1 className="text-3xl mb-6">Manage Testimonials</h1>

                    {/* Search Bar */}
                    <div className="flex justify-between mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search Customers"
                            className="mb-6 p-2 border border-gray-300 rounded w-[40%]"
                        />
                        {/* Button to download CSV */}
                        <button
                            onClick={downloadCSV}
                            className="h-[44px] bg-pink-500 text-white px-4 py-2 rounded"
                        >
                            Download CSV
                        </button>
                    </div>

                    <div className="flex justify-between space-x-4">
                        {/* Customer Rating Table */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Customer Rating Table
                            </h2>
                            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-x-auto">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4">Rating Id</th>
                                    <th className="py-2 px-4">Rating</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTestimonials.length > 0 ? (
                                    filteredTestimonials
                                        .filter((t) => t.rating)
                                        .slice(startIndexRating, endIndexRating)
                                        .map((testimonial) => (
                                            <tr key={testimonial.id} className="border-b">
                                                <td className="py-2 px-4 text-gray-700">
                                                    {testimonial.id}
                                                </td>
                                                <td className="py-2 px-4 text-gray-700">
                                                    {testimonial.rating}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-4 text-gray-700" colSpan="2">
                                            No results found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {/* Pagination Controls for Rating Table */}
                            <div className="flex justify-center mt-4 width-full">
                                <button
                                    onClick={handlePreviousPageRating}
                                    disabled={currentPageRating === 1}
                                    className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded mr-2 text-xs sm:text-sm"
                                >
                                    Per
                                </button>
                                <span className="px-4 py-2">
                  {currentPageRating} of {totalPagesRating}
                </span>
                                <button
                                    onClick={handleNextPageRating}
                                    disabled={currentPageRating === totalPagesRating}
                                    className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded ml-2 text-xs sm:text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* Customer Feedback Table */}
                        <div className="overflow-x-auto">
                            <h2 className="text-lg font-bold mb-2">
                                Customer Feedback Table
                            </h2>
                            <table className="table-auto w-full bg-white shadow-md rounded-lg mb-6">
                                <thead>
                                <tr className="bg-gray-200 text-gray-600 border-b border-gray-300">
                                    <th className="py-2 px-4 text-left w-1/12">FeedbackID</th>
                                    <th className="py-2 px-4 text-left w-2/12">
                                        Customer Email
                                    </th>
                                    <th className="py-2 px-4 text-left w-3/12">Title</th>
                                    <th className="py-2 px-4 text-left w-6/12">Message</th>
                                    <th className="py-2 px-4 text-left w-1/12">Status</th>
                                    <th className="py-2 px-4 text-left w-1/12">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTestimonials.length > 0 ? (
                                    filteredTestimonials
                                        .slice(startIndex, endIndex)
                                        .map((testimonial) => (
                                            <tr key={testimonial.id} className="border-b border-gray-300">
                                                <td className="py-2 px-4 text-gray-700">
                                                    {testimonial.id}
                                                </td>
                                                <td className="py-2 px-4 text-gray-700">
                                                    {userData && userData.email ? userData.email : "N/A"}
                                                </td>
                                                <td className="py-2 px-4 text-gray-700 max-w-xs whitespace-normal overflow-hidden">
                                                    {testimonial.title}
                                                </td>
                                                <td className="py-2 px-6 text-gray-700 max-w-md whitespace-normal overflow-hidden">
                                                    <div>
                                                        {expandedRows[testimonial.id]
                                                            ? testimonial.description
                                                            : `${testimonial.description.slice(0, 10)}...`}
                                                        <button
                                                            onClick={() => toggleExpand(testimonial.id)}
                                                            className="text-blue-500 text-[10px] hover:underline ml-2"
                                                        >
                                                            {expandedRows[testimonial.id] ? "See Less" : "See More"}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 text-gray-700">
                                                    {testimonial.status}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                        aria-label="Edit"
                                                        onClick={() => {
                                                            setSelectedTestimonial(testimonial);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <FaEdit/>
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        aria-label="Delete"
                                                        onClick={() => handleDelete(testimonial.id)}
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-4 text-gray-700" colSpan="6">
                                            No results found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded mr-2"
                                >
                                    Per
                                </button>
                                <span className="px-4 py-2">
                  {currentPage} of {totalPages}
                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded ml-2"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for editing testimonial */}
                {showModal && selectedTestimonial && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl mb-4">Approve Testimonial</h2>
                            <form onSubmit={handleUpdate}>
                                <p>Are you sure you want to approve this testimonial?</p>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminTestimonials;
