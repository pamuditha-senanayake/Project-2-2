import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash'; // Import your Sidebar component
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import {FaEdit, FaEye, FaTrash} from "react-icons/fa";
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
    const [showOutOfStock, setShowOutOfStock] = useState(true); // Toggle state for out-of-stock products
    const navigate = useNavigate();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axios.get('https://servertest-isos.onrender.com/api/products');
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
                await axios.delete(`https://servertest-isos.onrender.com/api/products/${id}`);
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
            const response = await axios.get(`https://servertest-isos.onrender.com/api/products/${id}`);
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

    // Filtering products based on category, search query, and out-of-stock toggle
    const filteredProducts = products
        .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
        .filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(product => showOutOfStock || product.quantity == 0); // New condition to hide/show out-of-stock products

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
                <Sidebar/>
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
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-gray-700">Filter by Category:</label>
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

                        <div className="flex items-center space-x-2">
                            <label className="text-gray-700">Search by Title:</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search products..."
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <label className="text-gray-700">Show Out of Stock:</label>
                            <input
                                type="checkbox"
                                checked={!showOutOfStock}
                                onChange={() => setShowOutOfStock(!showOutOfStock)}
                                className="h-5 w-5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        {currentProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{product.id}</td>
                                <td className="py-3 px-4">
                                    <img
                                        src={product.image ? `https://servertest-isos.onrender.com/uploads/${product.image}` : 'default-image-url'}
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

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Modal for viewing product */}
                {showModal && selectedProduct && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-4">{selectedProduct.title}</h3>
                            <img
                                src={`https://servertest-isos.onrender.com/uploads/${selectedProduct.image}`}
                                alt={selectedProduct.title}
                                className="w-32 h-32 object-cover mb-4"
                            />
                            <p><strong>Price:</strong> RS {selectedProduct.price}</p>
                            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                            <p><strong>Description:</strong> {selectedProduct.description}</p>
                            <button
                                onClick={handleCloseModal}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;
