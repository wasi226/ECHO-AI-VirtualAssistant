import React, { useState } from 'react';
import bg from '../assets/BackgroundRobot.jpg';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { serverUrl,userData,setUserData,handleCurrentUser} = React.useContext(userDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevents page reload

    // Validate passwords before sending request
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
 
      setUserData(result.data);
      // Refetch user data with the new cookie
      await handleCurrentUser();
      alert("Sign Up Successful!");
      navigate("/customize");
    } catch (err) {
      setUserData(null)
      console.error("SignUp Error:", err.response?.data || err.message);
      alert("Signup failed! Please try again.");
    }
  };

  return (
    <div
      className="SignUp w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-[550px] max-w-[450px] bg-[#00000062] backdrop-blur-md shadow-lg shadow-black flex flex-col justify-center items-center gap-8 rounded-lg p-8"
      >
        <h1 className="text-white text-3xl font-semibold">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-xl"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-xl"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="flex w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-xl"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-xl"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
        >
          Sign Up
        </button>
        <p
          onClick={() => navigate("/signIn")}
          className="text-white text-xl cursor-pointer"
        >
          Already have an account?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

