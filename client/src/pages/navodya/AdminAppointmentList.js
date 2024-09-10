import React, {useState} from 'react';

const AppointmentList = () => {
    const [filter, setFilter] = useState('confirmed');
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            service: 'Ladies Hair Cut',
            professional: 'Professional Name',
            date: '2024-09-05',
            time: '10:00 AM',
            paymentSlip: 'Payment_Slip_URL',
            status: 'confirmed'
        },
        {
            id: 2,
            service: 'Ladies Hair Cut',
            professional: 'Professional Name',
            date: '2024-09-05',
            time: '12:00 PM',
            paymentSlip: 'Payment_Slip_URL',
            status: 'pending'
        }
    ]);

    const handleStatusChange = (id, status) => {
        setAppointments(appointments.map(app => app.id === id ? {...app, status} : app));
    };

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
            <div className="mb-4">
                <select
                    className="border rounded px-4 py-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Service Name</th>
                        <th className="px-4 py-2">Professional</th>
                        <th className="px-4 py-2">Date & Time</th>
                        <th className="px-4 py-2">Payment Slip</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments
                        .filter(app => app.status === filter)
                        .map(app => (
                            <tr key={app.id}>
                                <td className="border px-4 py-2">{app.service}</td>
                                <td className="border px-4 py-2">{app.professional}</td>
                                <td className="border px-4 py-2">{app.date} at {app.time}</td>
                                <td className="border px-4 py-2">
                                    <a href={app.paymentSlip} target="_blank" rel="noopener noreferrer"
                                       className="text-blue-500">View Slip</a>
                                </td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleStatusChange(app.id, 'confirmed')}
                                    >
                                        Confirmed
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleStatusChange(app.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleStatusChange(app.id, 'pending')}
                                    >
                                        Pending
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <button className="bg-gray-800 text-white px-4 py-2 rounded">Generate PDF</button>
            </div>
        </div>
    );
};

export default AppointmentList;
