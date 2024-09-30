import React from 'react';
import axios from 'axios';

const DeleteCard = ({cardId, onClose, onDelete}) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/routeCard/delete/${cardId}`);
            onDelete();
            onClose();
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-80 text-center">
                <h2 className="text-xl font-semibold mb-4">Delete Card</h2>
                <p className="mb-6">Are you sure you want to delete this card?</p>
                <div className="flex justify-around">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCard;
