import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.jpeg";
import logo2 from "../../images/logow.png";
import homepic from "../../images/home.jpg";
import homepic2 from "../../images/c.jpg";

// Function to smoothly scroll to a section
const scrollToSection = (sectionId) => {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
};

// Navbar Component
function Navbar() {
  // const [dropdownOpen, setDropdownOpen] = useState(false);


  return (
      <nav className="bg-black fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="w-full pr-5">
            <div className="flex flex-row h-20 justify-between">
                {/* Left side with Logo */}

                <div className="flex-shrink-0 content-start pl-4">
                    <a href="/home">
                        <img src={logo2} alt="Logo" className="h-full start content-start"/>
                    </a>
                </div>
                <div className="flex items-center content-end">

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <button onClick={() => scrollToSection("home")}
                                    className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home
                            </button>
                            <button onClick={() => scrollToSection("gallery")}
                                    className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gallery
                            </button>
                            <button onClick={() => scrollToSection("testimonials")}
                                    className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Testimonials
                            </button>
                            <button onClick={() => scrollToSection("about")}
                                    className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About
                                Us
                            </button>
                            <button onClick={() => scrollToSection("profile")}
                                    className="julius-sans-one-regular text-white hover:bg-pink-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile
                            </button>
                            <Link to="/appointments"
                                  className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Appointments</Link>

                            <div>

                                    <a className="nav-link text-white julius-sans-one-regular dropdown-toggle" href="http://example.com" id="dropdown07"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</a>
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
}

// Home Component
const Home = () => {
    return (
        <div style={{backgroundColor: "#E8ECEF", height: "100vh"}}>
            <Navbar/>
            <div className="bg-white h-[800px]  " id="home">
                <div
                    style={{
                        backgroundImage: `url(${homepic})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="flex w-full h-full" // Adjust width and height as needed
                >
                    {/* Content goes here */}
                </div>
            </div>
            <div className="bg-white h-[800px] " id="gallery">
                <h1>Gallery</h1>
            </div>

            <div className="bg-white h-[800px] flex flex-row space-x-5 " id="testimonials">


                <div className="flex items-center justify-between w-full px-10">

                    <div className="card" style={{width: '18rem'}}>
                        <img className="card-img-top" src={logo} alt="Card image cap"/>
                        <div className="card-body">
                            <p className="card-text">
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{width: '18rem'}}>
                        <img className="card-img-top" src={logo} alt="Card image cap"/>
                        <div className="card-body">
                            <p className="card-text">
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{width: '18rem'}}>
                        <img className="card-img-top" src={logo} alt="Card image cap"/>
                        <div className="card-body">
                            <p className="card-text">
                                Some quick example text to build on the card title and make up the bulk of the card's
                                content.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-white h-[800px] " id="about"
                 style={{
                     backgroundImage: `url(${homepic2})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}
                 // Adjust width and height as needed
            >
                {/* Content goes here */}
            >
                <div className="flex flex-row h-full justify-between w-full px-10">
                    <div className="w-[50%] felx order-1 h-full">

                    </div>
                    <div className="w-[50%] felx order-2 h-full">
                        <div className="flex justify-center items-center h-full ">
                            <div
                                className="w-full max-w-md rounded-lg shadow-lg p-6 flex flex-col h-[80vh]"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                    backdropFilter: 'blur(5px)',
                                    WebkitBackdropFilter: 'blur(50px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                <div className="flex-grow overflow-y-auto mb-4">
                                    {/* Chat messages will be dynamically inserted here */}
                                    <div className="message bg-gray-200 p-3 mb-2 rounded-lg">
                                        <p className="text-gray-700">Chatbot: Hello! How can I assist you today?</p>
                                    </div>
                                    <div className="message bg-blue-500 text-white p-3 mb-2 rounded-lg self-end">
                                        <p>You: I need help with booking a room.</p>
                                    </div>
                                </div>
                                <form id="chat-form" className="flex flex-col">
                                    <label htmlFor="message" className="text-gray-700 mb-2">Ask a question:</label>
                                    <input
                                        type="text"
                                        id="message"
                                        name="message"
                                        className="p-2 mb-2 border border-gray-300 rounded-md text-gray-700"
                                        placeholder="Type your message here..."
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


            <div className="bg-white h-[800px] " id="profile">
                Profile Section
            </div>

        </div>
    )
        ;
};

export default Home;
