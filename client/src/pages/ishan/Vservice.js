import React from 'react';
import vs from "../../images/vservice.jpg";
import Sidebar from "../com/admindash";
import {useNavigate} from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/su');
    };

    return (
        <div className="flex h-screen">
            <div className="w-[15%] h-full bg-gray-800 text-white">
                <Sidebar/>
            </div>
            <div className="w-[85%] h-full">
                <div
                    style={{
                        backgroundImage: `url(${vs})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh",
                        padding: "20px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.27)',
                            borderRadius: '40px',
                            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(12.2px)',
                            WebkitBackdropFilter: 'blur(12.2px)',
                            border: '1px solid rgba(255, 255, 255, 0.99)',
                            width: '550px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <h1 className="text-7xl text-white font-bold mb-8">
                            Women's Haircuts
                        </h1>

                        {/* View-Only Form */}
                        <div className="w-full" style={{paddingBottom: '60px'}}>
                            <div className="mb-5">
                                <label
                                    htmlFor="id"
                                    className="block mb-2 font-bold text-3xl dark:text-black">
                                    Service ID:
                                </label>
                                <p className="text-gray-2 text-2xl font-serif dark:text-white">DS-2378</p>
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 font-bold text-gray-900 text-3xl dark:text-black">
                                    Service Name:
                                </label>
                                <p className="text-gray-900 text-2xl font-serif dark:text-white">Service Name</p>
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="price"
                                    className="block mb-2 font-bold text-gray-900 text-3xl dark:text-black">
                                    Price:
                                </label>
                                <p className="text-gray-900 text-2xl font-serif dark:text-white">$100</p>
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="time-taken"
                                    className="block mb-2 font-bold text-gray-900 text-3xl dark:text-black">
                                    Time Taken:
                                </label>
                                <p className="text-gray-900 text-2xl font-serif dark:text-white">1
                                    hour</p> {}
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="message"
                                    className="block mb-2 font-bold text-gray-900 text-3xl dark:text-black">
                                    Description:
                                </label>
                                <p className="text-gray-900 text-2xl font-serif dark:text-white">This service is...</p>
                            </div>
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                display: 'flex',
                                gap: '10px',
                            }}
                        >
                            <button
                                style={{
                                    color: 'white',
                                    backgroundColor: '#007bff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                title="Edit"
                                onClick={handleEditClick}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                            >
                                Edit
                            </button>
                            <button
                                style={{
                                    color: 'white',
                                    backgroundColor: '#dc3545',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                title="Delete"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
