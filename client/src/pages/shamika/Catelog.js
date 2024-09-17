import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from "../../images/5.jpg";
import bookImage from "../../images/book.png";
import billImage from "../../images/bill.png";
import serviceImage from "../../images/services.png";
import productImage from "../../images/product.png";
import technicalImage from "../../images/technical.png";

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
                    <div className="flex flex-row w-[25%] h-[700px] bg-opacity-70">
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


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                );
                }

                export default Catelog;
