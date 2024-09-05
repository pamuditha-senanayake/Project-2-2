// src/components/Sidebar.js
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaHome, FaChartLine, FaShoppingCart, FaUser} from 'react-icons/fa';
import {useLogout} from '../pamuditha/authUtils';

const SidebarItem = ({title, id, links}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <li className="mb-1">
            <button
                onClick={handleToggle}
                className="w-full text-left py-2 px-4 flex items-center rounded border-0 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                aria-expanded={isExpanded}
            >
                {title}
            </button>
            <div
                className={`overflow-hidden transition-max-height duration-500 ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
                <ul className="list-none pl-4">
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link
                                to={link.url}
                                onClick={link.onClick} // Handle click for Sign out
                                className="block py-2 px-4 text-white hover:bg-gray-600 rounded transition-colors"
                            >
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
};

const Sidebar = () => {
    const logout = useLogout(); // Using the custom hook for logout

    const sections = [
        {
            title: 'Home',
            id: 'home-collapse',
            links: [
                {text: 'Overview', url: '#'},
                {text: 'Updates', url: '#'},
                {text: 'Reports', url: '#'},
            ],
        },
        {
            title: 'Dashboard',
            id: 'dashboard-collapse',
            links: [
                {text: 'Overview', url: '#'},
                {text: 'Weekly', url: '#'},
                {text: 'Monthly', url: '#'},
                {text: 'Annually', url: '#'},
            ],
        },
        {
            title: 'Orders',
            id: 'orders-collapse',
            links: [
                {text: 'New', url: '#'},
                {text: 'Processed', url: '#'},
                {text: 'Shipped', url: '#'},
                {text: 'Returned', url: '#'},
            ],
        },
        {
            title: 'Account',
            id: 'account-collapse',
            links: [
                {text: 'New...', url: '#'},
                {text: 'Profile', url: '#'},
                {text: 'Settings', url: '#'},
                {
                    text: 'Sign out',
                    url: '#',
                    onClick: (e) => {
                        e.preventDefault();
                        logout(); // Call the logout function when "Sign out" is clicked
                    }
                }
            ],
        },
    ];

    return (
        <div className="fixed top-0 left-0 h-full w-72 bg-gray-800 text-white overflow-hidden overflow-y-scroll">
            <Link
                to="/"
                className="flex items-center py-3 mb-3 border-b border-gray-700 text-white hover:bg-gray-700 transition-colors"
            >
                <FaHome className="w-7 h-6 mr-2"/>
                <span className="text-xl font-semibold">Salon Diamond</span>
            </Link>

            <ul className="list-none p-0">
                {sections.map((section, index) => (
                    <SidebarItem
                        key={index}
                        title={section.title}
                        id={section.id}
                        links={section.links}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
