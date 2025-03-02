import React, {useEffect, useState} from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import homepic6 from "../../images/e.jpg";
import {useNavigate, useParams} from "react-router-dom";

const Wallet = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [paymentSuccessVisible, setPaymentSuccessVisible] = useState(false);
    const navigate = useNavigate();
    const {userId} = useParams();

    // Function to group cards by type
    const groupCardsByType = (cards) => {
        return cards.reduce((acc, card) => {
            if (!acc[card.cardType]) {
                acc[card.cardType] = [];
            }
            acc[card.cardType].push(card);
            return acc;
        }, {});
    };

    // Fetch cards from the API
    const fetchCards = async () => {
        try {
            const response = await fetch(`https://servertest-isos.onrender.com/api/user/get/100`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 403 || response.status === 401) {
                navigate('/');
                return;
            }

            const data = await response.json();
            const mappedData = data.map(card => ({
                id: card.id,
                cardType: card.cardtype,
                cardHolderName: card.cardholdername,
                cardNo: card.cardno,
                expiryDate: card.expirydate,
                cvcNo: card.cvcNo,
            }));

            setCards(mappedData);
            setFilteredCards(mappedData);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    // Update card handling
    const handleUpdate = (cardId) => {
        const card = cards.find(c => c.id === cardId);
        setSelectedCard(card);
        setIsUpdateModalOpen(true);
    };

    // Submit the updated card information
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://servertest-isos.onrender.com/api/user/updatecard/${selectedCard.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardType: selectedCard.cardType,
                    cardHolderName: selectedCard.cardHolderName,
                    cardNo: selectedCard.cardNo,
                    expiryDate: selectedCard.expiryDate,
                    cvcNo: selectedCard.cvcNo,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchCards();
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    // Search functionality
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = cards.filter((card) => card.cardNo && card.cardNo.toString().includes(term));
        setFilteredCards(filtered);
    };

    // Handle payment
    const handlePay = async (cardId) => {
        try {
            await axios.post(`https://servertest-isos.onrender.com/api/user/increment/${cardId}`);
            setPaymentSuccess(cardId);
            setPaymentSuccessVisible(true); // Show success message
            fetchCards();
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    // Handle payment confirmation and navigation
    const handlePaymentSuccessOk = () => {
        setPaymentSuccessVisible(false);
        navigate('/home'); // Navigate to home page
    };

    // Download report functionality
    const handleDownloadReport = async () => {
        try {
            const response = await axios.get('https://servertest-isos.onrender.com/api/user/reportt');
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


    // Delete a card
    const handleDelete = async (cardId) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await fetch(`https://servertest-isos.onrender.com/api/user/deletecard/${cardId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                await fetchCards();
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        }
    };

    // Fetch cards on component mount
    useEffect(() => {
        fetchCards();
    }, []);

    return (

        <div className="container mx-auto p-4">
            <h2 className="text-7xl font-semibold mb-6">My Wallet</h2>

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
                                <div key={card.id} className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <p className="text-lg font-medium">Cardholder: {card.cardHolderName}</p>
                                        <p>Card Number: {card.cardNo || 'N/A'}</p>
                                        <p>Expiry Date: {new Date(card.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleUpdate(card.id)}
                                            className="bg-pink-400 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-pink-800 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 active:bg-pink-700"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="bg-black text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-red-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 active:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handlePay(card.id)}
                                            className="bg-pink-700 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-pink-500 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-black"
                                        >
                                            Pay
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={handleDownloadReport}
                    className="bg-black text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-pink-800 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 active:bg-pink-900"
                >
                    Download Report
                </button>
            </div>

            {isUpdateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Update Card</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={selectedCard?.cardHolderName || ''}
                                    onChange={(e) => setSelectedCard({...selectedCard, cardHolderName: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Card Number</label>
                                <input
                                    type="text"
                                    value={selectedCard?.cardNo || ''}
                                    onChange={(e) => setSelectedCard({...selectedCard, cardNo: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    value={selectedCard?.expiryDate || ''}
                                    onChange={(e) => setSelectedCard({...selectedCard, expiryDate: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">CVC Number</label>
                                <input
                                    type="text"
                                    value={selectedCard?.cvcNo || ''}
                                    onChange={(e) => setSelectedCard({...selectedCard, cvcNo: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-pink-500 text-white py-1 px-3 rounded-lg transition duration-300 ease-in-out hover:bg-pink-400"
                                >
                                    Update Card
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="mt-4 text-pink-600 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {paymentSuccessVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
                        <p>Your payment has been processed successfully.</p>
                        <button
                            onClick={handlePaymentSuccessOk}
                            className="bg-pink-500 text-white py-2 px-4 rounded-lg mt-4"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
