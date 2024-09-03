import React, {useEffect, useState} from 'react';

function App() {
    const [hours, setHours] = useState([]);
    const [hoursInput, setHoursInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');

    // Fetch hours data on component mount
    useEffect(() => {
        fetch('/api/crud', {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => setHours(data.hours));
    }, []);

    // Handle form submission for adding new hours
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/crud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({hours: hoursInput, place: placeInput}),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setHours((prevHours) => [...prevHours, data]);
                setHoursInput('');
                setPlaceInput('');
            });
    };

    // Handle deleting an entry
    const handleDelete = (id) => {
        fetch(`http://localhost:3001/api/crud/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(() => {
                setHours((prevHours) => prevHours.filter((hour) => hour.id !== id));
            });
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">CRUD App</h1>

            {/* Form for adding new hours */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Hours:</label>
                    <input
                        type="number"
                        value={hoursInput}
                        onChange={(e) => setHoursInput(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Place:</label>
                    <input
                        type="text"
                        value={placeInput}
                        onChange={(e) => setPlaceInput(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>

            {/* Table for displaying and managing hours */}
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-2xl mb-4">Your Entries</h2>
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Hours</th>
                        <th className="border p-2">Place</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {hours.length > 0 ? (
                        hours.map((hour) => (
                            <tr key={hour.id}>
                                <td className="border p-2">{hour.id}</td>
                                <td className="border p-2">{hour.hours}</td>
                                <td className="border p-2">{hour.place}</td>
                                <td className="border p-2">
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(hour.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border p-2" colSpan="4">
                                No entries found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
