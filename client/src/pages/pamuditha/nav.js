import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from "../../images/logow.png";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (sectionId) => {
        if (location.pathname === '/home') {
            // If already on the homepage, scroll to the section
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If not on the homepage, navigate to the homepage with a section ID query parameter
            navigate(`/home?section=${sectionId}`);
        }
    };

    return (
        <nav className="bg-black fixed top-0 left-1/2 transform -translate-x-1/2 w-[97%] z-50 shadow-md mt-2" style={{ borderRadius: 40 }}>
            <div className="w-full pr-5">
                <div className="flex flex-row h-20 justify-between">
                    <div className="flex-shrink-0 content-start pl-4">
                        <a href="/home">
                            <img src={logo2} alt="Logo" className="h-full start content-start" />
                        </a>
                    </div>
                    <div className="flex items-center content-end">
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <button onClick={() => scrollToSection("home")} className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</button>
                                <button onClick={() => scrollToSection("gallery")} className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gallery</button>
                                <button onClick={() => scrollToSection("testimonials")} className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Testimonials</button>
                                <button onClick={() => scrollToSection("about")} className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About Us</button>
                                <button onClick={() => scrollToSection("profile")} className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</button>
                                <Link to="/appointments" className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Appointments</Link>
                                <div>
                                    <a className="nav-link text-white julius-sans-one-regular dropdown-toggle" href="http://example.com" id="dropdown07" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</a>
                                    <div className="dropdown-menu" aria-labelledby="dropdown07">
                                        <a className="dropdown-item julius-sans-one-regular" href="#">Cart</a>
                                        <a className="dropdown-item julius-sans-one-regular" href="#">Login</a>
                                        <a className="dropdown-item julius-sans-one-regular" href="#">Logout</a>
                                        <a className="dropdown-item julius-sans-one-regular" href="#">Profile</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;