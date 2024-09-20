import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from "../../images/5.jpg";
import bookImage from "../../images/book.png";
import billImage from "../../images/bill.png";
import serviceImage from "../../images/services.png";
import productImage from "../../images/product.png";
import technicalImage from "../../images/technical.png";
import { useNavigate } from 'react-router-dom';



function Catelog() {
    const [ticket, setTicket] = useState({
        category: '',
        catalog: '',
    });

    const navigate = useNavigate();

    // Mapping of categories to catalogs
    const categoryToCatalogMap = {
        'Booking and Appointment Issues': 'Catelog 1',
        'Payment and Billing Concerns': 'Catelog 2',
        'Service-Related Complaints': 'Catelog 3',
        'Technical Problems with the Online Platform': 'Catelog 4',
        'Product Inquiries and Issues': 'Catelog 5',
    };

    // Handle change in dropdown selection
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state with the selected category and corresponding catalog
        setTicket((prevTicket) => ({
            ...prevTicket,
            [name]: value,
            catalog: categoryToCatalogMap[value], // Automatically set the catalog based on the selected category
        }));
    };

    // Handle form submission to navigate to the next page with the data
    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to the next page and pass the selected category and catalog
        navigate('/myticket', { state: ticket });
    };


    return (

          <div
              className="flex flex-col items-center justify-center h-screen bg-white"
              style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
              }}
          >
              <div className="flex flex-row w-[75%] h-[450px] bg-opacity-70">
                  {Array(5).fill(null).map((_, index) => (
                      <div
                          key={index}
                          className="flex flex-col w-[25%] h-full justify-center pl-6 text-center"
                          style={{
                              background: 'rgba(87, 40, 215, 0.2)',
                              borderRadius: '0',
                              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                              backdropFilter: 'blur(5px)',
                              WebkitBackdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                          }}
                      >
                          <div
                              className="lg:mx-10 text-1xl justify-items-stretch text-black julius-sans-one-regular font-bold mb-12">
                              {/* Adding different content for each division */}
                              {index === 0 && <div><h2 class="julius-sans-one-regular text-2xl font-bold">Catelog 1</h2>
                                  <p>step 1:</p>
                                  <p>step 1:</p></div>}
                              {index === 1 &&
                                  <div><h2 class="julius-sans-one-regular text-2xl font-bold">Catelog 2</h2><p>Content
                                      for division 2</p></div>}
                              {index === 2 &&
                                  <div><h2 class="julius-sans-one-regular text-2xl font-bold">Catelog 3</h2><p>Content
                                      for division 3</p></div>}
                              {index === 3 &&
                                  <div><h2 class="julius-sans-one-regular text-2xl font-bold">Catelog 4</h2><p>Content
                                      for division 4</p></div>}
                              {index === 4 &&
                                  <div><h2 class="julius-sans-one-regular text-2xl font-bold">Catelog 5</h2><p>Content
                                      for division 5</p></div>}
                          </div>
                      </div>
                  ))}
                  <div className="relative min-h-screen"></div>
                  <a
                      href="/myticket"
                      className="flex items-center justify-center h-8 julius-sans-one-regular w-40 bg-pink-500 text-white border-[1px]  rounded-lg  transition-transform transform hover:translate-y-[-2px] hover:shadow-xl hover:translate-x-[-5px]"
                  >
                      Back
                  </a>

              </div>

          </div>

      );
}

export default Catelog;
