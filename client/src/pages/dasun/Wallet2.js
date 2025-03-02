import React, {useEffect, useState} from 'react';
import Navigation from '../pamuditha/nav';
import {useNavigate} from 'react-router-dom';
import homepic4 from "../../images/f.jpg";
import Swal from "sweetalert2";
import axios from 'axios';
import {useParams} from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Wallet2 = () => {

    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const navigate = useNavigate();
    const {userId} = useParams();

    const groupCardsByType = (cards) => {
        return cards.reduce((acc, card) => {
            if (!acc[card.cardType]) {
                acc[card.cardType] = [];
            }
            acc[card.cardType].push(card);
            return acc;
        }, {});
    };
    const [activeButton, setActiveButton] = useState('payment');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);

        if (buttonName === 'profile') {
            navigate('/userp'); // Adjust with your actual route
        } else if (buttonName === 'appointments') {
            navigate('/myappointment2'); // Adjust with your actual route
        } else if (buttonName === 'payment') {
            navigate('/wallet2'); // Adjust with your actual route
        }
    };

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

    const handleUpdate = (cardId) => {
        const card = cards.find(c => c.id === cardId);
        setSelectedCard(card);
        setIsUpdateModalOpen(true);
    };

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
                credentials: 'include', // Include credentials with the request
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchCards(); // Refresh the cards after updating
            setIsUpdateModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating card:', error);
        }
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

    const handleDelete = async (cardId) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await fetch(`https://servertest-isos.onrender.com/api/user/deletecard/${cardId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                await fetchCards(); // Refresh the cards after deletion
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);
    return (
        <div
            className="flex flex-col h-screen w-full julius-sans-one-regular"
            style={{
                backgroundImage: `url(${homepic4})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Navigation/>

            <div className="flex items-center justify-center w-full h-full mt-[20px] overflow-hidden mb-2">
                <div
                    className="flex flex-row w-[90%] h-[90%] space-x-2 border-2 rounded-2xl py-3 px-3 mt-[100px] bg-white overflow-hidden"
                >
                    {/* Left Side */}
                    <div className="flex flex-col w-[20%] h-full rounded-2xl border-2">
                        <p className="p-4 text-3xl">Menu</p>

                        <div className="flex flex-col space-y-4 p-4">
                            <button
                                className={`${
                                    activeButton === 'profile' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('profile')}
                            >
                                Profile
                            </button>
                            <button
                                className={`${
                                    activeButton === 'appointments' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('appointments')}
                            >
                                Appointments
                            </button>
                            <button
                                className={`${
                                    activeButton === 'payment' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('payment')}
                            >
                                Payment
                            </button>

                            {/* Delete Button */}
                            {/*<button*/}
                            {/*    className="text-red-600 font-normal py-2 px-4 rounded-full hover:bg-pink-200 focus:outline-none"*/}
                            {/*    onClick={handleDelete}*/}
                            {/*>*/}
                            {/*    Delete*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col w-full h-full">
                        {/* Top Side */}
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
                                            <div key={card.id} className="bg-white p-4 rounded-lg shadow-lg">
                                                <div className="mb-4">
                                                    <p className="text-lg font-medium">Cardholder: {card.cardHolderName}</p>
                                                    <p>Card Number: {card.cardNo || 'N/A'}</p>
                                                    <p>Expiry Date: {new Date(card.expiryDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <button
                                                        onClick={() => handleUpdate(card.id)}
                                                        className="bg-pink-500 text-white py-1 px-3 rounded hover:bg-pink-600"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(card.id)}
                                                        className="bg-pink-300 text-white py-1 px-3 rounded hover:bg-pink-600"
                                                    >
                                                        Delete
                                                    </button>
                                                    {/*<button*/}
                                                    {/*    onClick={() => handlePay(card.id)}*/}
                                                    {/*    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"*/}
                                                    {/*>*/}
                                                    {/*    Pay*/}
                                                    {/*</button>*/}
                                                </div>
                                                {paymentSuccess === card.id && (
                                                    <div className="mt-4 bg-pink-100 text-pink-800 p-2 rounded">
                                                        Payment Successful
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
                                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                            >
                                Download Report
                            </button>
                        </div>

                        {/* Update Modal */}
                        {isUpdateModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-semibold mb-4">Update Card</h2>
                                    <form onSubmit={handleUpdateSubmit}>
                                        <div className="mb-4">
                                            <label className="block mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                value={selectedCard?.cardHolderName}
                                                onChange={(e) => setSelectedCard({
                                                    ...selectedCard,
                                                    cardHolderName: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                value={selectedCard?.cardNo}
                                                onChange={(e) => setSelectedCard({
                                                    ...selectedCard,
                                                    cardNo: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">Expiry Date</label>
                                            <input
                                                type="date"
                                                value={selectedCard?.expiryDate.split('T')[0]} // Extract date in 'YYYY-MM-DD' format
                                                onChange={(e) => setSelectedCard({
                                                    ...selectedCard,
                                                    expiryDate: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-1">CVC Number</label>
                                            <input
                                                type="text"
                                                value={selectedCard?.cvcNo}
                                                onChange={(e) => setSelectedCard({
                                                    ...selectedCard,
                                                    cvcNo: e.target.value
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsUpdateModalOpen(false)}
                                                className="ml-2 bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet2;
