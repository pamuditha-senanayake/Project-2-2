import React, {useEffect, useState} from 'react';
import Navigation from './nav';
import {useNavigate} from 'react-router-dom';
import homepic4 from "../../images/f.jpg";
import Swal from 'sweetalert2';
import homepic7 from "../../images/f.jpg";
import homepic8 from "../../images/d.jpg";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone_number: '',
        address: '',
        email: '',
    });

    const [activeButton, setActiveButton] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/profile', {
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
                    if (data.image) {
                        setProfilePic(`data:image/jpeg;base64,${data.image}`);
                    }
                    setFormData({
                        firstname: data.firstname || '',
                        lastname: data.lastname || '',
                        phone_number: data.phone_number || '',
                        address: data.address || '',
                        email: data.email || '',
                    });
                } else {
                    console.error('Failed to fetch user data, status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                setImageBlob(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);

            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1];
                try {
                    const response = await fetch(
                        `http://localhost:3001/api/user/update/pic`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({image: base64Image}),
                        }
                    );

                    if (response.ok) {
                        const updatedUser = await response.json();
                        setUserData(updatedUser.user);
                        setProfilePic(`data:image/jpeg;base64,${updatedUser.user.image}`);
                    } else {
                        const errorMessage = await response.json();
                        console.error(
                            'Failed to upload image, status:',
                            response.status,
                            'Message:',
                            errorMessage.message
                        );
                        alert(
                            `Error: ${errorMessage.message || 'Failed to upload image.'}`
                        );
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    alert('An error occurred while uploading the image.');
                }
            };
        } catch (error) {
            console.error('Error converting Blob to base64:', error);
            alert('An error occurred while processing the image.');
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/user/update/${userData.id}`,
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
                            `http://localhost:3001/api/user/delete/${userData.id}`,
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
        // Set active button and navigate
        setActiveButton(buttonName);
        navigate(buttonName === 'profile' ? '/userp' : buttonName === 'appointments' ? '/myappointment2' : '/userpayment');
    };

    return (
        <div
            className="flex flex-col h-screen w-full julius-sans-one-regular"
            style={{
                backgroundImage: `url(${homepic4})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Navigation/>

            <div className="flex items-center justify-center w-full h-full mt-[20px] overflow-hidden mb-2">
                <div
                    className="flex flex-row w-[90%] h-[90%] space-x-2 border-2 rounded-2xl py-3 px-3 mt-[100px] bg-white overflow-hidden"
                >
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
                            <button
                                className={`${
                                    activeButton === 'appointments'
                                        ? 'bg-pink-200'
                                        : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('appointments')}
                            >
                                Appointments
                            </button>
                            <button
                                className={`${
                                    activeButton === 'payment' ? 'bg-pink-200' : ''
                                } text-gray-800 p-2 rounded-full hover:bg-pink-200 focus:outline-none`}
                                onClick={() => handleButtonClick('payment')}
                            >
                                Payment
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
                                <div className="mr-[100px]">
                                    <img
                                        src={profilePic || 'default-profile-pic-url'}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-2"
                                    />
                                    <button
                                        className="mt-2 bg-pink-400 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                        onClick={() =>
                                            document
                                                .querySelector('input[type="file"]')
                                                .click()
                                        }
                                    >
                                        Edit Photo
                                    </button>
                                    <button
                                        className="mt-2 bg-pink-400 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                        onClick={uploadImage}
                                    >
                                        Upload
                                    </button>
                                    {/*<div className="flex justify-end mt-4">*/}
                                    {/*    <button*/}
                                    {/*        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"*/}
                                    {/*        onClick={handleUpdate}*/}
                                    {/*    >*/}
                                    {/*        Save Changes*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
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