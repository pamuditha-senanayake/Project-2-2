import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, InputNumber, Tooltip} from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import Navbar from '../pamuditha/nav';
import Banner from "../../images/Banner.jpg"; // Import the banner image
import homepic6 from "../../images/e.jpg";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(''); // New state for category filter
    const [cartCount, setCartCount] = useState(0); // State to track cart item count

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/products');
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
        setQuantity(1); // Reset quantity to 1 when selecting a new product
        setVisible(true);
    };

    const handleOk = async () => {
        try {
            const response = await fetch('https://servertest-isos.onrender.com/api/user/cartadd', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({itemId: selectedProduct.id, quantity}),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Added/Updated item:', data);
                setCartCount(prevCount => prevCount + quantity); // Update cart count
                setVisible(false);
            } else {
                console.error('Failed to add/update item:', data);
                alert('Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const filteredProducts = products
        .filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter ? product.category === categoryFilter : true)
        );

    if (loading) return <p className="text-center mt-4 text-gray-600">Loading...</p>;
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 mt-[100px] px-6 md:p-10">
            <Navbar cartCount={cartCount}/> {/* Pass cartCount to Navbar */}
            {/* Banner */}
            <div className="mb-8">
                <img src={Banner} alt="Banner" className="w-full h-60 object-cover rounded-lg shadow-lg"/>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="w-full md:w-1/3 p-4 mb-4 md:mb-0 text-gray-800 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-1/4 p-4 text-gray-800 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                >
                    <option value="">All Categories</option>
                    <option value="Beauty Product">Beauty Product</option>
                    <option value="Hair Product">Hair Product</option>
                    <option value="Skin Care Product">Skin Care Product</option>
                </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {filteredProducts.map((product) => (
                    <div key={product.id}
                         className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:scale-105">
                        <img
                            src={product.image ? `https://servertest-isos.onrender.com/uploads/${product.image}` : 'default-image-url'}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                        <div className="p-5 flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
                            <p className="text-pink-600 font-bold mb-3">Rs.{product.price}</p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                aria-label={`Add ${product.title} to cart`}
                                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors duration-300 mt-auto"
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
                    title={<div className="text-xl font-bold text-indigo-700">{selectedProduct.title}</div>}
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
                            disabled={quantity > selectedProduct.quantity} // Disable if quantity exceeds stock
                        >
                            Add to Cart
                        </button>,
                    ]}
                    style={{top: 20}}
                >
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                            <img
                                src={selectedProduct.image ? `https://servertest-isos.onrender.com/uploads/${selectedProduct.image}` : 'default-image-url'}
                                alt={selectedProduct.title}
                                className="w-32 h-32 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="text-gray-700 mb-2">
                                <strong>Description:</strong> {selectedProduct.description || 'No description available.'}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Price:</strong> Rs.{selectedProduct.price}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <strong>In Stock:</strong> {selectedProduct.quantity}
                            </p>
                            <div className="flex items-center mb-4">
                                <label className="mr-4 font-semibold text-gray-800">Quantity:</label>
                                <Tooltip title={`Total: Rs.${(quantity * selectedProduct.price).toFixed(2)}`}>
                                    <InputNumber
                                        min={1}
                                        max={selectedProduct.quantity} // Limit max quantity to stock
                                        value={quantity}
                                        onChange={(value) => setQuantity(value)}
                                        className="w-24"
                                        aria-label="Product Quantity"
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
