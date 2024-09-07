import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ProfilePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { ticket } = location.state || { ticket: {} };

    const goBack = () => {
        navigate('/existing', { state: { ticket } });
    };

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Customer Name: {ticket.customer_name}</p>
            <p>Email: {ticket.email}</p>
            <p>Issue Description: {ticket.inquiry_description}</p>
            <p>Status: {ticket.status}</p>
            <p>Catalogs: {ticket.notifications ? ticket.notifications.join(', ') : 'N/A'}</p>
            <button onClick={goBack}>Back</button>
        </div>
    );
}

export default ProfilePage;
