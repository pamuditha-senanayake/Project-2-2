import {Link} from "react-router-dom";

const NavigationBar = ({activeTab}) => {
    return (
        <nav className="flexed bg-gray-500 fixed top-0 left-1/2 transform -translate-x-1/2 w-[80%] z-50 shadow-md mt-2"
             style={{borderRadius: 40}}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex space-x-4">
                            <Link
                                to="/home"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 0
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Home
                            </Link>

                            <Link
                                to="/services"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 1
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Services
                            </Link>

                            <Link
                                to="/professional"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 2
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Professional
                            </Link>

                            <Link
                                to="/date&time"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 3
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Date & Time
                            </Link>

                            <Link
                                to="/confirm"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 4
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Confirm
                            </Link>

                            <Link
                                to="/appointmentpayment"
                                className={`rounded-md px-3 py-2 text-sm font-medium ${
                                    activeTab === 5
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                Payment
                            </Link>

                            {/* Add more links as needed */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link
                        to="/home"
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            activeTab === 0
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/services"
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            activeTab === 1
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        Services
                    </Link>

                    <Link
                        to="/professional"
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            activeTab === 2
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        Professional
                    </Link>

                    <Link
                        to="/date&time"
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            activeTab === 3
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        Date & Time
                    </Link>

                    <Link
                        to="/confirm"
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            activeTab === 4
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        Confirm
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
