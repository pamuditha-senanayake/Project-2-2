import React, {useEffect, useState} from 'react';
import Navigation from './nav';
import {useNavigate} from 'react-router-dom';
import homepic4 from "../../images/f.jpg"; // Adjust the path if necessary
import homepic3 from "../../images/a.jpg";
import Swal from 'sweetalert2'; // Import SweetAlert

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone_number: '',
        address: '',
        email: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://servertest-isos.onrender.com/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies for session
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user data:', data); // Log the fetched data
                    setUserData(data);
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

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://servertest-isos.onrender.com/api/user/update/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

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
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://servertest-isos.onrender.com/api/user/delete/${userData.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    if (response.ok) {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your profile has been deleted.",
                            icon: "success"
                        }).then(() => {
                            navigate('/'); // Redirect to home page after deletion
                        });
                    } else {
                        console.error('Failed to delete user, status:', response.status);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your profile is safe :)",
                    icon: "error"
                });
            }
        });
    };


    const navigate = useNavigate();
    const handleReset = () => {
        navigate('/reset'); // Redirect to /reset
    };

    if (!userData) {
        return <div>Loading...</div>;
    }


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
                            </div>
                        </div>

                        <div className="flex order-2 w-full h-[80%] bg-pink-700 rounded-2xl">
                            <div className="max-w-4xl mx-auto p-8 rounded-lg text-white">

                                <div className="flex flex-wrap -mx-4">

                                    <div className="w-full md:w-1/2 px-4 mb-6">

                                        <div>
                                            <label htmlFor="firstname" className="block font-bold mb-2">First
                                                Name</label>
                                            <input type="text" id="firstname"
                                                   className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   value={formData.firstname}
                                                   onChange={handleInputChange}
                                                   readOnly={!isEditing}/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="lastname" className="block font-bold mb-2">Last Name</label>
                                            <input type="text" id="lastname"
                                                   className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   value={formData.lastname}
                                                   onChange={handleInputChange}
                                                   readOnly={!isEditing}/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="phone_number" className="block font-bold mb-2">Phone
                                                Number</label>
                                            <input type="tel" id="phone_number"
                                                   className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   value={formData.phone_number}
                                                   onChange={handleInputChange}
                                                   readOnly={!isEditing}/>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 px-4 mb-6">
                                        <div>
                                            <label htmlFor="address" className="block font-bold mb-2">Address</label>
                                            <input type="text" id="address"
                                                   className="text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   value={formData.address}
                                                   onChange={handleInputChange}
                                                   readOnly={!isEditing}/>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="email" className="block font-bold mb-2">Email</label>
                                            <input type="email" id="email"
                                                   className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                   value={formData.email}
                                                   onChange={handleInputChange}
                                                   readOnly={!isEditing}/>
                                        </div>
                                        <div className="mt-8">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className="text-black w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out"
                                                        onClick={handleUpdate}>
                                                        Save
                                                    </button>
                                                    <button
                                                        className="text-black w-full bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out mt-2"
                                                        onClick={() => setIsEditing(false)}>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="text-black w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out"
                                                    onClick={() => setIsEditing(true)}>
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[30%] h-full rounded-4xl justify-between bg-pink-300 px-2 pt-3">
                        <h1 className="julius-sans-one-regular text-4xl mt-[60px]">Settings</h1>
                        <br/><br/>
                        <h1 className="julius-sans-one-regular text-2xl">Do you want to delete the profile?</h1>
                        <button
                            className="bg-pink-600 julius-sans-one-regular hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out mt-auto"
                            onClick={handleDelete}>
                            Delete
                        </button>
                        <br/><br/>
                        <br/><br/>

                        <h1 className="julius-sans-one-regular text-2xl">Reset the password</h1>
                        <button
                            className="bg-pink-600 julius-sans-one-regular hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out mt-auto"
                            onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
