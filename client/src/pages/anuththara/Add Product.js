import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import axios from "axios";

const AddItem = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Beauty Product');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('quantity', quantity);
        if (image) formData.append('image', image);

        setLoading(true);

        try {
            await axios.post('https://servertest-isos.onrender.com/api/products', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            alert('Product added successfully!');

            // Reset form fields
            setTitle('');
            setPrice('');
            setCategory('Beauty Product');
            setDescription('');
            setQuantity('');
            setImage(null);
            setImagePreview(null);

            navigate('/ProductLists');

        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>

            {/* Main Content */}
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 p-6">
                    <h1 className="text-3xl font-bold text-red-800 mb-6">Add Product +</h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Section */}
                        <div className="space-y-6">
                            {/* Title Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Price Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Price *</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="Beauty Product">Beauty Product</option>
                                    <option value="Hair Product">Hair Product</option>
                                    <option value="Skin Care Product">Skin Care Product</option>
                                </select>
                            </div>

                            {/* Quantity Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Quantity *</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>


                        {/* Right Section */}
                        <div className="space-y-6">
                            {/* Description Input */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Description *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="5"
                                />
                            </div>

                            {/* Image File Upload */}
                            <div>
                                <label className="block text-gray-700 font-semibold">Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Image preview"
                                        className="w-32 h-32 object-cover mt-4 border border-gray-300 rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full bg-red-800 text-white p-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;