import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import homepic7 from "../../images/f.jpg";
import axios from "axios";
import {AiOutlineUnorderedList, AiOutlineMoneyCollect, AiOutlineStock, AiOutlineBell} from 'react-icons/ai';
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList} from 'recharts'; // Updated Recharts import

const AllProductsPage = () => {
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalStoreValue, setTotalStoreValue] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [showAlerts, setShowAlerts] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/api/products');
                const fetchedProducts = response.data;

                setProducts(fetchedProducts);
                setTotalProducts(fetchedProducts.length);
                setTotalStoreValue(fetchedProducts.reduce((total, product) => total + (product.price * product.quantity), 0));
                setOutOfStock(fetchedProducts.filter(product => product.quantity === 0).length);

                const lowStock = fetchedProducts.filter(product => product.quantity <= 5);
                setLowStockProducts(lowStock);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading...</div>;
    }

    // Prepare data for the bar chart (Top 5 highest value products)
    const chartData = products
        .map(product => ({
            name: product.title,
            totalValue: product.price * product.quantity,
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5); // Get top 5 products by total value

    return (
        <div className="flex h-screen bg-gray-50" style={{fontFamily: 'Poppins, sans-serif'}}>
            <div className="w-[20%] h-full bg-cover bg-center" style={{backgroundImage: `url(${homepic7})`}}>
                <Sidebar/>
            </div>
            <div className="w-[80%] p-8 overflow-y-auto relative">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center font-serif">Inventory Overview</h2>

                {/* Alert Icon Button */}
                <div className="absolute top-6 right-10">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
                    >
                        <AiOutlineBell className="text-2xl text-gray-700"/>
                        {lowStockProducts.length > 0 && (
                            <span
                                className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                        )}
                    </button>

                    {/* Dropdown for Alerts */}
                    {showAlerts && lowStockProducts.length > 0 && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                            <p className="font-bold text-yellow-700 mb-2">Low Stock Alerts</p>
                            {lowStockProducts.map((product) => (
                                <div key={product.id}
                                     className="mb-2 p-2 bg-yellow-100 rounded-lg border border-yellow-300">
                                    <p className="text-gray-800">{product.title}</p>
                                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                        <AiOutlineUnorderedList className="text-6xl text-blue-600 mb-4"/>
                        <h3 className="font-semibold text-xl text-gray-700">Total Products</h3>
                        <p className="text-3xl text-gray-800">{totalProducts}</p>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                        <AiOutlineMoneyCollect className="text-6xl text-green-600 mb-4"/>
                        <h3 className="font-semibold text-xl text-gray-700">Total Store Value</h3>
                        <p className="text-3xl text-gray-800">RS {totalStoreValue.toFixed(2)}</p>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                        <AiOutlineStock className="text-6xl text-red-600 mb-4"/>
                        <h3 className="font-semibold text-xl text-gray-700">Out of Stock</h3>
                        <p className="text-3xl text-gray-800">{outOfStock}</p>
                    </div>
                </div>

                {/* Bar Chart for Top 5 Products by Total Value */}
                <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4 text-center">Top 5 Products by Total Value</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="name"
                                interval={0}
                                angle={-60}  // Adjusted tilt angle for better visibility
                                textAnchor="end"
                                dx={-10}  // Adjusted horizontal position
                                dy={10}   // Adjusted vertical position
                            />
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="totalValue" fill="#8884d8">
                                <LabelList dataKey="totalValue" position="top"/>
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;
