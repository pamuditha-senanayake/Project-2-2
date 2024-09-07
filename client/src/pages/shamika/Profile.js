import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from "../../images/a2.jpg";

function ProfilePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { ticket } = location.state || { ticket: {} };

    const goBack = () => {
        navigate('/existing', { state: { ticket } });
    };

    return (

        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div className="flex flex-col w-[50%] h-full justify-center pl-9"
                     style={{
                         background: 'rgba(87, 40, 215, 0.2)',
                         borderRadius: '16px',
                         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                         backdropFilter: 'blur(5px)',
                         WebkitBackdropFilter: 'blur(5px)',
                         border: '1px solid rgba(255, 255, 255, 0.3)',
                     }}
                >
                    <div>
                        <h2>Profile Page</h2>
                        <p>Customer Name: {ticket.customer_name}</p>
                        <p>Email: {ticket.email}</p>
                        <p>Issue Description: {ticket.inquiry_description}</p>
                        <p>Status: {ticket.status}</p>
                        <p>Catalogs: {ticket.notifications ? ticket.notifications.join(', ') : 'N/A'}</p>
                        <button onClick={goBack}>Back</button>
                    </div>
                </div>
            </div>
        </div>
                    );
                    }

                    export default ProfilePage;
