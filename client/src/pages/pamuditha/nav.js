import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {useLogout} from './authUtils';
import logo2 from "../../images/logow.png";
import cartIcon from '../../images/cart.png';

function Navbar({cartCount}) { // Accept cartCount as a prop
    const logout = useLogout(); // Using the custom hook
    const [cookieExists, setCookieExists] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const checkCookie = () => {
            const cookie = Cookies.get('diamond');
            setCookieExists(!!cookie);
        };

        checkCookie(); // Check on component mount

        const interval = setInterval(checkCookie, 5000); // Check every 5s

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleScrollOrRedirect = (sectionId) => {
        if (location.pathname !== '/home') {
            navigate(`/home#${sectionId}`); // Redirect to home page with section hash
        } else {
            scrollToSection(sectionId); // Scroll on home page directly
        }
    };

    const handleLogout = () => {
        logout(); // Call the logout function from the custom hook
        Cookies.remove('diamond');
        navigate('/');
    };

    return (
        <nav
            className="bg-black fixed top-0 left-1/2 transform -translate-x-1/2 w-[97%] z-50 shadow-md mt-2"
            style={{borderRadius: 40}}
        >
            <div className="w-full pr-5">
                <div className="flex flex-row h-20 justify-between">
                    {/* Left side with Logo */}
                    <div className="flex-shrink-0 content-start pl-4">
                        <a href="/home">
                            <img src={logo2} alt="Logo" className="h-full start content-start"/>
                        </a>
                    </div>

                    {/* Right side with buttons */}
                    <div className="flex items-center content-end">
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <button onClick={() => handleScrollOrRedirect('home')}
                                        className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Home
                                </button>
                                <button onClick={() => handleScrollOrRedirect('gallery')}
                                        className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Gallery
                                </button>
                                <button onClick={() => handleScrollOrRedirect('testimonials')}
                                        className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Testimonials
                                </button>
                                <button onClick={() => handleScrollOrRedirect('about')}
                                        className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    About Us
                                </button>
                                <Link to="/services"
                                      className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Appointments
                                </Link>
                                <Link to="/ProductList"
                                      className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Products
                                </Link>
                                <Link to="/cart" className="relative">
                                    <span
                                        className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Cart |
                                        <img src={cartIcon} alt="Cart" className="w-4 h-4 inline-block"/>
                                    </span>
                                    {cookieExists && (
                                        <span
                                            className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full px-1 text-xs">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                <div>
                                    <a className="nav-link text-white julius-sans-one-regular dropdown-toggle"
                                       href="http://example.com" id="dropdown07"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Menu
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="dropdown07">
                                        {cookieExists ? (
                                            <>
                                                <a className="dropdown-item julius-sans-one-regular"
                                                   href="/userp">Profile</a>

                                                <a className="dropdown-item julius-sans-one-regular"
                                                   href="/inq">Support</a>
                                                <a className="dropdown-item julius-sans-one-regular" href="#"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       handleLogout();
                                                   }}>Logout</a>
                                            </>
                                        ) : (
                                            <>
                                                <a className="dropdown-item julius-sans-one-regular" href="/">Login</a>
                                                <a className="dropdown-item julius-sans-one-regular"
                                                   href="/register">Register</a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
