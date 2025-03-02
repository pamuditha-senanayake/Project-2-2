import React, {useState} from 'react';
import backgroundImage from "../../images/5.jpg";
import {useNavigate} from 'react-router-dom';
import google from "../../images/google.png";

const Button = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <button
            onClick={handleClick}
            className="flex  items-center justify-center h-10 julius-sans-one-regular w-24 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
        >
            Log-In
        </button>
    );
};

export {Button};

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rePassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        rePassword: '',
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        role: "admin",
                    }),
                    redirect: 'manual' // Handle redirects manually
                });

                if (response.redirected) {
                    // If redirected, manually handle the redirect
                    window.location.href = response.url;
                } else {
                    const data = await response.json();

                    if (response.ok) {
                        console.log('Registration successful', data);
                        navigate('/'); // Redirect to the home page
                    } else {
                        console.error('Registration error', data);
                        alert('Registration failed: ' + (data.message || 'Unknown error'));
                    }
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred during registration.');
            }
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
            <label className="absolute top-4 left-4 inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={() => navigate('/adminhome')}
                />
                <div
                    className="peer ring-0 bg-pink-400 rounded-full outline-none duration-300 after:duration-500 w-12 h-12 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0">
                </div>
            </label>
            <div className="flex flex-row w-[70%] h-[650px] bg-opacity-70">
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
                    <div className="pt-5 ">
                        <Button/>
                    </div>
                </div>

                <div className="flex order-1 w-[50%] h-full bg-pink-300 justify-center items-center">
                    <div className="p-8 rounded-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-6 text-left julius-sans-one-regular">ADMIN
                            REGISTRATION</h2>

                        <form onSubmit={handleSubmit}>
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
                                className="w-full py-2 px-4 bg-neutral-800 julius-sans-one-regular text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Register
                            </button>
                        </form>
                        {/*<div className="mt-6 flex items-center justify-center">*/}
                        {/*    <button*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => window.location.href = 'https://servertest-isos.onrender.com/auth/google'}*/}
                        {/*        className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            src={google}*/}
                        {/*            alt="Google"*/}
                        {/*            className="w-5 h-5 mr-2"*/}
                        {/*        />*/}
                        {/*        Sign up with Google*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
