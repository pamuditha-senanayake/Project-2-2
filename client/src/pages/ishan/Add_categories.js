import React, {useState} from 'react';
import axios from 'axios';

const AddCategoryForm = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/categories', {name});
            setSuccess(`Category added: ${response.data.name}`);
            setCategoryId(response.data.id);
            setName('');
            setError(null);
        } catch (err) {
            setError('Failed to add category');
            setSuccess(null);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Category
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {success && (
                <div className="mt-4 text-green-600">
                    <p>{success}</p>
                    <p>Category ID: {categoryId}</p> {/* Display the ID */}
                </div>
            )}
        </div>
    );
};

export default AddCategoryForm;
