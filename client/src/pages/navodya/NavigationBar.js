import { Link } from "react-router-dom";

const NavigationBar = ({ activeTab }) => {
  return (
    <div className="relative flex flex-row items-start p-[2px] bg-gray-300 rounded-lg mb-6">
      <Link
        to="/"
        className={`relative flex items-center justify-center w-[130px] h-[28px] text-sm cursor-pointer opacity-60 z-[999] ${
          activeTab === 1 ? "font-bold" : ""
        }`}
      >
        Services
      </Link>

      <Link
        to="/professional"
        className={`relative flex items-center justify-center w-[130px] h-[28px] text-sm cursor-pointer opacity-60 z-[999] ${
          activeTab === 2 ? "font-bold" : ""
        }`}
      >
        Professional
      </Link>

      <Link
        to="/data&time"
        className={`relative flex items-center justify-center w-[130px] h-[28px] text-sm cursor-pointer opacity-60 z-[999] ${
          activeTab === 3 ? "font-bold" : ""
        }`}
      >
        Date & Time
      </Link>

      <Link
        to="/confirm"
        className={`relative flex items-center justify-center w-[130px] h-[28px] text-sm cursor-pointer opacity-60 z-[999] ${
          activeTab === 4 ? "font-bold" : ""
        }`}
      >
        Confirm
      </Link>

      {/* Add more links as needed */}
    </div>
  );
};

export default NavigationBar;
