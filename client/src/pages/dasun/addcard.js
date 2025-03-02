import React, {useState} from 'react';

const AddCard = () => {
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('https://servertest-isos.onrender.com/api/user/api/cards', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                card_holder_name: cardHolderName,
                card_number: cardNumber,
                expiration_date: expirationDate,
                cvv
            }),
        });
        // Reset form or handle success
        setCardHolderName('');
        setCardNumber('');
        setExpirationDate('');
        setCvv('');
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.heading}>Add Card Details</h2>
            <input
                type="text"
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                required
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Expiration Date (MM/YYYY)"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
                style={styles.input}
            />
            <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                style={styles.input}
            />
            <button type="submit" style={styles.button}>Add Card</button>
        </form>
    );
};

// Define styles as a JavaScript object
const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.5rem',
        color: '#333',
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    button: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default AddCard;
