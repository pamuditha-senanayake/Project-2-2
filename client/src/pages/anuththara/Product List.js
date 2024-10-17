import React, { useEffect, useState } from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import { useNavigate } from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import jspdf-autotable for table export

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

    const generatePDF = () => {
        const doc = new jsPDF();

        // PDF title and generation date
        doc.setFontSize(18);
        doc.text("Product Inventory Report", 14, 15);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 20);

        // Calculating statistics
        const totalProducts = filteredProducts.length;
        const outOfStock = filteredProducts.filter(product => product.quantity === 0).length;
        const totalInventoryValue = filteredProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);

        // Adding statistics to the PDF
        doc.text(`Total Products: ${totalProducts}`, 14, 30);
        doc.text(`Out of Stock Products: ${outOfStock}`, 14, 35);
        doc.text(`Total Inventory Value (RS): ${totalInventoryValue.toLocaleString()}`, 14, 40);

        doc.text("Product Details:", 14, 50);

        // Table columns and data
        const tableColumn = ["ID", "Product", "Price (RS)", "Quantity", "In Stock"];
        const tableRows = [];

        filteredProducts.forEach(product => {
            const productData = [
                product.id,
                product.title,
                product.price,
                product.quantity,
                product.quantity > 0 ? 'Yes' : 'No',
            ];
            tableRows.push(productData);
        });

        // Adding the table to the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'grid',
        });

        doc.save("products-inventory-report.pdf");
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
                        <div>
                            <button
                                className="bg-black text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-800 mr-2"
                                onClick={() => navigate('/AddProduct')}
                            >
                                Create
                            </button>
                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700"
                                onClick={generatePDF}
                            >
                                Export PDF
                            </button>
                        </div>
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
                                            <FaEye/>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/update-item/${product.id}`)}
                                            title="Edit"
                                            className="text-black hover:text-gray-700"
                                        >
                                            <FaEdit/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            title="Delete"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 shadow-lg w-3/4">
                                <h3 className="text-lg font-bold mb-4">Product Details</h3>
                                {selectedProduct && (
                                    <>
                                        <p>
                                            <strong>ID:</strong> {selectedProduct.id}
                                        </p>
                                        <p>
                                            <strong>Title:</strong> {selectedProduct.title}
                                        </p>
                                        <p>
                                            <strong>Category:</strong> {selectedProduct.category}
                                        </p>
                                        <p>
                                            <strong>Description:</strong> {selectedProduct.description}
                                        </p>
                                        <p>
                                            <strong>Price (RS):</strong> {selectedProduct.price}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {selectedProduct.quantity}
                                        </p>
                                        <img
                                            src={selectedProduct.image ? `http://localhost:3001/uploads/${selectedProduct.image}` : 'default-image-url'}
                                            alt={selectedProduct.title}
                                            className="w-24 h-24 rounded-full object-cover mt-4"
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;
