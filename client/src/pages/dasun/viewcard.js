import React, {useEffect, useState} from 'react';

const ViewCards = () => {
    const [cards, setCards] = useState([]);

    const fetchCards = async () => {
        const response = await fetch('https://servertest-isos.onrender.com/api/user/api/cards');
        const data = await response.json();
        setCards(data);
    };

    const deleteCard = async (id) => {
        await fetch(`https://servertest-isos.onrender.com/api/user/api/cards/${id}`, {method: 'DELETE'});
        fetchCards(); // Refresh the list
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Your Cards</h1>
            <ul style={styles.cardList}>
                {cards.map(card => (
                    <li key={card.id} style={styles.cardItem}>
                        {card.card_holder_name} - {card.card_number}
                        <button
                            onClick={() => deleteCard(card.id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </button>
                        {/* Add update functionality here */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Define styles as a JavaScript object
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    cardList: {
        listStyleType: 'none',
        padding: '0',
    },
    cardItem: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default ViewCards;
