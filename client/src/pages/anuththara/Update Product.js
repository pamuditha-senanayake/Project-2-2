import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate, useParams} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import axios from "axios";

const UpdateProduct = () => {
    const {id} = useParams(); // Get the product ID from URL parameters
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Beauty Product');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [imagePreview, setImagePreview] = useState(''); // For displaying the selected image
    const [loading, setLoading] = useState(false);

    // Fetch the existing product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://servertest-isos.onrender.com/api/products/${id}`);
                const product = response.data;
                setTitle(product.title);
                setPrice(product.price);
                setCategory(product.category);
                setDescription(product.description);
                setQuantity(product.quantity);
                setExistingImage(product.image);
                setImagePreview(`https://servertest-isos.onrender.com/uploads/${product.image}`); // Set existing image preview
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    // Handle image file selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Create a preview for the selected image
        }
    };

    // Handle form submission to update the product
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('quantity', quantity);
        if (image) {
            formData.append('image', image); // Add new image if selected
        } else {
            formData.append('existingImage', existingImage); // Keep the existing image
        }

        setLoading(true);

        try {
            await axios.put(`https://servertest-isos.onrender.com/api/products/${id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            alert('Product updated successfully!');
            navigate('/ProductLists');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Check if the user is an admin and redirect if not
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
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 p-6">
                    <h1 className="text-3xl font-bold text-red-800 mb-6">Update Item</h1>
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
                                        alt="Preview"
                                        className="w-32 h-32 mt-4 object-cover border border-gray-300 rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full bg-red-800 text-white p-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;