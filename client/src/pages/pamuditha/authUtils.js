import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Custom hook for logout
export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Perform logout logic
        Cookies.remove('diamond'); // Remove the cookie
        navigate('/'); // Navigate to home page after logout
    };

    return logout;
};
