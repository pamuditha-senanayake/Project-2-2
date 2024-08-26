import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";

const SelectProfessional = () => {
    const location = useLocation();
    const { selectedServices } = location.state || { selectedServices: [] };
    const [selectedProfessional, setSelectedProfessional] = useState(null);
  
    const professionals = [
      { id: 1, name: "Any Professional", description: "for maximum availability", icon: "👤" },
      { id: 2, name: "Select Professional per service", description: "Coming Soon", icon: "➕" },
      { id: 3, name: "Name Coming Soon", description: "Coming Soon", icon: "🔜" },
      { id: 4, name: "Name Coming Soon", description: "Coming Soon", icon: "🔜" },
      { id: 5, name: "Name Coming Soon", description: "Coming Soon", icon: "🔜" },
      { id: 6, name: "Name Coming Soon", description: "Coming Soon", icon: "🔜" },  
    ];
  
    const handleProfessionalSelect = (professional) => {
      setSelectedProfessional(professional);
    };
  
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-100 p-4">
        {/* Navigation Bar */}
        <NavigationBar activeTab={2} />
  
        <div className="flex flex-col md:flex-row w-full mt-4">
          {/* Left side - Professional Selection */}
          <div className="w-full md:w-2/3 bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">Select Professional</h2>
            <div className="grid grid-cols-2 gap-4">
              {professionals.map((professional) => (
                <button
                  key={professional.id}
                  onClick={() => handleProfessionalSelect(professional)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  <span className="text-3xl">{professional.icon}</span>
                  <h3 className="text-lg font-semibold mt-2">{professional.name}</h3>
                  <p className="text-sm">{professional.description}</p>
                </button>
              ))}
            </div>
          </div>
  
          {/* Right side - Summary */}
          <div className="w-full md:w-1/3 bg-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Salon Diamond</h2>
            {selectedServices.map((service) => (
              <div key={service.id} className="mb-2">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p>LKR {service.price}</p>
                <p>{service.duration}</p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="text-lg">
              <p>With Name: {selectedProfessional ? selectedProfessional.name : "(Professional's name)"}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p>Total</p>
              <p>4 Hours</p>
              <p>
                LKR{" "}
                {selectedServices.reduce(
                  (total, service) => total + service.price,
                  0
                )}
              </p>
            </div>
            <button
              className="w-full mt-6 bg-black h-[50px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SelectProfessional;
  
