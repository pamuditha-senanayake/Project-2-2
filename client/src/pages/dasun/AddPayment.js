import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import NavigationBar from "../navodya/NavigationBar";

const AddPayment = ({userId}) => {
    const navigate = useNavigate();
    const [cardData, setCardData] = useState({
        cardType: 'Master', // Set a default value
        cardHolderName: '',
        cardNo: '',
        expiryDate: '',
        cvcNo: ''
    });
    const [errors, setErrors] = useState({
        cardNo: '',
        cvcNo: ''
    });
    const [showSuccess, setShowSuccess] = useState(false); // State to show success notification

    const validateCardNo = (cardNo) => {
        const cardNoRegex = /^[0-9]{16}$/;
        return cardNoRegex.test(cardNo) ? '' : 'Card number must be 16 digits';
    };

    const validateCVC = (cvc) => {
        const cvcRegex = /^[0-9]{3}$/;
        return cvcRegex.test(cvc) ? '' : 'CVC must be 3 digits';
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCardData({...cardData, [name]: value});

        if (name === 'cardNo') {
            setErrors({...errors, cardNo: validateCardNo(value)});
        } else if (name === 'cvcNo') {
            setErrors({...errors, cvcNo: validateCVC(value)});
        }
    };

    const handleViewWallet = () => {
        navigate(`/wallet/:userId${userId}`); // Pass userId as a query parameter
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.cardNo || errors.cvcNo) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/api/user/adddd', cardData);
            console.log('Card added successfully:', response.data);
            setShowSuccess(true); // Show success modal after successful submission
        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    const handleCloseModal = () => {
        setShowSuccess(false);
        navigate('/home'); // Redirect to the homepage (Update the URL to the actual homepage route)
    };

    const isFormValid = !errors.cardNo && !errors.cvcNo && cardData.cardNo && cardData.cvcNo;

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <NavigationBar activeTab={5}/>
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Add Payment Method</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="cardType" className="mb-2 text-sm font-semibold text-gray-600">Card Type:</label>
                    <select
                        id="cardType"
                        name="cardType"
                        value={cardData.cardType}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="Master">Master</option>
                        <option value="Visa">Visa</option>
                        <option value="Amex">Amex</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="cardHolderName" className="mb-2 text-sm font-semibold text-gray-600">Cardholder's
                        Name:</label>
                    <input
                        type="text"
                        id="cardHolderName"
                        name="cardHolderName"
                        value={cardData.cardHolderName}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="cardNo" className="mb-2 text-sm font-semibold text-gray-600">Card Number:</label>
                    <input
                        type="text"
                        id="cardNo"
                        name="cardNo"
                        value={cardData.cardNo}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.cardNo && <p className="text-sm text-red-600 mt-2">{errors.cardNo}</p>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="expiryDate" className="mb-2 text-sm font-semibold text-gray-600">Expiry
                        Date:</label>
                    <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="cvcNo" className="mb-2 text-sm font-semibold text-gray-600">CVC Number:</label>
                    <input
                        type="text"
                        id="cvcNo"
                        name="cvcNo"
                        value={cardData.cvcNo}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.cvcNo && <p className="text-sm text-red-600 mt-2">{errors.cvcNo}</p>}
                </div>

                <button
                    type="submit"
                    className={`p-3 bg-green-500 text-white rounded-lg transition duration-300 ${!isFormValid ? 'cursor-not-allowed bg-gray-300' : 'hover:bg-green-600'}`}
                    disabled={!isFormValid}
                >
                    Save and Pay
                </button>
            </form>

            <button
                onClick={handleViewWallet}
                className="mt-4 p-3 bg-blue-500 text-white rounded-lg transition duration-300 hover:bg-blue-600"
            >
                View Wallet
            </button>

            {/* Success Notification Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-semibold mb-4">Payment Successful</h3>
                        <p>Your payment has been processed successfully.</p>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 p-3 bg-green-500 text-white rounded-lg transition duration-300 hover:bg-green-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPayment;
