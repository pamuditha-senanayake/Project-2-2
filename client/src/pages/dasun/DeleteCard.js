// DeleteCard.jsx
import React from 'react';
import axios from 'axios';

const DeleteCard = ({cardId, onClose, onDelete}) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://servertest-isos.onrender.com/api/user/delete/${cardId}`, {
                withCredentials: true // Include credentials if needed
            });

            if (response.status === 200) {
                onDelete();
                onClose();
            } else {
                console.error('Failed to delete the card:', response.data);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">Delete Card</h2>
                <p className="mb-4">Are you sure you want to delete this card?</p>
                <div className="flex justify-between">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCard;
