import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from the backend
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                console.log('Fetched products:', response.data); // Check if data is coming
                setProducts(response.data);
                setLoading(false); // Stop the loading state once data is fetched
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        getAllProducts();
    }, []);

    // Delete product function
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Products</h2>
                <button className="bg-black text-white py-2 px-4 rounded">Create</button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Image</th>
                    <th className="py-2 px-4 border">Product</th>
                    <th className="py-2 px-4 border">Price ($)</th>
                    <th className="py-2 px-4 border">In Stock</th>
                    <th className="py-2 px-4 border">Edit</th>
                    <th className="py-2 px-4 border">Delete</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="border-b">
                        <td className="py-2 px-4 border">{product.id}</td>
                        <td className="py-2 px-4 border">
                            <img
                                src={product.image ? `http://localhost:3001/uploads/${product.image}` : 'default-image-url'}
                                alt={product.title}
                                className="w-12 h-12 rounded-full"
                            />
                        </td>
                        <td className="py-2 px-4 border">{product.title}</td>
                        <td className="py-2 px-4 border">{product.price}</td>
                        <td className="py-2 px-4 border">{product.quantity > 0 ? 'true' : 'false'}</td>
                        <td className="py-2 px-4 border">
                            <button
                                className="bg-gray-600 text-white px-4 py-1 rounded"
                                onClick={() => alert(`Edit product ${product.id}`)}
                            >
                                Edit
                            </button>
                        </td>
                        <td className="py-2 px-4 border">
                            <button
                                className="bg-red-600 text-white px-4 py-1 rounded"
                                onClick={() => handleDelete(product.id)}
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <span>Rows per page: 100</span>
                <span>1-{products.length} of {products.length}</span>
            </div>
        </div>
    );
};

export default AllProductsPage;
