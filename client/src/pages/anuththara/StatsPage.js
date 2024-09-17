import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                // Fetch stats from the backend server running on port 3001
                const response = await axios.get('http://localhost:3001/api/products/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching product stats', error);
            }
        };

        fetchStats();
    }, []);

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
                onClick={() => navigate('/products')}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
                Go to Product List
            </button>
        </div>
    );
};

export default StatsPage;
