import Cookies from 'js-cookie';
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import logo from "../../images/logo.jpeg";
import logo2 from "../../images/logow.png";
import homepic from "../../images/home.jpg";
import homepic2 from "../../images/c.jpg";
import homepic3 from "../../images/a.jpg";
import homepic4 from "../../images/5.jpg";
import homepic5 from "../../images/d.jpg";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {useLogout} from './authUtils';

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

// const SplineViewer = () => {
//     return (
//         <spline-viewer url="https://prod.spline.design/lrHfYnrgkXDusItV/scene.splinecode"></spline-viewer>
//     );
// };
//
// export {SplineViewer};

const PictureGrid = () => {
    // Replace these src paths with your actual image paths
    const imageSrcs = [
        homepic,
        homepic2,
        homepic3,
        homepic4,
        homepic2,
        homepic3,
        homepic4,
        homepic4,
    ];

    return (
        <div className="grid grid-cols-4 gap-4 p-4 w-full h-full justify-center item-center">
            {imageSrcs.map((src, index) => (
                <div key={index} className="w-full h-[200px] overflow-hidden rounded-lg">
                    <img
                        src={src}
                        alt={`Picture ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export {PictureGrid};

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array holding images and text content for each slide
    const slides = [
        {
            image: homepic2,
            text: {
                title: 'Professional Hairdressing',
                description: 'Get the latest styles and trends from our expert stylists.',
            },
        },
        {
            image: homepic,
            text: {
                title: 'Luxury Manicures',
                description: 'Pamper yourself with our range of nail services.',
            },
        },
        {
            image: homepic2,
            text: {
                title: 'Relaxing Spa Treatments',
                description: 'Indulge in our soothing spa treatments for ultimate relaxation.',
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
        <div className="relative w-[90%] h-full overflow-hidden">
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


const Card = () => {
    return (
        <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            {/* Image Section */}
            <img
                className="w-1/3 h-auto object-cover"
                src={logo}
                alt="Testimonial image"
            />
            {/* Text Section */}
            <div className="flex-1 p-4">
                <p className="text-gray-700">
                    "This is a testimonial text that highlights the service or product experience. It's an example of
                    how users might review or comment on the service."
                </p>
            </div>
        </div>
    );
};

export {Card};

const InfoCards = () => {
    const cards = [
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Hair Dresser",
            text: "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.",
        },
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Hair Dresser",
            text: "Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
        },
        {
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
            heading: "Hair Dresser",
            text: "Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-[60%] justify-center content-center">
            {cards.map((card, index) => (
                <div key={index}
                     className=" bg-white content-center rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
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

function ChatComponent() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting message:', message); // Log message to be sent

        // Add the user's message to the chat
        setMessages([...messages, {text: message, type: 'user'}]);

        try {
            const res = await fetch('http://localhost:3001/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({message}),
            });

            console.log('Response status:', res.status); // Log response status
            const data = await res.json();
            console.log('Response data:', data); // Log response data

            // Add the chatbot's response to the chat
            setMessages([...messages, {text: message, type: 'user'}, {text: data.response, type: 'bot'}]);
        } catch (error) {
            console.error('Error submitting message:', error);
            setResponse('Error communicating with the server.');
        }

        // Clear the input field after submitting
        setMessage('');
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div
                className="w-full max-w-md rounded-lg shadow-lg p-6 flex flex-col h-full"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(50px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                <div className="flex-grow overflow-y-auto mb-4">
                    {/* Displaying messages */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message p-3 mb-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-700 self-start'}`}
                        >
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label htmlFor="message" className="text-gray-700 mb-2">Ask a question:</label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        className="p-2 mb-2 border border-gray-300 rounded-md text-gray-700"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
    );
}

export {ChatComponent};


// Navbar Component
function Navbar() {
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    const logout = useLogout(); // Using the custom hook

    const [cookieExists, setCookieExists] = React.useState(false);

    React.useEffect(() => {
        const cookie = Cookies.get('diamond');
        setCookieExists(!!cookie);
    }, []);


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
                                <Link to="/products"
                                      className="julius-sans-one-regular text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Products</Link>

                                <div>

                                    <a className="nav-link text-white julius-sans-one-regular dropdown-toggle"
                                       href="http://example.com" id="dropdown07"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Menu</a>
                                    <div className="dropdown-menu" aria-labelledby="dropdown07">
                                        {cookieExists ? (
                                            <>
                                                <a className="dropdown-item julius-sans-one-regular" href="#">Cart</a>
                                                <a className="dropdown-item julius-sans-one-regular"
                                                   href="/userp">Profile</a>
                                                <a className="dropdown-item julius-sans-one-regular"
                                                   href="/supporthome">Support</a>
                                                <a className="dropdown-item julius-sans-one-regular" href="#"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       logout();
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


const Home = () => {
    // const [cookieExists, setCookieExists] = useState(false);
    // const navigate = useNavigate();
    //
    // useEffect(() => {
    //     // Check if the session cookie exists
    //     const cookie = Cookies.get('diamond');
    //     setCookieExists(!!cookie);
    //
    //     if (!cookie) {
    //         window.location.reload(); // Refresh the page if the cookie is not found
    //     }
    // }, []);


    return (
        <div className="homepage1 felx flex-col" style={{backgroundColor: "#E8ECEF", height: "100vh"}}>
            <div className="flex">
                <Navbar/>
            </div>


            <div
                className=" flex flex-row h-[700px] justify-center items-center w-full bg-cover bg-center"
                id="home"

                style={{
                    backgroundImage: `url(${homepic4})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}

            >

                <div className="App flex order-2 w-[50%] h-80% justify-center items-center">
                    <Carousel/>


                </div>
                <div className="flex order-1 w-[50%] h-full justify-center items-center">
                    <div className="w-[80%] h-[80%] flex flex-col px-10 justify-center items-start ">
                        <h1 className="text-white text-7xl julius-sans-one-regular">SALON DIAMOND</h1>
                        <p className="text-white text-2xl pl-2 text-neutral-700">By Sashra Rajapaksha</p>

                    </div>
                </div>

            </div>


            <div className="homepage1 bg-white h-[800px] flex flex-col" id="gallery">
                <h1 className="text-5xl julius-sans-one-regular pt-12 pb-4 pl-4">Gallery</h1>
                <PictureGrid/>
            </div>


            <div className=" h-[800px] flex flex-col space-x-5 bg-pink-500 " id="testimonials"

                 style={{
                     backgroundImage: `url(${homepic5})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}
            >
                <h1 className="text-5xl julius-sans-one-regular pt-12 pb-4 pl-4">Testimonials</h1>

                <div className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Render 6 cards */}
                        {[...Array(6)].map((_, index) => (
                            <Card key={index}/>
                        ))}
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
                        <ChatComponent/>
                    </div>
                </div>


            </div>


            <div className="flex flex-col h-[800px] justify-center items-center" id="profile"
                 style={{
                     backgroundImage: `url(${homepic4})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}
            >
                <InfoCards/>
            </div>


            <div className="bg-white flex flex-row w-full " id="profile">
                <div className="bg-gray-900 text-white flex w-full flex-col items-center justify-center py-8">
                    <h1 className="text-2xl font-bold mb-4 julius-sans-one-regular">Salon Diamond</h1>
                    <p className="text-lg mb-2">Your ultimate destination for luxurious hair and beauty treatments.</p>
                    <div className="flex gap-4 mb-4">
                        <a href="tel:+1234567890" className="hover:underline">Call Us: 081 111 111 1</a>
                        <a href="mailto:info@salondiamond.com" className="hover:underline">Email:
                            info@salondiamond.com</a>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <a href="#" className="hover:text-gray-400">Facebook</a>
                        <a href="#" className="hover:text-gray-400">Instagram</a>
                        <a href="#" className="hover:text-gray-400">Twitter</a>
                        <a href="/admin-users" className="hover:text-gray-400">Admin</a>
                    </div>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Salon Diamond. All rights
                        reserved.</p>
                </div>
            </div>


        </div>
    )
        ;
};

export default Home;
