import React, {useState} from 'react';
import Sidebar from "../com/admindash";
import service_c from "../../images/service_c.jpg";
import {useNavigate} from 'react-router-dom';

const Layout = () => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);

    const toggleDropdown1 = () => setIsOpen1(!isOpen1);
    const toggleDropdown2 = () => setIsOpen2(!isOpen2);
    const toggleDropdown3 = () => setIsOpen3(!isOpen3);
    const toggleDropdown4 = () => setIsOpen4(!isOpen4);
    const toggleDropdown5 = () => setIsOpen5(!isOpen5);

    const navigate = useNavigate();

    const handleAddButtonClick = () => {
        navigate('/af');
    };

    return (
        <div className="flex h-screen">
            <div className="w-[15%] h-full bg-gray-800 text-white">
                <Sidebar/>
            </div>
            <div className="w-[85%] h-full">
                <div
                    style={{
                        backgroundImage: `url(${service_c})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh",
                        padding: "0px",
                    }}
                >
                    <br/>
                    <h1 className="lg:mx-32 text-8xl text-white font-bold text-black-500">Services</h1>
                    <br/>
                    <br/>
                    <div style={{textAlign: "left"}}>
                        <div className="lg:mx-32 opacity-98 py-8 text-1.5xl font-mono">
                            <br/>
                            <button
                                id="dropdownDefaultButton"
                                onClick={toggleDropdown1}
                                className="text-black bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                type="button"
                                style={{
                                    width: "600px",
                                    height: "60px",
                                    padding: "30px",
                                    fontSize: "25px",
                                    justifyContent: "center",
                                    border: "1px solid",
                                }}
                            >
                                Haircuts and Styling
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isOpen1 && (
                                <div
                                    className="z-10 bg-blue-600 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                                    style={{
                                        width: "600px",
                                        height: "170px",
                                        padding: "10px",
                                        fontSize: "45px",
                                        justifyContent: "center",
                                        border: "1px solid",
                                    }}
                                >
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownDefaultButton">
                                        <li><a href="vs"
                                               className="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white">Women's
                                            Haircuts</a></li>
                                        <li><a href="vs"
                                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Blowouts</a>
                                        </li>
                                        <li><a href="vs"
                                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Hair
                                            Trims</a></li>
                                        <li><a href="vs"
                                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Updos
                                            and Special Occasion Hairstyles</a></li>
                                    </ul>
                                </div>
                            )}
                            <br/>
                            <br/>
                            <button
                                id="dropdownDefaultButton"
                                onClick={toggleDropdown2}
                                className="text-black bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                type="button"
                                style={{
                                    width: "600px",
                                    height: "60px",
                                    padding: "30px",
                                    fontSize: "25px",
                                    justifyContent: "center",
                                    border: "1px solid",
                                }}
                            >
                                Coloring
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isOpen2 && (
                                <div
                                    className="z-10 bg-blue-600 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                                    style={{
                                        width: "600px",
                                        height: "170px",
                                        padding: "10px",
                                        fontSize: "45px", // Updated font size to match the first block
                                        justifyContent: "center",
                                        border: "1px solid",
                                    }}
                                >
                                    <ul
                                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownDefaultButton"
                                    >
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Full Hair Color
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Glossing Treatments
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Root Touch-Ups
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Color Correction
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <br/>
                            <br/>
                            <button
                                id="dropdownDefaultButton"
                                onClick={toggleDropdown3}
                                className="text-black bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                type="button"
                                style={{
                                    width: "600px",
                                    height: "60px",
                                    padding: "30px",
                                    fontSize: "25px",
                                    justifyContent: "center",
                                    border: "1px solid",
                                }}
                            >
                                Hair Extensions
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isOpen3 && (
                                <div
                                    className="z-10 bg-blue-600 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 "
                                    style={{
                                        width: "600px",
                                        height: "170px",
                                        padding: "10px",
                                        fontSize: "25px",
                                        justifyContent: "center",
                                        border: "1px solid",
                                    }}>
                                    <ul
                                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownDefaultButton"
                                    >
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Tape-In Extensions
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Clip-In Extensions
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Sew-In Extensions
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Fusion Extensions
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <br/>
                            <br/>
                            <button
                                id="dropdownDefaultButton"
                                onClick={toggleDropdown4}
                                className="text-black bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                type="button"
                                style={{
                                    width: "600px",
                                    height: "60px",
                                    padding: "30px",
                                    fontSize: "25px",
                                    justifyContent: "center",
                                    border: "1px solid",
                                }}
                            >
                                Perms and Relaxers
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isOpen4 && (
                                <div
                                    className="z-10 bg-blue-600 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                                    style={{
                                        width: "600px",
                                        height: "170px",
                                        padding: "10px",
                                        fontSize: "25px",
                                        justifyContent: "center",
                                        border: "1px solid",
                                    }}
                                >
                                    <ul
                                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownDefaultButton"
                                    >
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Perms
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Relaxers
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Keratin Treatments
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <br/>
                            <br/>
                            <button
                                id="dropdownDefaultButton"
                                onClick={toggleDropdown5}
                                className="text-black bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                type="button"
                                style={{
                                    width: "600px",
                                    height: "60px",
                                    padding: "30px",
                                    fontSize: "25px",
                                    justifyContent: "center",
                                    border: "1px solid",
                                }}
                            >
                                Treatments
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isOpen5 && (
                                <div
                                    className="z-10 bg-blue-600 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                                    style={{
                                        width: "600px",
                                        height: "170px",
                                        padding: "10px",
                                        fontSize: "25px",
                                        justifyContent: "center",
                                        border: "1px solid",
                                    }}
                                >
                                    <ul
                                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownDefaultButton"
                                    >
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Deep Conditioning
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Scalp Treatments
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Hair Strengthening
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <br/>
                            <br/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
