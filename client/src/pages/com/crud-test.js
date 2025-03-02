import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function App() {
    const [hours, setHours] = useState([]);
    const [hoursInput, setHoursInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');

    // Fetch hours data on component mount
    useEffect(() => {
        fetch('https://servertest-isos.onrender.com/api/crud/view', {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data); // Debug log

                if (Array.isArray(data.hours)) {
                    setHours(data.hours);
                } else {
                    console.error('Data is not an array:', data.hours); // Debug log
                }
            })
            .catch((error) => console.error('Fetch error:', error)); // Debug log
    }, []);

    // Handle form submission for adding new hours
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://servertest-isos.onrender.com/api/crud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({hours: hoursInput, place: placeInput}),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Added data:', data); // Debug log
                if (data && data.id) {
                    setHours((prevHours) => [...prevHours, data]);
                } else {
                    console.error('Invalid data received:', data); // Debug log
                }
                setHoursInput('');
                setPlaceInput('');
            })
            .catch((error) => console.error('Submit error:', error)); // Debug log
    };

    // Handle deleting an entry
    const handleDelete = (id) => {
        fetch(`https://servertest-isos.onrender.com/api/crud/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(() => {
                setHours((prevHours) => prevHours.filter((hour) => hour.id !== id));
            })
            .catch((error) => console.error('Delete error:', error)); // Debug log
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
                    {Array.isArray(hours) && hours.length > 0 ? (
                        hours.map((hour) => (
                            <tr key={hour.id}>
                                <td className="border p-2">{hour.id}</td>
                                <td className="border p-2">{hour.hours}</td>
                                <td className="border p-2">{hour.place}</td>
                                <td className="border p-2 flex gap-2">
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(hour.id)}
                                    >
                                        Delete
                                    </button>
                                    <Link to={`/update/${hour.id}`}>
                                        <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                                            Update
                                        </button>
                                    </Link>
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
