import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const userDataContext = React.createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const [userData,setUserData]=useState(null)
  const [frontendImages, setFrontendImages] = useState([]);
  const [backendImages, setBackendImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async ()=>{
    try{
      const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setUserData(result.data)
      console.log(result.data)
    }catch(err){
       // Silently handle 401 errors (user not authenticated yet)
       if(err.response?.status !== 401){
        console.log(err)
       }
    }
  }


  const getGeminiResponse= async (command)=>{
    try{
      console.log("Sending command to backend:", command);
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
      console.log("Backend response:", result.data);
      return result.data
    }catch(error){
      console.error("Error in getGeminiResponse:", error.response?.data || error.message);
      return null;
    }
  }

  useEffect(()=>{
    handleCurrentUser()
  },[])

  const value = { serverUrl,userData,setUserData,frontendImages,setFrontendImages,backendImages,setBackendImages,selectedImage,setSelectedImage,getGeminiResponse,handleCurrentUser};

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
