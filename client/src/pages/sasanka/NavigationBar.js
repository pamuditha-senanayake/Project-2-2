import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <nav className="bg-gradient-to-r from-purple-700 to-indigo-700 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">
                    MyShop
                </Link>
                <div className="flex space-x-4">
                    <Link to="/" className="text-white hover:text-pink-300">
                        Home
                    </Link>
                    <Link to="/cart" className="text-white hover:text-pink-300">
                        Cart
                    </Link>
                    <Link to="/checkout" className="text-white hover:text-pink-300">
                        Checkout
                    </Link>
                </div>
            </div>

        </nav>
    );
};

export default NavigationBar;
