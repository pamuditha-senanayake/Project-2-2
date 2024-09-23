import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import { useNavigate } from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:3001/api/products/${id}`);
                setProducts(products.filter((product) => product.id !== id));
                alert('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleViewProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/products/${id}`);
            setSelectedProduct(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
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
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">All Products</h2>
                        <button
                            className="bg-black text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-800"
                            onClick={() => navigate('/AddProduct')}
                        >
                            Create
                        </button>
                    </div>
                    <div className="flex mb-4 space-x-4">
                        <div>
                            <label className="mr-2 text-gray-700">Filter by Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All</option>
                                <option value="Beauty Product">Beauty Product</option>
                                <option value="Hair Product">Hair Product</option>
                                <option value="Skin Care Product">Skin Care Product</option>
                            </select>
                        </div>
                        <div>
                            <label className="mr-2 text-gray-700">Search by Title:</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b">ID</th>
                            <th className="py-3 px-4 border-b">Image</th>
                            <th className="py-3 px-4 border-b">Product</th>
                            <th className="py-3 px-4 border-b">Price (RS)</th>
                            <th className="py-3 px-4 border-b">Quantity</th>
                            <th className="py-3 px-4 border-b">In Stock</th>
                            <th className="py-3 px-4 border-b">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{product.id}</td>
                                <td className="py-3 px-4">
                                    <img
                                        src={product.image ? `http://localhost:3001/uploads/${product.image}` : 'default-image-url'}
                                        alt={product.title}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </td>
                                <td className="py-3 px-4">{product.title}</td>
                                <td className="py-3 px-4">{product.price}</td>
                                <td className="py-3 px-4">{product.quantity}</td>
                                <td className="py-3 px-4">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${product.quantity > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {product.quantity > 0 ? 'Yes' : 'No'}
                                        </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewProduct(product.id)}
                                            title="View"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/update-item/${product.id}`)}
                                            title="Edit"
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            title="Delete"
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4 text-gray-600">
                        <span>Rows per page: 100</span>
                        <span>1-{filteredProducts.length} of {filteredProducts.length}</span>
                    </div>

                    {/* Enhanced Modal for product details */}
                    {showModal && selectedProduct && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Product Details</h3>
                                <div className="flex mb-4">
                                    <img
                                        src={selectedProduct.image ? `http://localhost:3001/uploads/${selectedProduct.image}` : 'default-image-url'}
                                        alt={selectedProduct.title}
                                        className="w-40 h-40 rounded-lg object-cover shadow-md mr-4"
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{selectedProduct.title}</h4>
                                        <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
                                        <p className="text-gray-600 font-semibold">Price: RS {selectedProduct.price}</p>
                                        <p className="text-gray-600 font-semibold">Quantity: {selectedProduct.quantity}</p>
                                        <p className="text-gray-600 font-semibold">Category: {selectedProduct.category}</p>
                                        <p className={`font-semibold ${selectedProduct.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;
