import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateCard = ({ cardId, onClose, onUpdate }) => {
    const [cardData, setCardData] = useState({
        cardType: '',
        cardHolderName: '',
        cardNo: '',
        expiryDate: '',
        cvcNo: ''
    });

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/user/updatte/${cardId}`);
                setCardData(response.data);
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };
        fetchCardData();
    }, [cardId]);

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/user/updatte/${cardId}`, cardData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">Update Card</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {/* Form Fields */}
                    {/* Add inputs similar to AddPayment component */}
                    <input type="text" name="cardHolderName" value={cardData.cardHolderName} onChange={handleChange} placeholder="Cardholder Name" className="border border-gray-300 rounded-md p-2" />
                    {/* ...other inputs */}
                    <button type="submit" className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600">Update</button>
                    <button type="button" onClick={onClose} className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCard;
