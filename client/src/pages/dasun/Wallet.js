import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateCard from './UpdateCard';
import DeleteCard from './DeleteCard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useParams } from "react-router-dom";

const Wallet = () => {
    // State to store all cards fetched from the server
    const [cards, setCards] = useState([]);
    // State to store cards filtered based on search term
    const [filteredCards, setFilteredCards] = useState([]);
    // State to store the currently selected card for update or delete operations
    const [selectedCard, setSelectedCard] = useState(null);
    // State to control the visibility of the UpdateCard modal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    // State to control the visibility of the DeleteCard modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // State to store the current search term entered by the user
    const [searchTerm, setSearchTerm] = useState('');
    // State to indicate successful payment processing
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    // Hook to navigate programmatically
    const navigate = useNavigate();
    // Hook to access URL parameters, specifically userId
    const { userId } = useParams();

    /**
     * Groups the cards by their type (e.g., Visa, MasterCard).
     * @param {Array} cards - Array of card objects.
     * @returns {Object} - An object where keys are card types and values are arrays of cards.
     */
    const groupCardsByType = (cards) => {
        return cards.reduce((acc, card) => {
            if (!acc[card.cardType]) {
                acc[card.cardType] = [];
            }
            acc[card.cardType].push(card);
            return acc;
        }, {});
    };

    /**
     * Fetches all cards associated with the user from the server.
     * Maps the response data to use camelCase field names.
     */
    const fetchCards = async () => {
        try {
            // Make a GET request to fetch cards for user with ID 100 (Note: This is hardcoded)
            const response = await fetch(`http://localhost:3001/api/user/get/100`, {
                method: 'GET',
                credentials: 'include', // Include credentials (e.g., cookies) for authentication
            });

            // Check for unauthorized access (HTTP status 401 or 403)
            if (response.status === 403 || response.status === 401) {
                console.error('Unauthorized access. Redirecting...'); // Log the unauthorized access attempt
                navigate('/'); // Redirect the user to the home page or login page
                return;
            }

            // Parse the JSON response
            const data = await response.json();
            // Map the response data to camelCase field names for consistency
            const mappedData = data.map(card => ({
                id: card.id,
                cardType: card.cardtype, // Convert 'cardtype' to 'cardType'
                cardHolderName: card.cardholdername, // Convert 'cardholdername' to 'cardHolderName'
                cardNo: card.cardno, // Convert 'cardno' to 'cardNo'
                expiryDate: card.expirydate, // Convert 'expirydate' to 'expiryDate'
                cvcNo: card.cvcno, // Convert 'cvcno' to 'cvcNo' (if needed in the future)
            }));

            setCards(mappedData); // Update the 'cards' state with the fetched data
            setFilteredCards(mappedData); // Initialize 'filteredCards' with all cards
        } catch (error) {
            console.error('Error fetching cards:', error); // Log any errors that occur during the fetch
        }
    };

    /**
     * Fetches a specific card by its ID for the purpose of updating.
     * @param {number|string} cardId - The ID of the card to fetch.
     */
    const fetchCardById = async (cardId) => {
        try {
            // Make a GET request to fetch a specific card using userId and cardId
            const response = await fetch(`http://localhost:3001/api/user/gett/${cardId}`, {
                method: 'GET',
                credentials: 'include', // Include credentials for authentication
            });

            // Check for unauthorized access
            if (response.status === 403 || response.status === 401) {
                console.error('Unauthorized access. Redirecting...'); // Log unauthorized access
                navigate('/'); // Redirect if not authorized
                return;
            }

            // Parse the JSON response
            const card = await response.json();

            // If the response contains an error, log it and exit
            if (card.error) {
                console.error(card.error);
                return;
            }

            // Update the 'selectedCard' state with the fetched card details
            setSelectedCard({
                id: card.id,
                cardType: card.cardtype,
                cardHolderName: card.cardholdername,
                cardNo: card.cardno,
                expiryDate: card.expirydate,
            });
            // Open the UpdateCard modal
            setIsUpdateModalOpen(true);
        } catch (error) {
            console.error('Error fetching card:', error); // Log any other errors
        }
    };

    // useEffect hook to fetch cards when the component mounts
    useEffect(() => {
        fetchCards();
    }, []); // Empty dependency array ensures this runs only once on mount

    /**
     * Handler for the Update button click.
     * Initiates the process to fetch and update a specific card.
     * @param {number|string} cardId - The ID of the card to update.
     */
    const handleUpdate = (cardId) => {
        fetchCardById(cardId); // Fetch the card details and open the update modal
    };

    /**
     * Handler for the Delete button click.
     * Opens the DeleteCard modal with the selected card's ID.
     * @param {number|string} cardId - The ID of the card to delete.
     */
    const handleDelete = (cardId) => {
        setSelectedCard(cardId); // Set the selected card ID for deletion
        setIsDeleteModalOpen(true); // Open the DeleteCard modal
    };

    /**
     * Callback function to refresh the card list after a card has been updated.
     */
    const handleCardUpdated = () => {
        fetchCards(); // Re-fetch the updated list of cards
        setIsUpdateModalOpen(false); // Close the UpdateCard modal
    };

    /**
     * Callback function to refresh the card list after a card has been deleted.
     */
    const handleCardDeleted = () => {
        fetchCards(); // Re-fetch the updated list of cards
        setIsDeleteModalOpen(false); // Close the DeleteCard modal
    };

    /**
     * Handler for the search input field.
     * Filters the displayed cards based on the search term.
     * @param {Object} e - The event object from the input field.
     */
    const handleSearch = (e) => {
        const term = e.target.value; // Get the current value of the search input
        setSearchTerm(term); // Update the 'searchTerm' state
        // Filter the cards where the card number includes the search term
        const filtered = cards.filter((card) => card.cardNo.toString().includes(term));
        setFilteredCards(filtered); // Update the 'filteredCards' state with the filtered results
    };

    /**
     * Handles the payment process for a specific card.
     * Sends a request to increment the usage count for the card.
     * @param {number|string} cardId - The ID of the card to process payment for.
     */
    const handlePay = async (cardId) => {
        try {
            // Make a POST request to increment the usage count for the card
            await axios.post(`http://localhost:5000/routeUsage/increment/${cardId}`);
            setPaymentSuccess(cardId); // Indicate that payment was successful for this card
            // Reset the paymentSuccess state after 3 seconds to hide the success message
            setTimeout(() => setPaymentSuccess(null), 3000);
            fetchCards(); // Refresh the card list to reflect any changes
        } catch (error) {
            console.error('Error processing payment:', error); // Log any errors during payment processing
        }
    };

    /**
     * Generates and downloads a usage report in PDF format.
     * Fetches the report data from the server and uses jsPDF to create the PDF.
     */
    const handleDownloadReport = async () => {
        try {
            // Make a GET request to fetch the usage report data
            const response = await axios.get('http://localhost:5000/routeUsage/report');
            const reportData = response.data;

            const doc = new jsPDF(); // Initialize a new jsPDF document
            doc.setFontSize(18); // Set the font size for the title
            doc.text('Usage Report', 14, 22); // Add the title text to the PDF

            // Add a table to the PDF using the fetched report data
            doc.autoTable({
                head: [['Card Type', 'Cardholder Name', 'Usage Count']], // Table headers
                body: reportData.map((item) => [item.cardType, item.cardHolderName, item.usageCount]), // Table rows
                startY: 30, // Starting Y position for the table
            });

            doc.save('usage_report.pdf'); // Trigger the download of the PDF
        } catch (error) {
            console.error('Error generating report:', error); // Log any errors during report generation
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Wallet Header */}
            <h2 className="text-2xl font-semibold mb-6">My Wallet</h2>

            {/* Search Input Field */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by card number"
                    value={searchTerm}
                    onChange={handleSearch} // Update search term on input change
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Display Grouped Cards */}
            <div>
                {Object.entries(groupCardsByType(filteredCards)).map(([cardType, cards]) => (
                    <div key={cardType} className="bg-gray-100 p-4 rounded-lg mb-8">
                        {/* Card Type Header */}
                        <h3 className="text-xl font-medium mb-4">{cardType}</h3>
                        {/* Grid of Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cards.map((card) => (
                                <div key={card.id} className="bg-white p-4 rounded-lg shadow-lg">
                                    {/* Card Details */}
                                    <div className="mb-4">
                                        <p className="text-lg font-medium">Cardholder: {card.cardHolderName}</p>
                                        <p>Card Number: {card.cardNo || 'N/A'}</p>
                                        <p>Expiry Date: {new Date(card.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                    {/* Action Buttons: Update, Delete, Pay */}
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleUpdate(card.id)} // Trigger update handler
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card.id)} // Trigger delete handler
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handlePay(card.id)} // Trigger payment handler
                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                        >
                                            Pay
                                        </button>
                                    </div>
                                    {/* Payment Success Message */}
                                    {paymentSuccess === card.id && (
                                        <div className="mt-4 bg-green-100 text-green-800 p-2 rounded">
                                            Payment Successful
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Download Report Button */}
            <div className="text-center mt-8">
                <button
                    onClick={handleDownloadReport} // Trigger report download handler
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Download Report
                </button>
            </div>

            {/* UpdateCard Modal */}
            {isUpdateModalOpen && (
                <UpdateCard
                    cardId={selectedCard} // Pass the selected card ID to the UpdateCard component
                    onClose={() => setIsUpdateModalOpen(false)} // Handler to close the modal
                    onUpdate={handleCardUpdated} // Callback after a successful update
                />
            )}

            {/* DeleteCard Modal */}
            {isDeleteModalOpen && (
                <DeleteCard
                    cardId={selectedCard} // Pass the selected card ID to the DeleteCard component
                    onClose={() => setIsDeleteModalOpen(false)} // Handler to close the modal
                    onDelete={handleCardDeleted} // Callback after a successful deletion
                />
            )}
        </div>
    );
};

export default Wallet;
