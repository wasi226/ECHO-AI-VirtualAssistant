import React from "react";
import { userDataContext } from "../context/UserContext";

const Cards = ({ images }) => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImages,
    setFrontendImages,
    backendImages,
    setBackendImages,
    selectedImage,
    setSelectedImage,
  } = React.useContext(userDataContext);

  return (
    <div
      className={`w-[200px] h-[280px] bg-[#000675] border-2 border-blue-400 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white transition-all duration-300 ${
        selectedImage === images
          ? "border-4 border-white shadow-2xl shadow-blue-950"
          : ""
      }`}
      onClick={() => {
        setSelectedImage(images);
        setBackendImages(null);
        setFrontendImages(null);
      }}
    >
      <img src={images} className="w-full h-full object-cover" />
    </div>
  );
};

export default Cards;
