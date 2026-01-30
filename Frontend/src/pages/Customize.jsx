import React, { useRef } from 'react';
import image1 from '../assets/Robot1.jpg';
import image3 from '../assets/Robot3.jpg';
import image4 from '../assets/Robot4.jpg';
import image5 from '../assets/Robot5.jpeg';
import image6 from '../assets/Robot6.png';
import image7 from '../assets/Robot7.png';
import image8 from '../assets/Robot8.png';
import image9 from '../assets/Robot9.jpg';
import { LuImagePlus } from "react-icons/lu";
import { X } from "lucide-react"; 
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

const Customize = () => {
  const {
    frontendImages,
    setFrontendImages,
    selectedImage,
    setSelectedImage
  } = React.useContext(userDataContext);

  const navigate = useNavigate();
  const inputImageRef = useRef();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFrontendImages((prev) => [...prev, { file, preview: imageUrl }]);
    }
  };
  const handleRemoveImage = (index) => {
    setFrontendImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='w-full h-full bg-black bg-[radial-gradient(circle_at_25%_25%,#0b6e0b40_0%,transparent_40%),radial-gradient(circle_at_75%_75%,#0b6e0b40_0%,transparent_40%)] flex justify-center items-center flex-col p-3 overflow-auto relative'>
      <IoArrowBackSharp  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/')} />
      <h1 className='text-white text-[30px] mt-2'>
        Select your <span className='text-blue-500'>Assistant Images</span>
      </h1>

      <div className='w-[90%] justify-center items-center mx-auto h-[98%] flex gap-5 flex-wrap py-5'>

        {/* Default Images */}
        {[image1, image3, image4, image5, image6, image7, image8, image9].map((img, index) => (
          <div
            key={index}
            className={`relative w-[200px] h-[280px] rounded-2xl overflow-hidden border-2 border-blue-400 
              transition-all duration-300 cursor-pointer
              hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
              ${selectedImage === `default-${index}` ? 'border-4 border-white shadow-2xl shadow-blue-950' : ''}`}
            onClick={() => setSelectedImage(`default-${index}`)}
          >
            <img src={img} alt={`robot-${index}`} className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Uploaded Images */}
        {frontendImages.map((img, index) => (
          <div
            key={index}
            className={`relative w-[200px] h-[280px] rounded-2xl overflow-hidden border-2 border-blue-400 
              transition-all duration-300 cursor-pointer
              hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
              ${selectedImage === `upload-${index}` ? 'border-4 border-white shadow-2xl shadow-blue-950' : ''}`}
            onClick={() => setSelectedImage(`upload-${index}`)}
          >
            <img src={img.preview} alt="Uploaded" className='w-full h-full object-cover' />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent image select
                handleRemoveImage(index);
              }}
              className='absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-red-600'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        ))}

        {/* Add Image Button */}
        <div
          className={`w-[200px] h-[280px] bg-[#000675] border-2 border-blue-400 rounded-2xl overflow-hidden 
          hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
          transition-all duration-300 flex justify-center items-center
          ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
          onClick={() => {
            inputImageRef.current.click();
            setSelectedImage("input");
          }}
        >
          <LuImagePlus className='text-white text-[50px]' />
        </div>

        {/* Hidden File Input */}
        <input
          type='file'
          ref={inputImageRef}
          className='hidden'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>

      {/* Show button only if user selected any image */}
      {selectedImage !== null && (
        <button 
          className='mt-5 w-[120px] h-[40px] bg-blue-500 text-white text-[20px] cursor-pointer rounded-full hover:border-2 hover:border-white' 
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;



