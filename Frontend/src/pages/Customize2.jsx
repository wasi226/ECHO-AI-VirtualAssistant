import React, { useState } from 'react'
import axios from 'axios'
import { userDataContext } from '../context/UserContext';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
// Import default images
import image1 from '../assets/Robot1.jpg';
import image3 from '../assets/Robot3.jpg';
import image4 from '../assets/Robot4.jpg';
import image5 from '../assets/Robot5.jpeg';
import image6 from '../assets/Robot6.png';
import image7 from '../assets/Robot7.png';
import image8 from '../assets/Robot8.png';
import image9 from '../assets/Robot9.jpg';

const defaultImages = [image1, image3, image4, image5, image6, image7, image8, image9];

const Customize2 = () => {
    const { userData, selectedImage, frontendImages, serverUrl, setUserData } = React.useContext(userDataContext);
    const [assistantName, setAssistantName] = React.useState(userData?.assistantName || "");
    const [loading,setLoading]=useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        if(!assistantName.trim()){
            alert("Please enter assistant name");
            return;
        }

        if(!selectedImage){
            alert("Please select an image");
            return;
        }

        setLoading(true)
        try {
            let assistantImage = null;
            
            // Get the selected image URL
            if(selectedImage?.startsWith('default-')){
                // For default images, use the image array index
                const index = parseInt(selectedImage.split('-')[1]);
                assistantImage = defaultImages[index];
            } else if(selectedImage?.startsWith('upload-')){
                const index = parseInt(selectedImage.split('-')[1]);
                assistantImage = frontendImages[index]?.preview;
            }

            if(!assistantImage){
                alert("Please select a valid image");
                setLoading(false);
                return;
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, 
            { 
                assistantName, 
                imagesUrl: assistantImage 
            }, 
            { withCredentials: true });
            
            setLoading(false)
            console.log("Update result:", result.data);
            setUserData(result.data);
            navigate('/')
        } catch (error) {
            setLoading(false)
            console.log("Update assistant error:", error.response?.data || error.message);
            alert("Failed to create assistant: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='w-full h-screen bg-black bg-[radial-gradient(circle_at_25%_25%,#0b6e0b40_0%,transparent_40%),radial-gradient(circle_at_75%_75%,#0b6e0b40_0%,transparent_40%)] flex justify-center items-center flex-col p-3 overflow-auto relative '>
            <IoArrowBackSharp  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/customize')} />
            <h1 className='text-white text-[30px] mt-2'>
                Enter your <span className='text-blue-500'>Assistant Name</span>
            </h1>

            <input
                type="text"
                placeholder="Oryaz"
                className="w-full max-w-[600px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-xl mt-5"
                required
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
            />
            
            {assistantName && (
                <button 
                    className='px-10 py-3 bg-blue-500 text-white cursor-pointer rounded-full hover:bg-blue-600 mt-5 border-1 text-xl' 
                    disabled={loading}
                    onClick={handleUpdateAssistant}
                >

                    {!loading?"Craft Your Smart Assistant":"Loading......"}
                </button>
            )}
        </div>
    )
}

export default Customize2;
