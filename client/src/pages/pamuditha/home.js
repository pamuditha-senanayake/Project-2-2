import React, {useState} from "react";
import {Link} from "react-router-dom";
import logo from "../../images/logo.jpeg";
import logo2 from "../../images/logow.png";
import homepic from "../../images/home.jpg";
import homepic2 from "../../images/c.jpg";
import homepic3 from "../../images/a.jpg";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

// Function to smoothly scroll to a section
const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({behavior: "smooth"});
};
const MapComponent = () => {
    const mapStyles = {
        height: "100%",
        width: "100%",
    };

    const defaultCenter = {
        lat: 7.288941287673795, // Example latitude (New York City)
        lng: 80.62935649554917, // Example longitude (New York City)

    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={defaultCenter}
            >
                <Marker position={defaultCenter}/>
            </GoogleMap>
        </LoadScript>
    );
};

export {MapComponent};

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array holding images and text content for each slide
    const slides = [
        {
            image: homepic2,
            text: {
                title: 'First Slide Title',
                description: 'Description for the first slide.',
            },
        },
        {
            image: homepic,
            text: {
                title: 'Second Slide Title',
                description: 'Description for the second slide.',
            },
        },
        {
            image: homepic2,
            text: {
                title: 'Third Slide Title',
                description: 'Description for the third slide.',
            },
        },
    ];

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div className="relative w-full h-full flex">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{transform: `translateX(-${currentIndex * 100}%)`}}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="relative w-full flex-shrink-0 h-full">
                            <img
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 flex flex-col justify-end items-center bg-black bg-opacity-50 text-center p-4">
                                <h1 className="text-white text-2xl">{slide.text.title}</h1>
                                <p className="text-white">{slide.text.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Previous Button */}
                <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-white text-black p-2 rounded-full z-10"
                >
                    &#9664;
                </button>

                {/* Next Button */}
                <button
                    onClick={goToNext}
                    className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-white text-black p-2 rounded-full z-10"
                >
                    &#9654;
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index ? 'bg-white' : 'bg-gray-400'
                        }`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export {Carousel};

const InfoCards = () => {
    const cards = [
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Heading 1",
            text: "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.",
        },
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Heading 2",
            text: "Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
        },
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Heading 3",
            text: "Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                    <img
                        className="rounded-full mb-4"
                        src={card.imgSrc}
                        alt={`Image ${index + 1}`}
                        width="140"
                        height="140"
                    />
                    <h2 className="text-xl font-bold mb-4">{card.heading}</h2>
                    <p className="text-gray-600 mb-4">{card.text}</p>
                    <a
                        className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        href="#"
                        role="button"
                    >
                        View details &raquo;
                    </a>
                </div>
            ))}
        </div>
    );
};

export {InfoCards};

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
                                <Link to="/services"
                                      className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Appointments</Link>

                                <div>

                                    <a className="nav-link text-white julius-sans-one-regular dropdown-toggle"
                                       href="http://example.com" id="dropdown07"
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
        <div className="felx flex-col" style={{backgroundColor: "#E8ECEF", height: "100vh"}}>
            <div className="flex">
                <Navbar/>
            </div>


            <div className="flex h-[700px]" id="home">
                <div className="App">
                    <Carousel/>
                </div>
                {/*<div*/}
                {/*    style={{*/}
                {/*        backgroundImage: `url(${homepic})`,*/}
                {/*        backgroundSize: 'cover',*/}
                {/*        backgroundPosition: 'center',*/}
                {/*        backgroundRepeat: 'no-repeat',*/}
                {/*    }}*/}
                {/*    className="absolute inset-0 w-full h-full z-0" // Background image behind*/}
                {/*>*/}
                {/*    /!* Background Image *!/*/}
                {/*</div>*/}

                {/*<div className="z-10 relative flex justify-center items-center h-full w-full">*/}
                {/*    <h1 className="text-white text-4xl">hello world</h1> /!* Text in front *!/*/}
                {/*</div>*/}
            </div>

            <div className="bg-white h-[800px] flex" id="gallery">
                <div
                    style={{
                        backgroundImage: `url(${homepic3})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="w-full h-full bg-cover bg-center"
                >
                    {/* Background Image */}
                </div>
            </div>


            <div className=" h-[800px] flex flex-row space-x-5 bg-pink-500 " id="testimonials">


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

            <div className="bg-white h-full " id="about"
                 style={{
                     backgroundImage: `url(${homepic2})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}

            >


                <div className="flex flex-row h-full justify-between w-full pr-10">
                    <div className="w-[50%] felx order-1 h-full">
                        <div className="flex h-full w-full mt-0">
                            <MapComponent/>
                        </div>
                    </div>
                    <div className="w-[50%] felx order-2 h-full pt-5 pb-5">
                        <div className="flex justify-center items-center h-full ">
                            <div
                                className="w-full max-w-md rounded-lg shadow-lg p-6 flex flex-col h-full"
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


            <div className="bg-white flex flex-row h-[800px] " id="profile">
                <InfoCards/>
            </div>
            <div className="bg-white flex flex-row h-[300px] " id="profile">
                <h1>footer area</h1>
            </div>


        </div>
    )
        ;
};

export default Home;
