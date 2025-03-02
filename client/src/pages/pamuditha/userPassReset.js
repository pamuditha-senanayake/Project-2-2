import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert
import Navigation from './nav';
import homepic4 from "../../images/f.jpg"; // Adjust the path if necessary

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        // Validation for minimum length
        if (newPassword.length < 7) {
            setMessage('Password must be at least 7 characters long');
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`https://servertest-isos.onrender.com/resetu`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({password: newPassword}),
            });

            if (response.ok) {
                setMessage('Password updated successfully');

                // SweetAlert success and redirect after "OK"
                Swal.fire({
                    title: "Good job!",
                    text: "Password updated successfully!",
                    icon: "success",
                }).then(() => {
                    // Redirect to /home after OK button is clicked
                    navigate('/home');
                });

                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage('Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('An error occurred');
        }
    };


    return (
        <div className="flex flex-col h-screen w-full julius-sans-one-regular"
             style={{
                 backgroundImage: `url(${homepic4})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}
        >
            <Navigation/>
            <div className="flex items-center justify-center w-full h-screen mt-[20px]">
                <div className="flex flex-col w-[35%] h-[50%] border-2 rounded-2xl py-3 px-3 bg-white">
                    <h2 className="text-3xl mb-4">Reset Password</h2>
                    <form onSubmit={handlePasswordReset}>
                        <label htmlFor="newPassword" className="block mb-2">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none"
                            required
                        />

                        <label htmlFor="confirmPassword" className="block mb-2 mt-4">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmChange}
                            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none"
                            required
                        />

                        <button
                            type="submit"
                            className="text-black w-full bg-pink-300 hover:bg-pink-500 py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out mt-4"
                        >
                            Reset Password
                        </button>
                    </form>
                    {message && <p className="mt-4 text-red-500">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
