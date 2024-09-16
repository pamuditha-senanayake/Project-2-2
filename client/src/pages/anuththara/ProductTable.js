import React, { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Beauty Product');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle form submission to add a product
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent form submission while loading
        if (loading) return;

        // Create a FormData object to handle file upload and other form data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('quantity', quantity);
        if (image) formData.append('image', image);  // Add image if selected

        setLoading(true); // Start loading state during form submission

        try {
            // POST request to backend to add the new product
            await axios.post('http://localhost:3001/api/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Alert on success
            alert('Product added successfully!');

            // Reset form fields after submission
            setTitle('');
            setPrice('');
            setCategory('Beauty Product');
            setDescription('');
            setQuantity('');
            setImage(null);
        } catch (error) {
            // Display error if product addition fails
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 p-4">
            <h1 className="text-3xl font-bold text-red-800 mb-4">Add Item +</h1>
            <form onSubmit={handleSubmit}>

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>

                {/* Price Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Price *</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700">Category *</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg"
                    >
                        <option value="Beauty Product">Beauty Product</option>
                        <option value="Hair Product">Hair Product</option>
                        <option value="Skin Care Product">Skin Care Product</option>
                    </select>
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Quantity *</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>

                {/* Image File Upload */}
                <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full mt-2 p-2 border rounded-lg"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-red-800 text-white p-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default AddItem;
