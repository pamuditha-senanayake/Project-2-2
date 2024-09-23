import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../com/admindash'; // Sidebar component import
import homepic7 from "../../images/f.jpg"; // Image import
import axios from "axios";

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        getAllProducts();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products
        .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
        .filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat'
                 }}>
                <Sidebar />
            </div>

            <div className="w-[80%] h-full bg-gray-100 p-4">
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Our Products</h2>
                    </div>

                    <div className="flex mb-4 space-x-4">
                        {/* Category Filter */}
                        <div>
                            <label className="mr-2 text-gray-700">Filter by Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="All">All</option>
                                <option value="Beauty Product">Beauty Product</option>
                                <option value="Hair Product">Hair Product</option>
                                <option value="Skin Care Product">Skin Care Product</option>
                            </select>
                        </div>

                        {/* Search Filter */}
                        <div>
                            <label className="mr-2 text-gray-700">Search by Title:</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="block transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <img
                                        src={product.image ? `http://localhost:3001/uploads/${product.image}` : 'default-image-url'}
                                        alt={product.title}
                                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                                    />
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                                        <p className="text-gray-800 font-bold mb-4">RS {product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;
