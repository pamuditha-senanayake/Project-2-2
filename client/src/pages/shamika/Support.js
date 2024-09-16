import React from "react";
import backgroundImage from "../../images/5.jpg";


export default function Support() {
    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div
                    className="left-div flex flex-col w-[60%] h-full justify-center pl-6 pamlogin1"
                    style={{
                        background: 'rgba(87, 40, 215, 0.2)',
                        borderRadius: '0',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >

                    <h1 className="lg:mx-20 text-3xl  justify-center text-white julius-sans-one-regular font-bold mb-10">Customer
                        Support</h1>
                    <h3 className="lg:mx-20 text-1xl  text-white julius-sans-one-regular mb-4 ">Welcome to
                        Our Customer  Support!</h3>

                    <p className="flex 1 lg:mx-20  julius-sans-one-regular text-gray-700 text-1xl text-rgb255 mb-4">Thank you for reaching
                        out to us.
                        At Salon Diamond, we are dedicated to providing you with the best possible service and support.
                        Whether you have questions, need assistance, our team is here to help you every step of the
                        way.</p>
<p></p>
                    <p className="lg:mx-20  julius-sans-one-regular  text-1xl text-gray-700 text-rgb255 mb-4">Please explore our
                        resources and
                        get in touch with us through the contact options available.
                        We value your time and are committed to ensuring your experience with us is nothing short of
                        exceptional.</p>

                    <p className="lg:mx-20  julius-sans-one-regular  text-2xl text-rgb255 font-bold mb-5 ">Get started!</p>
                    <div className="flex space-x-4 pl-12">
                    <a
                        href="/ticket"
                        className="flex  items-center justify-center h-10 julius-sans-one-regular w-25 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                    >
                        New Ticket
                    </a>

                     </div>
                </div>
            </div>
        </div>
    );
};
