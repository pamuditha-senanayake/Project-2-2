import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import backgroundImage from "../../images/5.jpg";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Replace with your API call for sending a password reset link
        fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email}),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setMessage("Password reset link has been sent to your email.");
                } else {
                    // setMessage("Failed to send reset link. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setMessage("An error occurred. Please try again.");
            });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
             }}

        >
            <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6 julius-sans-one-regular">Forgot Password</h2>
                {message && <p className="text-center text-green-500 mb-4">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 julius-sans-one-regular"
                        >
                            Enter your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-pink-500 text-white julius-sans-one-regular font-semibold rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-500 hover:underline julius-sans-one-regular"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
