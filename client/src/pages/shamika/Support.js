
import React from "react";


export default function Support() {
    return (
        <div>
            <h1 className="lg:mx-32 text-5xl font-bold text-orange-500">Customer Support</h1>
            <h3 className="lg:mx-32 text-2xl opacity-40 py-6">Welcome to Our Customer Support!</h3>

            <p className="lg:mx-32 opacity-30 py-1">Thank you for reaching out to us. At Salon Diamond, we are dedicated
                to providing you with the best possible service and support.
                Whether you have questions, need assistance, our team is here to help you every step of the way.</p>

            <p className="lg:mx-32 opacity-30 py-1">Please explore our resources and get in touch with us through the
                contact options available.
                We value your time and are committed to ensuring your experience with us is nothing short of
                exceptional.</p>

            <p className="lg:mx-32 opacity-30 py-2">Get started!</p>

            <a
                href="/ticket"
                className="lg:mx-32 bg-yellow-600 hover:bg-amber-200 text-black font-medium py-3 px-6 rounded-md"
            >
                NEW SUPPORT TICKET
            </a>


            <button
                className="lg:mx-32 bg-yellow-600 hover:bg-green-700 text-black font-medium py-3 px-6 rounded-md">{""}CHECK
                TICKET STATUS

            </button>


        </div>
    )
}
