import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateCard from './UpdateCard';
import DeleteCard from './DeleteCard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Wallet = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    const groupCardsByType = (cards) => {
        return cards.reduce((acc, card) => {
            if (!acc[card.cardType]) {
                acc[card.cardType] = [];
            }
            acc[card.cardType].push(card);
            return acc;
        }, {});
    };

    const fetchCards = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/user/get/100'); // Endpoint for fetching all cards
            setCards(response.data);
            setFilteredCards(response.data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const fetchCardById = async (cardId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user/gett/${cardId}`); // Fetch specific card
            setSelectedCard(response.data);
            setIsUpdateModalOpen(true); // Open update modal
        } catch (error) {
            console.error('Error fetching card:', error);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleUpdate = (cardId) => {
        fetchCardById(cardId); // Fetch card details before updating
    };

    const handleDelete = (cardId) => {
        setSelectedCard(cardId); // Ensure this ID is valid
        setIsDeleteModalOpen(true);
    };

    const handleCardUpdated = () => {
        fetchCards();
    };

    const handleCardDeleted = () => {
        fetchCards();
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = cards.filter((card) => card.cardNo.toString().includes(term));
        setFilteredCards(filtered);
    };

    const handlePay = async (cardId) => {
        try {
            await axios.post(`http://localhost:5000/routeUsage/increment/${cardId}`);
            setPaymentSuccess(cardId);
            setTimeout(() => setPaymentSuccess(null), 3000);
            fetchCards();
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axios.get('http://localhost:5000/routeUsage/report');
            const reportData = response.data;

            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Usage Report', 14, 22);

            doc.autoTable({
                head: [['Card Type', 'Cardholder Name', 'Usage Count']],
                body: reportData.map((item) => [item.cardType, item.cardHolderName, item.usageCount]),
                startY: 30,
            });

            doc.save('usage_report.pdf');
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">My Wallet</h2>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by card number"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                {Object.entries(groupCardsByType(filteredCards)).map(([cardType, cards]) => (
                    <div key={cardType} className="bg-gray-100 p-4 rounded-lg mb-8">
                        <h3 className="text-xl font-medium mb-4">{cardType}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cards.map((card) => (
                                <div key={card._id} className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <p className="text-lg font-medium">Cardholder: {card.cardHolderName}</p>
                                        <p>Card Number: {card.cardNo || 'N/A'}</p>
                                        <p>Expiry Date: {new Date(card.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleUpdate(card._id)}
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card._id)} // This should correctly pass card._id
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handlePay(card._id)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                        >
                                            Pay
                                        </button>
                                    </div>
                                    {paymentSuccess === card._id && (
                                        <div className="mt-4 bg-green-100 text-green-800 p-2 rounded">
                                            Payment is Successful
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={handleDownloadReport}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Download Report
                </button>
            </div>
            {isUpdateModalOpen && (
                <UpdateCard
                    cardId={selectedCard}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={handleCardUpdated}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteCard
                    cardId={selectedCard}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleCardDeleted}
                />
            )}
        </div>
    );
};

export default Wallet;
