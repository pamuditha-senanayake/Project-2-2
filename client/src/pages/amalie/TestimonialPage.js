import React, {useState, useEffect} from "react";
import Cookies from "js-cookie";
import logo2 from "../../images/logow.png";
import homepic5 from "../../images/e.jpg";
import {useLogout} from "../pamuditha/authUtils";
import {Link} from "react-router-dom";
import {
    useNavigate
} from "react-router-dom";
import TestimonialCard from "./TestimonialCard";
import axios from "axios";
import {Flex, Rate} from "antd";
import {message} from "antd";
import Navbar from '../pamuditha/nav';


const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];


function TestimonialPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState();
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [userData, setUserData] = useState(null);
    const [titleError, setTitleError] = useState("");
    const [newTestimonial, setNewTestimonial] = useState({
        title: "",
        description: "",
        rating: 0,
    });

    // Fetch all testimonials function
    const fetchAllTestimonials = async () => {
        try {
            const response = await axios.get(
                "https://servertest-isos.onrender.com/api/testimonials/approved"
            );
            console.log(response.data);
            setTestimonials(response.data);
        } catch (err) {
            console.error("Error fetching testimonials:", err);
        }
    };

    useEffect(() => {
        fetchAllTestimonials();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `https://servertest-isos.onrender.com/api/testimonials/${id}`
            );
            setTestimonials(
                testimonials.filter((t) => t.id !== id)
            );
            message.success("Testimonial deleted successfully");
        } catch (err) {
            console.error("Error deleting testimonial:", err);
            message.error("Error deleting testimonial");
        }
    };

    const handleUpdate = async (id, updatedTestimonial) => {
        try {
            await axios.put(
                `https://servertest-isos.onrender.com/api/testimonials/${id}`,
                updatedTestimonial
            );
            fetchAllTestimonials(); // Refresh the list to show updated data
            message.success("Testimonial updated successfully");
        } catch (err) {
            console.error("Error updating testimonial:", err);
            message.error("Error updating testimonial");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate title
        if (!newTestimonial.title) {
            setTitleError("Title cannot be empty");
            return; // Prevent form submission
        } else {
            setTitleError(""); // Clear the error if title is valid
        }

        const newTestimonialData = {
            title: newTestimonial.title,
            description: newTestimonial.description,
            rating: value,
            user_id: userData?.id, // Use userData.id if userData is not null
        };

        try {
            await axios.post(
                "https://servertest-isos.onrender.com/api/testimonials",
                newTestimonialData
            );
            setNewTestimonial({
                title: "",
                description: "",
            });
            setValue(0); // Reset the rating
            toggleModal(); // Close the modal after submission
            fetchAllTestimonials(); // Refresh the list to show the newly added testimonial
            message.success("Testimonial submitted successfully");
        } catch (err) {
            console.error("Error submitting testimonial:", err);
            message.error("Error submitting testimonial");
        }
    };

    // Toggle modal visibility
    const toggleModal = () => {
        if (userData) {
            setIsModalOpen((prev) => !prev); // Toggle modal state
        } else {
            message.error("Please login to submit a testimonial");
        }
    };

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

    return (
        <div>
            <div
                className="homepage1 felx flex-col"
                style={{
                    backgroundColor: "#E8ECEF",
                    height: "100vh",
                }}
            >
                <div className="flex">
                    <Navbar/>
                </div>
                <div
                    className=" h-[] flex flex-col space-x-5 bg-pink-500 h-100"
                    id="testimonials"
                    style={{
                        backgroundImage: `url(${homepic5})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        paddingTop: "100px",
                    }}
                >
                    <div>
                        {/* Modal toggle button */}
                        <div className="flex flex-row justify-end items-end -mt-9 -mb-6">
                            <button
                                onClick={
                                    toggleModal
                                }
                                className="bg-black/30 backdrop-blur-md text-white font-semibold py-2 px-6 rounded-lg shadow-lg border border-black/20 hover:bg-black/40 transition duration-300 mb-4 mt-5 mr-xl-5"
                                type="button"
                            >
                                ADD NEW
                            </button>
                        </div>
                        {/* Modal component */}
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-blur-sm" // Applied backdrop-blur-sm for background blur effect
                                onClick={
                                    toggleModal
                                }
                            >
                                <div
                                    className="relative p-4 w-full max-w-2xl max-h-full rounded-lg shadow-lg"
                                    style={{
                                        backgroundColor:
                                            "#e3cdd8",
                                        opacity: 0.8,
                                    }} // Custom pink color with opacity
                                    onClick={(
                                        e
                                    ) =>
                                        e.stopPropagation()
                                    } // Prevent closing when clicking inside the modal
                                >
                                    {/* Modal header */}
                                    <div className="flex items-center justify-between p-4 border-b rounded-t">
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-xl font-semibold text-gray-900 ml-24 mb-4 -mt-6 font-extrabold: 800">
                                                Rate
                                                Our
                                                Beauty
                                                Salon{" "}
                                            </h3>
                                            <h className="ml-20">
                                                We
                                                highly
                                                value
                                                your
                                                option.
                                                Feel
                                                free
                                                to
                                                share
                                                your
                                                experience.
                                            </h>
                                        </div>
                                        <button
                                            onClick={
                                                toggleModal
                                            }
                                            className="text-black-400 hover:bg-gray-200 rounded-lg p-1"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal body */}
                                    <div className="p-4">
                                        <form className="p-4 md:p-5">
                                            <div className="grid gap-4 mb-4 grid-cols-2">
                                                <div className="col-span-2 w-1/3">
                                                    <label
                                                        htmlFor="rating"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Rate
                                                        Your
                                                        Choice
                                                    </label>
                                                    <Flex
                                                        gap="middle"
                                                        vertical
                                                    >
                                                        <Rate
                                                            tooltips={
                                                                desc
                                                            }
                                                            onChange={
                                                                setValue
                                                            }
                                                            value={
                                                                value
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "white",
                                                                padding: "5px",
                                                                borderRadius:
                                                                    "5px",
                                                            }} // Set background to white
                                                            className="custom-rate"
                                                        />
                                                        {value ? (
                                                            <span>
                                                                                                                                {
                                                                                                                                    desc[
                                                                                                                                    value -
                                                                                                                                    1
                                                                                                                                        ]
                                                                                                                                }
                                                                                                                        </span>
                                                        ) : null}
                                                    </Flex>
                                                </div>
                                                <div className="col-span-2">
                                                    <label
                                                        htmlFor="name"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                        placeholder="Type feedback title"
                                                        value={
                                                            newTestimonial.title
                                                        }
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            setNewTestimonial(
                                                                {
                                                                    ...newTestimonial,
                                                                    title: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            );
                                                            if (
                                                                e
                                                                    .target
                                                                    .value
                                                            ) {
                                                                setTitleError(
                                                                    ""
                                                                ); // Clear error if title is not empty
                                                            }
                                                        }}
                                                        required
                                                    />
                                                    {titleError && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {
                                                                titleError
                                                            }
                                                        </p> // Display error message
                                                    )}
                                                </div>
                                                <div className="col-span-2">
                                                    <label
                                                        htmlFor="feedback"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Your
                                                        Feedback
                                                    </label>
                                                    <textarea
                                                        value={
                                                            newTestimonial.description
                                                        }
                                                        id="feedback"
                                                        rows="4"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Write your feedback here"
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setNewTestimonial(
                                                                {
                                                                    ...newTestimonial,
                                                                    description:
                                                                    e
                                                                        .target
                                                                        .value,
                                                                }
                                                            )
                                                        }
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/* Modal footer */}
                                    <div className="flex items-center justify-end p-4 border-t">
                                        <button
                                            onClick={
                                                toggleModal
                                            }
                                            className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={
                                                handleSubmit
                                            }
                                            className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-lg ml-3"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                            {testimonials.map(
                                (
                                    testimonial
                                ) => (
                                    <TestimonialCard
                                        key={
                                            testimonial.id
                                        } // Ensure `testimonial.id` is unique and stable
                                        testimonial={
                                            testimonial
                                        }
                                        userData={
                                            userData
                                        }
                                        onUpdate={
                                            handleUpdate
                                        }
                                        onDelete={
                                            handleDelete
                                        }
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestimonialPage;
