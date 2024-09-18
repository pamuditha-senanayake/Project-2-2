import React from 'react';
import {Link} from 'react-router-dom';
import {useLogout} from '../pamuditha/authUtils';

const SidebarItem = ({title, links}) => {
    return (
        <li className="mb-2">
            <div className="w-100 py-2 px-4 d-flex align-items-center rounded-3 bg-dark text-light">
                <span>{title}</span>
            </div>
            <ul className="list-unstyled ps-4 mt-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            to={link.url}
                            onClick={link.onClick} // Handle click for Sign out
                            className="d-block py-2 px-4 text-dark hover:bg-secondary rounded transition-colors"
                            style={{textDecoration: 'none'}} // Remove underline
                        >
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    );
};

const Sidebar = () => {
    const logout = useLogout(); // Using the custom hook for logout

    const sections = [
        {
            title: 'Home',
            links: [
                {text: 'Admin-Home', url: '/adminhome'},
                {text: 'User-Home', url: '/home'},


            ],
        },
        {
            title: 'User Dashboard',
            links: [
                {text: 'User-List', url: '/admin-users'},
                {text: 'Overview', url: '#'},
                {text: 'Weekly', url: '#'},

            ],
        },
        {
            title: 'Appoinment',
            links: [
                {text: 'View', url: '/view'},
                /*{text: 'Processed', url: '#'},
                {text: 'Shipped', url: '#'},
                {text: 'Returned', url: '#'},*/
            ],
        },
        {
            title: 'Orders',
            links: [
                {text: 'New', url: '#'},
                {text: 'Processed', url: '#'},
                {text: 'Shipped', url: '#'},
                {text: 'Returned', url: '#'},
            ],
        },
        {
            title: 'Account',
            links: [
                {text: 'Admin Registration', url: '/adminreg'},
                {text: 'Profile', url: '/adminprofile'},


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
        <div className="julius-sans-one-regular top-0 left-0 h-100 w-72 text-dark overflow-auto"
             style={{
                 borderRadius: '0.375rem', // 6px border-radius (Bootstrap default)
                 boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                 backdropFilter: 'blur(5px)',
                 WebkitBackdropFilter: 'blur(5px)',
                 border: '1px solid rgba(255, 255, 255, 0.3)'
             }}
        >
            <Link
                to="/"
                className="d-flex align-items-center py-3 mb-3 border-bottom border-light text-dark hover:bg-light transition-colors"
                style={{textDecoration: 'none'}} // Remove underline
            >
                <span className="text-2xl fw-semibold">Salon Diamond</span>
            </Link>

            <ul className="list-unstyled p-0">
                {sections.map((section, index) => (
                    <SidebarItem
                        key={index}
                        title={section.title}
                        links={section.links}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
