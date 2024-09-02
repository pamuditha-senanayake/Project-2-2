import React, { useState } from 'react';
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import backgroundImage from "../../images/a.jpg";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rePassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        rePassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const errors = {};
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address';
        }
        if (formData.password.length < 7) {
            errors.password = 'Password must be at least 7 characters long';
        }
        if (formData.password !== formData.rePassword) {
            errors.rePassword = 'Passwords do not match';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Handle form submission, e.g., send data to server
            console.log('Form submitted', formData);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div className="flex flex-col order-2 w-[50%] h-full items-end justify-center pr-5"
                     style={{
                         background: 'rgba(87, 40, 215, 0.2)',
                         borderRadius: '16px',
                         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                         backdropFilter: 'blur(5px)',
                         WebkitBackdropFilter: 'blur(5px)',
                         border: '1px solid rgba(255, 255, 255, 0.3)',
                     }}
                >
                    <p className="text-5xl text-white julius-sans-one-regular text-center">SALON</p>
                    <p className="text-5xl text-white julius-sans-one-regular text-center">DIAMOND</p>
                    <br/>
                    <p className="text-base text-white text-center">BY SAHASRA RAJAPAKSHA</p>
                </div>

                <div className="flex order-1 w-[50%] h-full bg-pink-300 justify-center pl-9 items-center">
                    <div className="p-8 rounded-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-6 text-left julius-sans-one-regular">REGISTER</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="firstName"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="lastName"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="rePassword"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
                                    Re-enter Password
                                </label>
                                <input
                                    type="password"
                                    id="rePassword"
                                    name="rePassword"
                                    value={formData.rePassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Re-enter your password"
                                />
                                {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-neutral-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
