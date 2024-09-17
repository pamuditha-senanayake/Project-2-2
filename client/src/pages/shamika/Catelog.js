import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from "../../images/5.jpg";
import bookImage from "../../images/book.jpg";
import billImage from "../../images/bill.jpg";


function Catelog() {

      return (

        <div
            className="flex flex-col items-center justify-center h-screen bg-white"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex flex-row w-[70%] h-[700px] bg-opacity-70">
                <div
                    className="left-div flex flex-col w-[25%] h-full justify-center pl-6 pamlogin1"
                    style={{
                        background: 'rgba(87, 40, 215, 0.2)',
                        borderRadius: '0',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    <div className="flex flex-row w-[70%] h-[700px] bg-opacity-70">
                        <div
                            className="right-div flex flex-col w-[25%] h-full justify-center pl-6 pamlogin1"
                            style={{
                                background: 'rgba(87, 40, 215, 0.2)',
                                borderRadius: '0',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >

                            <div className="App">
                                <h1 className="lg:mx-10 justify-center julius-sans-one-regular text-3xl font-bold text-rgb255 mb-4">New
                                    Customer Support Ticket
                                </h1>
                                <div
                                    className="lg:mx-10 text-1xl justify-items-stretch text-black julius-sans-one-regular font-bold mb-12">
                                    <form onSubmit={handleSubmit}
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'flex-start',
                                              textAlign: 'left'
                                          }}>
                                        {/* Automatically Generated Ticket No */}
                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Ticket No.:</label>
                                            <input
                                                type="text"
                                                name="ticket_no"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.ticket_no}
                                                readOnly // Make sure it's read-only so the user can't modify it
                                            />
                                        </div>

                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Customer ID:</label>
                                            <input
                                                type="text"
                                                name="customer_id"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.customer_id}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Email:</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className=" w-full px-3 py-1 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Contact No:</label>
                                            <input
                                                type="text"
                                                name="contact_no"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.contact_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Category:</label>
                                            <select
                                                name="category"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.category}
                                                onChange={handleChange}
                                            >
                                                <option value="Booking and Appointment Issues">Booking and Appointment
                                                    Issues
                                                </option>
                                                <option value="Payment and Billing Concerns">Payment and Billing
                                                    Concerns
                                                </option>
                                                <option value="Service-Related Complaints">Service-Related Complaints
                                                </option>
                                                <option value="Technical Problems with the Online Platform">Technical
                                                    Problems
                                                    with the Online Platform
                                                </option>
                                                <option value="Product Inquiries and Issues">Product Inquiries and
                                                    Issues
                                                </option>
                                            </select>
                                        </div>
                                        <div style={{marginBottom: '1rem'}}>
                                            <label style={{marginBottom: '0.5rem'}}>Inquiry Description (Max 100
                                                characters):</label>

                                            <input
                                                type="text"
                                                name="inquiry_description"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={ticket.inquiry_description}
                                                onChange={handleChange}
                                                maxLength="400"
                                                required
                                            />
                                        </div>
                                        <div style={{marginBottom: '0.5rem'}}>
                                            <label style={{width: '150px', marginBottom: '0.5rem'}}>Date:</label>
                                            <input
                                                type="text"
                                                name="current_date"
                                                className="block w-full px-3 py-1 border julius-sans-one-regular h-8 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={currentDate}
                                                readOnly
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="lg:mx-20 flex 1 space-x-4 pl-12 mb-1">
                                                                                     <a
                                                href="/myticket"
                                                className="flex items-center justify-center h-8 julius-sans-one-regular w-40 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                                            >
                                                Back
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                );
                }

                export default Catelog;
