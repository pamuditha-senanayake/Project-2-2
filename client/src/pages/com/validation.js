//User_validation

import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const navigate = useNavigate();

useEffect(() => {
    const checkUser = async () => {
        try {
            const response = await fetch('https://servertest-isos.onrender.com/api/user/verify', {
                credentials: 'include' // Include credentials with the request
            });

            if (response.status === 403 || response.status === 401) {
                navigate('/'); // Redirect if not authorized
                return;
            }

            const data = await response.json();
            if (!data.isUser) {
                navigate('/'); // Redirect if the user is not an admin
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/'); // Redirect in case of an error
        }
    };

    checkUser();
}, [navigate]);


//Admin validation

//const navigate = useNavigate();

useEffect(() => {
    const checkAdmin = async () => {
        try {
            const response = await fetch('https://servertest-isos.onrender.com/api/user/admin', {
                credentials: 'include' // Include credentials with the request
            });

            if (response.status === 403 || response.status === 401) {
                navigate('/'); // Redirect if not authorized
                return;
            }

            const data = await response.json();
            if (!data.isAdmin) {
                navigate('/'); // Redirect if the user is not an admin
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/'); // Redirect in case of an error
        }
    };

    checkAdmin();
}, [navigate]);


//userId filtering
router.get("/profile", async (req, res) => {
    //res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (!req.isAuthenticated()) {
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        // const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        // if (result.rows.length > 0) {
        //     res.json(result.rows[0]);
        // } else {
        //     res.status(404).json({message: "User not found"});
        // }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({message: "Server error"});
    }
});

