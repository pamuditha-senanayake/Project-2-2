import React from "react";
import backgroundImage from "../../images/a.jpg"; // Adjust the path if needed
import google from "../../images/google.png"

const Login = () => {
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
                    <p className="text-5xl text-white julius-sans-one-regular">SALON</p>
                    <p className="text-5xl text-white julius-sans-one-regular">DIAMOND</p>
                    <br/>
                    <p className="text-base text-white">BY SAHASRA RAJAPAKSHA</p>
                </div>
                <div className="flex flex-row w-[50%] h-full bg-pink-300 justify-center pl-9 items-center"


                >
                    <div className="p-8 rounded-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-6 text-left julius-sans-one-regular">Login</h2>

                        <form action={`${process.env.REACT_APP_API_URL}/login`} method="POST">
                            <div className="mb-4">
                                <label htmlFor="username"
                                       className="block text-sm font-medium text-gray-700 julius-sans-one-regular">
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
                                <label htmlFor="password"
                                       className="block julius-sans-one-regular text-sm font-medium text-gray-700">
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

                            <button
                                type="submit"
                                className="w-full py-2 px-4 julius-sans-one-regular bg-neutral-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Sign-In
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => window.location.href = 'http://localhost:3001/auth/google'}
                                className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <img
                                    src={google} // Ensure `google` is the path to your Google logo image
                                    alt="Google"
                                    className="w-5 h-5 mr-2"
                                />
                                Sign in with Google
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
