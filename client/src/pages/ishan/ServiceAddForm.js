import {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import homepic6 from "../../images/e.jpg";
import Swal from "sweetalert2";

const Layout = () => {
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

    const AddServicePage = () => {
        const [formData, setFormData] = useState({
            name: "",
            price: "",
            duration: "",
            description: "",
            category_id: ""
        });

        const [categories, setCategories] = useState([]);
        const [message, setMessage] = useState("");

        //dropdowmn category

        useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get("https://servertest-isos.onrender.com/service/categories");
                    setCategories(response.data);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            };
            fetchCategories();
        }, []);

        const handleChange = (e) => {
            const {id, value} = e.target;
            setFormData({...formData, [id]: value});
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.post("https://servertest-isos.onrender.com/service/services", formData);
                if (response.data && response.data.duration) {
                    // Ensure the response contains the duration
                    setMessage("Service added successfully!");
                    // Show SweetAlert2 success message
                    Swal.fire({
                        title: "Success!",
                        text: "Service added successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Navigate after the user clicks "OK"
                            navigate('/adminservicview');
                        }
                    });
                } else {
                    setMessage("Failed to retrieve the duration. Please check the service details.");
                }
                setFormData({
                    name: "",
                    price: "",
                    duration: "",
                    description: "",
                    category_id: ""
                });
            } catch (error) {
                console.error("Error adding service:", error);
                setMessage("Failed to add service. Please try again.");
            }
        };

        return (
            <div className="flex h-screen">
                <div className="w-[20%] h-full text-white">
                    <Sidebar/>
                </div>

                <div className="w-[80%] h-full bg-pink-500 julius-sans-one-regular">
                    <div className="flex h-screen">
                        <div className="w-full h-full">

                            <div
                                style={{
                                    backgroundImage: `url(${homepic6})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    minHeight: "100vh",
                                    padding: "20px",
                                }}
                            >


                                <h1 className="lg:mx-30 text-6xl font-bold text-black mb-8 julius-sans-one-regular">Add
                                    Service</h1>

                                <div style={{
                                    backgroundImage: `url(${homepic6})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    minHeight: "10vh",
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                >
                                    <div
                                        style={{
                                            background: "rgba(255, 255, 255, 0.6)",
                                            borderRadius: "10px",
                                            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
                                            backdropFilter: "blur(7.2px)",
                                            WebkitBackdropFilter: "blur(7.2px)",
                                            border: "1px solid rgba(255, 255, 255, 0.99)",
                                            width: "550px",
                                            padding: "20px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        {message && <p className="mb-4 text-center text-white">{message}</p>}

                                        <form className="w-full" onSubmit={handleSubmit}>
                                            <div className="mb-6">
                                                <label htmlFor="name"
                                                       className="block mb-2 text-2xl font-bold start-px text-gray-900">
                                                    Service Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                    placeholder="Service Name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <label htmlFor="category_id"
                                                       className="block mb-2 text-2xl font-bold text-gray-900">
                                                    Category
                                                </label>
                                                <select
                                                    id="category_id"
                                                    className="shadow-sm bg-gray-70 border-gray-300 text-gray-900 text-sm rounded-lg h-10 block w-full p-2.5"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="" disabled>
                                                        Select category
                                                    </option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label htmlFor="price"
                                                       className="block mb-2 text-2xl font-bold text-gray-900">
                                                    Price
                                                </label>
                                                <div className="flex">
                                                <span
                                                    className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                                    Rs.
                                                </span>
                                                    <input
                                                        type="number"
                                                        id="price"
                                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg block w-full p-2.5 no-spinner"
                                                        placeholder="Price"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        required
                                                        // Disable the spinner arrows
                                                        onWheel={(e) => e.target.blur()} // Prevent scrolling input
                                                        inputMode="numeric"
                                                    />

                                                    <style jsx>{`
                                                        /* Disable arrows in Firefox */
                                                        input[type='number'] {
                                                            -moz-appearance: textfield;
                                                        }

                                                        /* Disable arrows in Chrome, Safari, Edge, Opera */
                                                        input[type='number']::-webkit-outer-spin-button,
                                                        input[type='number']::-webkit-inner-spin-button {
                                                            -webkit-appearance: none;
                                                            margin: 0;
                                                        }
                                                    `}</style>

                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label htmlFor="duration"
                                                       className="block mb-2 text-2xl font-bold text-gray-900">
                                                    Time Taken
                                                </label>
                                                <select
                                                    id="duration"
                                                    className="shadow-sm bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                    value={formData.duration}
                                                    onChange={handleChange} // Directly using handleChange without modification
                                                    required
                                                >
                                                    <option value="" disabled>Select time taken</option>
                                                    <option value={15 * 60}>15 minutes</option>
                                                    <option value={30 * 60}>30 minutes</option>
                                                    <option value={45 * 60}>45 minutes</option>
                                                    <option value={60 * 60}>1 hour</option>
                                                    <option value={120 * 60}>2 hours</option>
                                                    <option value={180 * 60}>3 hours</option>
                                                    <option value={240 * 60}>4 hours</option>
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label htmlFor="description"
                                                       className="block mb-2 text-2xl font-bold text-gray-900">
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                    placeholder="Service Description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="text-white bg-black hover:bg-pink-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center icon-button transition duration-300 ease-in-out transform hover:scale-110"
                                            >
                                                Add Service
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <AddServicePage/>;
};

export default Layout;
