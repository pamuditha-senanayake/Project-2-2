import React, {useState} from 'react';
import axios from 'axios';

const UpdateCard = ({cardData, onClose, onUpdate}) => {
    const [cardDetails, setCardDetails] = useState(cardData);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCardDetails((prevDetails) => ({...prevDetails, [name]: value}));
    };

    const updateCard = async (id, updatedDetails) => {
        try {
            await axios.put(`https://servertest-isos.onrender.com/api/user/update/${id}`, updatedDetails, {
                withCredentials: true, // Include credentials if required
            });
            onUpdate(); // Call the onUpdate prop to refresh the card list
            onClose(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCard(cardDetails.id, cardDetails);
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <h3>Update Card</h3>
                <input
                    type="text"
                    name="cardHolderName"
                    value={cardDetails.cardHolderName}
                    onChange={handleChange}
                    placeholder="Cardholder Name"
                    required
                />
                <input
                    type="text"
                    name="cardNo"
                    value={cardDetails.cardNo}
                    onChange={handleChange}
                    placeholder="Card Number"
                    required
                />
                <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleChange}
                    placeholder="Expiry Date"
                    required
                />
                <input
                    type="text"
                    name="cvcNo"
                    value={cardDetails.cvcNo}
                    onChange={handleChange}
                    placeholder="CVC"
                    required
                />
                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateCard;
