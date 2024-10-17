// UpdateCard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateCard = ({ card, onClose, onUpdate }) => {
    const [cardData, setCardData] = useState({
        cardType: '',
        cardHolderName: '',
        cardNo: '',
        expiryDate: '',
        cvcNo: ''
    });

    useEffect(() => {
        if (card) {
            setCardData({
                cardType: card.cardType || '',
                cardHolderName: card.cardHolderName || '',
                cardNo: card.cardNo || '',
                expiryDate: card.expiryDate ? new Date(card.expiryDate).toISOString().split('T')[0] : '',
                cvcNo: card.cvcNo || ''
            });
        }
    }, [card]);

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert camelCase to snake_case before sending to the backend
            const payload = {
                cardtype: cardData.cardType,
                cardholdername: cardData.cardHolderName,
                cardno: cardData.cardNo,
                expirydate: new Date(cardData.expiryDate).toISOString(),
                cvcno: Number(cardData.cvcNo)
            };

            const response = await axios.put(`http://localhost:3001/api/user/update/${card.id}`, payload, {
                withCredentials: true // Include credentials if needed
            });

            if (response.status === 200) {
                onUpdate();
                onClose();
            } else {
                console.error('Failed to update the card:', response.data);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">Update Card</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        name="cardHolderName"
                        value={cardData.cardHolderName}
                        onChange={handleChange}
                        placeholder="Cardholder Name"
                        className="border border-gray-300 rounded-md p-2"
                        required
                    />
                    <input
                        type="text"
                        name="cardNo"
                        value={cardData.cardNo}
                        onChange={handleChange}
                        placeholder="Card Number"
                        className="border border-gray-300 rounded-md p-2"
                        required
                        pattern="\d{16}" // Example pattern for 16-digit card numbers
                        title="Card number must be 16 digits"
                    />
                    <input
                        type="date"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleChange}
                        placeholder="Expiry Date"
                        className="border border-gray-300 rounded-md p-2"
                        required
                    />
                    <input
                        type="number"
                        name="cvcNo"
                        value={cardData.cvcNo}
                        onChange={handleChange}
                        placeholder="CVC Number"
                        className="border border-gray-300 rounded-md p-2"
                        required
                        min="100"
                        max="9999"
                    />
                    <select
                        name="cardType"
                        value={cardData.cardType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2"
                        required
                    >
                        <option value="" disabled>Select Card Type</option>
                        <option value="Master">Master</option>
                        <option value="Visa">Visa</option>
                        <option value="Amex">Amex</option>
                        {/* Add other card types as needed */}
                    </select>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCard;
