import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";


const Layout = () => {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
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
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular flex items-center justify-center"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="text-center text-black">
                    <h1 className="text-3xl font-bold">Welcome to Salon Diamond</h1>
                    <p className="mt-2 text-lg">Your beauty is our priority. Experience the best services tailored just
                        for you.</p>
                </div>
            </div>


        </div>
    );
};

export default Layout;
