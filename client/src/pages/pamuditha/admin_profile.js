import React, {useEffect, useState} from 'react';
import Sidebar from '../com/admindash';
import {useNavigate} from 'react-router-dom';
import homepic7 from "../../images/f.jpg";
import homepic3 from "../../images/a.jpg";
import Swal from "sweetalert2";
import homepic8 from "../../images/d.jpg";


const UserProfile = () => {

    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeButton, setActiveButton] = useState('profile');
    const [profilePic, setProfilePic] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);

    const [formData, setFormData] = useState({

        firstname: '',
        lastname: '',
        phone_number: '',
        address: '',
        email: '',
    });


    const navigate = useNavigate();


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


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user data:', data);
                    setUserData(data);

                    setFormData({
                        firstname: data.firstname || '',
                        lastname: data.lastname || '',
                        phone_number: data.phone_number || '',
                        address: data.address || '',
                        email: data.email || '',
                    });

                    // Fetch profile picture
                    fetchProfilePicture(data.id); // Assuming you have an ID field in userData
                } else {
                    console.error('Failed to fetch user data, status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchProfilePicture = async (userId) => {
            try {
                const response = await fetch(`https://servertest-isos.onrender.com/api/user/profile2`, { // Adjust this endpoint as needed
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfilePic(data.image); // Assuming image is the field in the response
                } else {
                    console.error('Failed to fetch profile picture, status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };


    const handleUpdate = async () => {
        try {
            const response = await fetch(
                `https://servertest-isos.onrender.com/api/user/update/${userData.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Updated user data:', updatedUser);
                setUserData(updatedUser.user);
                setIsEditing(false);
            } else {
                console.error('Failed to update user, status:', response.status);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(
                            `https://servertest-isos.onrender.com/api/user/delete/${userData.id}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                            }
                        );

                        if (response.ok) {
                            swalWithBootstrapButtons.fire({
                                title: 'Deleted!',
                                text: 'Your profile has been deleted.',
                                icon: 'success',
                            }).then(() => {
                                navigate('/');
                            });
                        } else {
                            console.error(
                                'Failed to delete user, status:',
                                response.status
                            );
                        }
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelled',
                        text: 'Your profile is safe :)',
                        icon: 'error',
                    });
                }
            });
    };

    const handleReset = () => {
        navigate('/reset');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);

        if (buttonName === 'profile') {
            navigate('/userp'); // Adjust with your actual route
        } else if (buttonName === 'appointments') {
            navigate('/myappointment2'); // Adjust with your actual route
        } else if (buttonName === 'payment') {
            navigate('/wallet2'); // Adjust with your actual route
        }
    };

    // Handle profile picture upload
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) { // Corrected line
            const file = e.target.files[0]; // Access the file directly from the event target
            setImageBlob(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePic(e.target.result); // Update the preview
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to upload profile picture
    const handleUploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', imageBlob);

            const response = await fetch('https://servertest-isos.onrender.com/api/user/upload-profile-image', {
                method: 'POST',
                body: formData,
                credentials: 'include', // Include credentials for authentication
                headers: {
                    'Accept': 'application/json', // Set acceptable response format
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfilePic(data.imageUrl); // Update the profilePic state
            } else {
                console.error('Error uploading image:', response.statusText);
                alert('Error uploading image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };


    return (
        <div className="flex h-screen">
            <div className="w-[20%] h-full text-white"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>
                <Sidebar/>
            </div>
            <div className="w-[80%] h-full bg-pink-500 p-4 julius-sans-one-regular"
                 style={{
                     backgroundImage: `url(${homepic7})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                 }}>

                <div>
                    <h1 className="julius-sans-one-regular text-3xl">Admin Profile</h1>
                </div>
                <div
                    className="flex flex-row w-[90%] h-[90%] space-x-2 border-2 rounded-2xl py-3 px-3  bg-white overflow-hidden">
                    {/* Left Side */}
                    <div className="flex flex-col w-[20%] h-full rounded-2xl border-2">
                        <p className="p-4 text-3xl">Menu</p>

                        <div className="flex flex-col space-y-4 p-4">
                            <button
                                className={`${
                                    activeButton === 'profile' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('profile')}
                            >
                                Profile
                            </button>


                            {/* Delete Button */}
                            <button
                                className="text-red-600 font-normal py-2 px-4 rounded-full hover:bg-pink-200 focus:outline-none"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col w-full h-full">
                        {/* Top Side */}
                        <div>
                            <h2 className="text-3xl mt-2">Profile </h2>
                        </div>


                        <div className="flex order-1 w-full h-[200px] border-2 mb-2">
                            {/*<p className="p-4">Top Section</p>*/}
                            <div
                                className="w-full flex-row h-full flex items-center justify-center"
                                style={{
                                    backgroundImage: `url(${homepic8})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <div className="flex flex-row">
                                    <div className="mr-[100px]">
                                        <img
                                            src={profilePic ? `https://servertest-isos.onrender.com/uploads/${profilePic}` : homepic7}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-2 border-gray-300"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <input type="file" onChange={handleImageChange}/>
                                        <button
                                            className="text-black bg-pink-300 mt-3 hover:bg-pink-400 py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                            onClick={handleUploadImage}
                                        >
                                            Upload Profile Picture
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Bottom Side */}
                        <div className="flex flex-col order-2 w-full h-full rounded-2xl overflow-y-auto">
                            {/* Example content to test scrolling */}
                            <div className="h-[1200px] border-2 p-4 mt-2">
                                <div>
                                    <h2 className="mb-3 text-2xl">
                                        Personal Information{' '}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap -mx-4">
                                    <div className="w-full md:w-1/2 px-4 mb-6">
                                        <div>
                                            <label
                                                htmlFor="firstname"
                                                className="block  mb-2"
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstname"
                                                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                value={formData.firstname}
                                                onChange={handleInputChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="lastname"
                                                className="block mb-2"
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastname"
                                                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                value={formData.lastname}
                                                onChange={handleInputChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="phone_number"
                                                className="block  mb-2"
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone_number"
                                                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 px-4 mb-6">
                                        <div>
                                            <label
                                                htmlFor="address"
                                                className="block  mb-2"
                                            >
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                className="text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="email"
                                                className="block mb-2"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                        <div className="mt-8">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className="text-black w-full bg-pink-400 hover:bg-plue-700 py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out"
                                                        onClick={handleUpdate}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="text-black w-full bg-pink-600 hover:bg-pink-700  py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out mt-2"
                                                        onClick={() =>
                                                            setIsEditing(false)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="text-black w-full bg-pink-200 hover:bg-pink-300 py-2 px-4 rounded-lg  transition duration-300 ease-in-out"
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[1200px] border-2 p-4 mt-2">
                                <div>
                                    <h2 className="mb-3 text-2xl">Security </h2>
                                    <p>Password: enabled</p>

                                    <button
                                        className="text-black bg-pink-300 julius-sans-one-regular hover:bg-pink-400 py-2 px-4 rounded-lg  hover:shadow-xl transition duration-300 ease-in-out mt-auto"
                                        onClick={handleReset}
                                    >
                                        Password Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
