import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useLogout } from './authUtils';
import logo2 from "../../images/logow.png";
import cartIcon from '../../images/cart.png';

function Navbar({ cartCount }) { // Accept cartCount as a prop
    const logout = useLogout(); // Using the custom hook
    const [cookieExists, setCookieExists] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const cookie = Cookies.get('diamond');
        setCookieExists(!!cookie);

        // Detect section to scroll after navigating from another page
        const hash = location.hash;
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const handleLogout = () => {
        logout(); // Call the logout function from the custom hook
        Cookies.remove('diamond');
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src={logo2} alt="Logo" className="h-10 mr-3" />
                    <span className="text-xl font-semibold">My Store</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {cookieExists && (
                        <Link to="/cart" className="relative">
                            <img src={cartIcon} alt="Cart" className="h-8" />
                            <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full px-1 text-xs">
                                {cartCount}
                            </span>
                        </Link>
                    )}
                    {cookieExists ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
