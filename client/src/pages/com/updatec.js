import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'; // useNavigate instead of useHistory

function UpdateRecord() {
    const {id} = useParams();
    const navigate = useNavigate(); // useNavigate hook for navigation
    const [hoursInput, setHoursInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');

    useEffect(() => {
        // Fetch the specific record by ID
        fetch(`https://servertest-isos.onrender.com/api/crud/fetch/${id}`, {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                if (data.hour) {
                    setHoursInput(data.hour.hours);
                    setPlaceInput(data.hour.place);
                }
            })
            .catch((error) => console.error('Fetch error:', error));
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`https://servertest-isos.onrender.com/api/crud/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({hours: hoursInput, place: placeInput}),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then(() => {
                navigate('/crud'); // Redirect back to the main page
            })
            .catch((error) => console.error('Update error:', error));
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Update Record</h1>
            <form onSubmit={handleUpdate} className="bg-white p-4 rounded shadow-md">
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
                    Update
                </button>
            </form>
        </div>
    );
}

export default UpdateRecord;
