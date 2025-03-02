import Cookies from 'js-cookie';
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import logo from "../../images/logo.jpeg";

import homepic from "../../images/home.jpg";
import homepic2 from "../../images/c.jpg";
import amali from "../../images/amali.jpg"
import susila from "../../images/sumudu.webp";
import muta from "../../images/muta.jpg";
import buta from "../../images/buta.jpg";
import piyath from "../../images/piyath.jpeg";
import kota from "../../images/kota.jpg";
import homepic6 from "../../images/e.jpg";
import homepic7 from "../../images/f.jpg";
import bride from "../../images/file.png";

import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {useLogout} from './authUtils';
import Navbar from './nav';


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
        lat: 7.288941287673795,
        lng: 80.62935649554917,

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


        kota,
        buta,
        muta,
        homepic2
    ];

    return (
        <div className="grid grid-cols-3 gap-x-4" style={{rowGap: '20px'}}> {/* Adjust rowGap value as needed */}
            {imageSrcs.map((src, index) => (
                <div key={index}
                     className="test1 w-full h-[250px] overflow-hidden rounded-lg border border-gray-300">
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


const Card = () => {
    return (
        <div className="test1 flex border w-[360px] h-[180px] border-gray-300 rounded-lg overflow-hidden shadow-lg">
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
            imgSrc: susila, // Removed the image source
            heading: "Sophia Turner - Senior Hair Stylist",
            text: "Sophia has over 10 years of experience in hair styling and coloring. She specializes in balayage techniques and has a passion for creating stunning transformations. Sophia believes in personalized consultations to achieve the best results for her clients."
        },
        {
            imgSrc: piyath, // Removed the image source
            heading: "James Smith - Barber and Grooming Expert",
            text: "James is a skilled barber with 7 years of experience in men’s grooming. He excels in modern haircuts and classic shaves, ensuring a refined and stylish look for every client. His friendly demeanor makes every visit enjoyable."
        },
        {
            imgSrc: amali, // Removed the image source
            heading: "Emily Johnson - Makeup Artist",
            text: "Emily is a certified makeup artist with 5 years of experience in bridal and special event makeup. She uses high-quality products to create beautiful, long-lasting looks that enhance her clients' natural beauty. Emily loves helping clients feel confident and radiant."
        }

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
            const res = await fetch('https://servertest-isos.onrender.com/ask', {
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
        <div className="flex flex-col items-center h-full">
            <div className="mb-10 justify-center content-center">
                <button
                    className="glow-on-hover julius-sans-one-regular justify-center content-center pt-3 flex flex-row"
                    type="button">


                    {/*<img src={star} alt="Icon" className="icon w-[20px]"/>*/}
                    <b>AI</b>
                    -Powered

                </button>

            </div>
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
                <div className="flex-grow overflow-y-auto mb-4 ">
                    {/* Displaying messages */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message p-3 mb-2 rounded-lg ${msg.type === 'user' ? 'bg-pink-500 text-white self-end' : 'bg-gray-200 text-gray-700 self-start'}`}
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
                        className="bg-black text-white p-2 rounded-md hover:bg-pink-700 transition-colors"
                    >
                        GO
                    </button>
                </form>
            </div>
        </div>
    );
}

export {ChatComponent};


const Home = () => {


    return (
        <div className=" felx flex-col" style={{height: "100vh"}}>
            <div className="flex">
                <Navbar/>
            </div>


            <div
                className=" flex flex-row h-[1000px] justify-center items-center w-full bg-cover bg-center"
                id="home"

                style={{
                    backgroundImage: `url(${homepic6})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}

            >

                <div className="App flex order-2 w-[50%] h-[80%] justify-center items-center">
                    <div className="relative bride-image-container">
                        <img
                            src={bride}
                            alt="Bride"
                            className="bride-image block"
                        />
                    </div>
                </div>


                <div className="flex order-1 w-[50%] h-full justify-center items-center">
                    <div className="w-[80%] h-[80%] flex flex-col px-10 justify-center items-start">

                        <h1 className=" text-8xl julius-sans-one-regular">SALON DIAMOND</h1>
                        <p className="text-2xl pl-2 julius-sans-one-regular">By Sashra Rajapaksha</p>
                        <p className="text-sm text-gray-400 pl-2 pt-2">
                            Discover elegance and style at Salon Diamond, where beauty meets luxury.
                            Specializing in exquisite hairdressing, makeup, and pampering treatments,
                            we create a serene oasis for modern women seeking the ultimate in self-care.
                        </p>
                        <div className="mt-6 flex space-x-4 julius-sans-one-regular">
                            <Link to="/ProductList">
                                <button className="mx-0 custom-button">Shop Now</button>
                            </Link>
                            <Link to="/services">
                                <button className="mx-0 custom-button2">Appointments</button>
                            </Link>
                        </div>
                    </div>
                </div>


            </div>


            <div
                className=" h-[1500px] flex flex-col items-center justify-center"
                id="gallery"
                style={{
                    backgroundImage: `url(${homepic7})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    className="flex flex-col items-center text-center w-full max-w-5.5xl px-4 py-6 ">
                    <div className="flex-col w-[50%]">
                        <h1 className="text-7xl julius-sans-one-regular mb-6">Gallery</h1>
                        <p className="text-sm text-gray-600 mb-20">
                            Discover our collection of stunning images that showcase the essence of our work. Each
                            picture
                            tells a story and highlights the beauty and detail of our projects. Browse through our
                            gallery
                            to see the craftsmanship and creativity that define our brand.
                        </p>
                    </div>


                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-full max-w-6xl h-auto">
                            <PictureGrid/>
                        </div>
                    </div>
                </div>
            </div>


            <div
                className="homepage1 h-[1200px] flex flex-col items-center justify-center"
                id="testimonials"
                style={{
                    backgroundImage: `url(${homepic6})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    className="flex flex-col items-center text-center w-full max-w-5.5xl px-4 py-6">
                    <h1 className="text-7xl julius-sans-one-regular mb-6 ">Testimonials</h1>
                    <p className="text-sm text-gray-600 mb-12 w-[65%]">
                        Hear what our clients have to say about us. Their feedback reflects our commitment to delivering
                        exceptional service and quality. Read their stories and see why we are trusted by so many.
                    </p>
                    <div className="flex">
                        <button
                            onClick={() => (window.location.href = '/testimonials')}
                            className="julius-sans-one-regular mb-3 bg-black w-[100px] backdrop-blur-md text-white font-semibold rounded-lg shadow-lg border border-black/20 hover:bg-black/40 transition duration-300">
                            See More
                        </button>
                    </div>


                    <div className="w-[80%] flex justify-center">
                        <div className="w-full max-w-6xl">
                            <div className="grid grid-cols-3 gap-4">
                                {[...Array(6)].map((_, index) => (
                                    <Card key={index}/>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div className="bg-white h-[1200px] " id="about"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}

            >


                <div className="flex flex-row h-full justify-between w-full pr-10">
                    <div className="w-[50%] flex items-center justify-center h-full">
                        <div className="w-[80%] h-[80%]">
                            <MapComponent/>
                        </div>
                    </div>
                    <div className="w-[50%] flex items-center justify-center h-full pt-5 pb-5">
                        <div className="w-[90%] h-[50%] ">


                            <ChatComponent/>
                        </div>
                    </div>
                </div>


            </div>


            <div className="flex flex-col h-[1000px] justify-center items-center" id="profile"
                 style={{
                     backgroundImage: `url(${homepic6})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}
            >
                <div className="flex flex-row w-[80%] justify-center items-center">
                    <InfoCards/>
                </div>

            </div>


            <div className="bg-white flex flex-row w-full" id="profile">
                <div className="bg-black text-white flex w-full flex-col items-center justify-center py-8">
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
                        <a href="/adminhome" className="hover:text-gray-400">Admin</a>
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
