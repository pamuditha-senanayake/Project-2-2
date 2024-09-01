import React from 'react';
import Navigation from './nav';
import homepic4 from "../../images/5.jpg"; // Adjust the path if necessary
import homepic3 from "../../images/a.jpg";

const userp = () => {
    return (
        <div className="flex flex-col h-screen w-full julius-sans-one-regular"
             style={{
                 backgroundImage: `url(${homepic4})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}
        >
            <Navigation/>

            <div className="flex items-center justify-center w-full h-screen mt-[20px]">
                <div className="flex flex-row w-[70%] h-[80%] space-x-2 border-2 rounded-2xl py-3 px-3">
                    <div className="flex flex-col w-full h-full">
                        <div className="flex order-1 w-full h-[20%] bg-blue-950 rounded-2xl mb-2">
                            <div className="w-full h-full rounded-lg shadow-lg flex flex-wrap">

                                <div className="w-full md:w-1/2 flex items-center justify-center">
                                    <img src={homepic3} alt="Uploaded Photo"
                                         className="rounded-full w-24 h-24 object-cover shadow-lg"/>
                                </div>


                                <div className="w-full md:w-1/2 flex items-center justify-center">
                                    <label htmlFor="upload"
                                           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
                                        Upload Image
                                    </label>
                                    <input type="file" id="upload" className="hidden"/>
                                </div>
                            </div>
                        </div>

                        <div className="flex order-2 w-full h-[80%] bg-pink-700 rounded-2xl">

                            <div className="max-w-4xl mx-auto p-8 rounded-lg text-white">
                                <div className="flex flex-wrap -mx-4">

                                    <div className="w-full md:w-1/2 px-4 mb-6">
                                        <div>
                                            <label htmlFor="firstName" className="block font-bold mb-2">First
                                                Name</label>
                                            <input type="text" id="firstName"
                                                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   placeholder="John"/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="lastName" className="block font-bold mb-2">Last
                                                Name</label>
                                            <input type="text" id="lastName"
                                                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   placeholder="Doe"/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="phoneNumber" className="block font-bold mb-2">Phone
                                                Number</label>
                                            <input type="tel" id="phoneNumber"
                                                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   placeholder="+1 234 567 890"/>
                                        </div>
                                    </div>


                                    <div className="w-full md:w-1/2 px-4 mb-6">
                                        <div>
                                            <label htmlFor="address"
                                                   className="block font-bold mb-2">Address</label>
                                            <input type="text" id="address"
                                                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   placeholder="123 Main St"/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="email"
                                                   className="block font-bold mb-2">Email</label>
                                            <input type="email" id="email"
                                                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   placeholder="you@example.com"/>
                                        </div>
                                        <div className="mt-8">
                                            <button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-[30%] h-full rounded-2xl justify-between bg-pink-300 px-2 pt-3">
                        <h1 className="julius-sans-one-regular text-3xl ">Do you want to delete the profile? </h1>
                        <button
                            className="bg-pink-600 julius-sans-one-regular hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out mt-auto">
                            Delete
                        </button>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default userp;
