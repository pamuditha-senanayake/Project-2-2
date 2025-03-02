import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import homepic6 from "../../images/e.jpg";

const AddPayment = ({userId}) => {
    const navigate = useNavigate();
    const [cardData, setCardData] = useState({
        cardType: 'Master',
        cardHolderName: '',
        cardNo: '',
        expiryDate: '',
        cvcNo: ''
    });

    const [errors, setErrors] = useState({
        cardNo: '',
        cvcNo: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    // Validation functions for card number and CVC
    const validateCardNo = (cardNo) => {
        const cardNoRegex = /^[0-9]{16}$/;
        return cardNoRegex.test(cardNo) ? '' : 'Card number must be 16 digits';
    };

    const validateCVC = (cvc) => {
        const cvcRegex = /^[0-9]{3}$/;
        return cvcRegex.test(cvc) ? '' : 'CVC must be 3 digits';
    };

    // Handle input changes and validate
    const handleChange = (e) => {
        const {name, value} = e.target;
        setCardData({...cardData, [name]: value});

        // Validate based on input field
        if (name === 'cardNo') {
            setErrors({...errors, cardNo: validateCardNo(value)});
        } else if (name === 'cvcNo') {
            setErrors({...errors, cvcNo: validateCVC(value)});
        }
    };

    // Navigate to wallet view
    const handleViewWallet = () => {
        navigate(`/wallet/${userId}`);
    };

    // Submit payment information
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if there are validation errors
        if (errors.cardNo || errors.cvcNo) {
            return;
        }

        try {
            const response = await axios.post('https://servertest-isos.onrender.com/api/user/adddd', cardData, {withCredentials: true});
            console.log('Card added successfully:', response.data);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    // Close success modal and navigate home
    const handleCloseModal = () => {
        setShowSuccess(false);
        navigate('/home'); // Update with actual homepage route
    };

    // Form validity check
    const isFormValid = !errors.cardNo && !errors.cvcNo && cardData.cardNo && cardData.cvcNo;

    return (
        <div
            style={{
                backgroundImage: `url(${homepic6})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg mt-20 shadow-lg">
                <h2 className="text-center text-4xl font-semibold text-gray-700 mb-6">Add Payment Method</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {/* Card Type Selection */}
                    <div className="flex flex-col">
                        <label htmlFor="cardType" className="mb-2 text-sm font-semibold text-gray-600">Card
                            Type:</label>
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

                    {/* Cardholder's Name */}
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

                    {/* Card Number */}
                    <div className="flex flex-col">
                        <label htmlFor="cardNo" className="mb-2 text-sm font-semibold text-gray-600">Card
                            Number:</label>
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

                    {/* Expiry Date */}
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

                    {/* CVC Number */}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`p-3 bg-black text-white rounded-lg transition duration-300 ${!isFormValid ? 'cursor-not-allowed bg-gray-300' : 'hover:bg-pink-900'}`}
                        disabled={!isFormValid}
                    >
                        Save and Pay
                    </button>
                </form>

                {/* View Wallet Button */}
                <button
                    onClick={handleViewWallet}
                    className="mt-4 p-3 bg-pink-500 text-white rounded-lg transition duration-300 hover:bg-pink-600"
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
                                className="mt-4 p-3 bg-black text-white rounded-lg transition duration-300 hover:bg-pink-500"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPayment;
