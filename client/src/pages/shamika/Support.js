import React from "react";
import backgroundImage from "../../images/a2.jpg";


export default function Support() {
    return (

        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
            <div className="flex flex-row w-[70%] h-[600px] bg-opacity-70">
                <div className="flex flex-col w-[50%] h-full justify-center pl-9"
                     style={{
                         background: 'rgba(87, 40, 215, 0.2)',
                         borderRadius: '16px',
                         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                         backdropFilter: 'blur(5px)',
                         WebkitBackdropFilter: 'blur(5px)',
                         border: '1px solid rgba(255, 255, 255, 0.3)',
                     }}
                >
                    <h1 className="lg:mx-32 text-5xl  julius-sans-one-regular font-bold text-orange-500">Customer
                        Support</h1>
                    <h3 className="lg:mx-32 text-2xl  julius-sans-one-regular opacity-40 py-6">Welcome to Our Customer
                        Support!</h3>

                    <p className="lg:mx-32  julius-sans-one-regular opacity-30 py-1">Thank you for reaching out to us.
                        At Salon Diamond, we are dedicated to providing you with the best possible service and support.
                        Whether you have questions, need assistance, our team is here to help you every step of the
                        way.</p>

                    <p className="lg:mx-32  julius-sans-one-regular opacity-30 py-1">Please explore our resources and
                        get in touch with us through the contact options available.
                        We value your time and are committed to ensuring your experience with us is nothing short of
                        exceptional.</p>

                    <p className="lg:mx-32  julius-sans-one-regular opacity-30 py-2">Get started!</p>

                    <a
                        href="/ticket"
                        className="lg:mx-32 bg-yellow-600 hover:bg-amber-200  julius-sans-one-regular text-black font-medium py-3 px-6 rounded-md"
                    >
                        NEW SUPPORT TICKET
                    </a>


                    <button
                        className="w-full py-2 px-4 julius-sans-one-regular bg-neutral-800  julius-sans-one-regular text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >{""}MY TICKET

                    </button>


                </div>
            </div>
        </div>


    )
}
