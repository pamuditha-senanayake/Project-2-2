import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import homepic7 from "../../images/f.jpg";

const StatsPage = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        outOfStock: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching product stats', error);
            }
        };

        fetchStats();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Store Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-2">Total Products</h2>
                    <p className="text-4xl font-bold">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-2">Total Store Value</h2>
                    <p className="text-4xl font-bold">RS/{stats.totalValue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-2">Out of Stock</h2>
                    <p className="text-4xl font-bold">{stats.outOfStock}</p>
                </div>
            </div>
            <button
                onClick={() => navigate('/ProductList')}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
                Go to Product List
            </button>
        </div>
    );
};

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/admin', {
                    credentials: 'include', // Include credentials with the request
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
                <Sidebar />
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                {/* You can place other content or components here */}
                <StatsPage />
            </div>
        </div>
    );
};

export default Layout;
