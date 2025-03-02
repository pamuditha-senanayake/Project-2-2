import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
    const {id} = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`https://servertest-isos.onrender.com/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        getProduct();
    }, [id]);

    const handleAddToCart = () => {
        alert(`${product.title} added to cart!`);
    };

    const handleBuyNow = () => {
        alert(`Redirecting to buy ${product.title}!`);
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="container mx-auto my-12 px-4">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-6">
                {/* Left: Product Image */}
                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                    <img
                        src={product.image ? `https://servertest-isos.onrender.com/uploads/${product.image}` : 'default-image-url'}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Right: Product Details */}
                <div className="w-full md:w-1/2 md:pl-6 flex flex-col justify-center">
                    {/* Title and Price */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                        <p className="text-gray-800 text-2xl font-semibold mb-2">RS {product.price}</p>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleAddToCart}
                            className="bg-pink-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-pink-600 transition duration-300"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
