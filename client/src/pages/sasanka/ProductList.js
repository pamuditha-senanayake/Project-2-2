import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, InputNumber, Tooltip } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState(1); // Replace with actual logic to fetch or set user_id

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setVisible(true);
    };

    const handleOk = async () => {
        try {
            // Ensure user_id is correctly defined and available in your component
            const user_id = 1; // Replace with the actual user_id logic

            // Send PUT request to update the cart
            await axios.put(`http://localhost:3001/api/cart/add`, { userId: user_id, itemId: selectedProduct.id, quantity });

            // Close the modal after a successful request
            setVisible(false);
        } catch (error) {
            console.error('Error adding to cart:', error);

            // Optional: Display an error message to the user
            alert('Failed to add item to cart. Please try again.');
        }
    };


    const handleCancel = () => {
        setVisible(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-center mt-4 text-gray-600">Loading...</p>;
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 p-6 md:p-10">
            {/* Search Bar */}
            <div className="flex justify-end mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full md:w-80 p-4 text-gray-800 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    style={{ fontSize: '1rem' }}
                />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:scale-105">
                        <img
                            src={`data:image/jpeg;base64,${product.img}`}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            style={{ borderBottom: '1px solid #e2e8f0' }}
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-pink-600 font-bold mb-3">${product.price}</p>
                            <p className="text-gray-600 mb-2">{product.description?.substring(0, 100)}{product.description?.length > 100 ? '...' : ''}</p>
                            <p className="text-gray-500 mb-3">Rating: {product.rating} / 5</p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <Modal
                    title={<div className="text-xl font-bold text-indigo-700">{selectedProduct.name}</div>}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="cancel"
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                        >
                            Cancel
                        </button>,
                        <button
                            key="submit"
                            onClick={handleOk}
                            className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300"
                        >
                            Add to Cart
                        </button>,
                    ]}
                    style={{ top: 20 }}
                >
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                            <img
                                src={`data:image/jpeg;base64,${selectedProduct.img}`}
                                alt={selectedProduct.name}
                                className="w-32 h-32 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="text-gray-700 mb-2">
                                <strong>Description:</strong> {selectedProduct.description || 'No description available.'}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Price:</strong> ${selectedProduct.price}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <strong>In Stock:</strong> {selectedProduct.stock}
                            </p>
                            <div className="flex items-center mb-4">
                                <label className="mr-4 font-semibold text-gray-800">Quantity:</label>
                                <Tooltip title={`Total: $${(quantity * selectedProduct.price).toFixed(2)}`}>
                                    <InputNumber
                                        min={1}
                                        max={selectedProduct.stock}
                                        value={quantity}
                                        onChange={(value) => setQuantity(value)}
                                        className="w-24"
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductList;
