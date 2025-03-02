import React from "react";
import {useNavigate} from "react-router-dom";
import backgroundImage from "../../images/5.jpg";
import google from "../../images/google.png";

const Button = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    };

    return (
        <button
            onClick={handleClick}
            className="flex  items-center justify-center h-10 julius-sans-one-regular w-24 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
        >
            Register
        </button>
    );
};

export {Button};


const Login = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Custom cross button for navigation */}
            <label className="absolute top-4 left-4 inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={() => navigate('/home')}
                />
                <div
                    className="peer ring-0 bg-pink-400 rounded-full outline-none duration-300 after:duration-500 w-12 h-12 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0"
                />
            </label>

            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div
                    className="left-div flex flex-col w-[50%] h-full justify-center pl-9 pamlogin1"
                    style={{
                        background: 'rgba(87, 40, 215, 0.2)',
                        borderRadius: '0',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    <p className="text-5xl text-white julius-sans-one-regular">SALON</p>
                    <p className="text-5xl text-white julius-sans-one-regular">DIAMOND</p>
                    <br/>
                    <p className="text-base text-white">BY SAHASRA RAJAPAKSHA</p>
                    <div className="pt-5 ">
                        <Button/>
                    </div>

                </div>
                <div
                    className="right-div flex flex-col w-[50%] h-full pamlogin1 bg-pink-300 justify-center pl-9 items-center"
                >
                    <div className="p-8 rounded-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-6 text-left julius-sans-one-regular">Login</h2>

                        <form action={`${process.env.REACT_APP_API_URL}/login`} method="POST">
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 julius-sans-one-regular"
                                >
                                    Username
                                </label>
                                <input
                                    type="username"
                                    id="username"
                                    name="username"
                                    className="mt-1 julius-sans-one-regular block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    className="block julius-sans-one-regular text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="mt-1 block w-full px-3 py-2 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="mb-6">
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-blue-500 hover:underline julius-sans-one-regular"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 julius-sans-one-regular bg-neutral-800 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Sign-In
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => window.location.href = 'https://servertest-isos.onrender.com/auth/google'}
                                className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <img
                                    src={google}
                                    alt="Google"
                                    className="w-5 h-5 mr-2"
                                />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button positioned fixed to the bottom of the screen */}

        </div>
    );
};

export default Login;
