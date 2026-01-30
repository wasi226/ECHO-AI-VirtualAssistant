import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

const Home = () => {

  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognitionRef = useRef(false)
  const synth=window.speechSynthesis
  const handleLogOut=async ()=>{
    try{ 
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true}) 
      setUserData(null)
      navigate('/signin')
    } catch(error){
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () =>{
    if(!isSpeakingRef.current && !isRecognitionRef.current){
      try{
      recognitionRef.current?.start();
      console.log("Recognition request is started")
    } catch(error){
      if(!error.name !== "InvalidStateError"){
        console.error("Start error :",error)
      }
    }
    }
  }

  const speak = (text)=>{
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice){
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterance.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      setTimeout(()=>{
        startRecognition();
      },800)
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance)
  }

  const handleCommand = (data)=>{
    if(!data || !data.type){
      console.error("Invalid data in handleCommand:", data);
      return;
    }
    
    const {type,userInput,response}=data
    
    if(response){
      speak(response);
    }

    if(type=== 'google-search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }

    if(type=== 'calculator-open'){
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    }

    if(type=== 'instagram-open'){
      window.open(`https://www.instagram.com`,'_blank');
    }

    if(type=== 'facebook-open'){
      window.open(`https://www.facebook.com`,'_blank');
    }

    if(type=== 'weather-show'){
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }
    
    if(type=== 'youtube-search'|| type==='youtube-play'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
    }


  }

  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous=true,
    recognition.lang='en-US'
    recognition.interimResults = false;
    recognitionRef.current = recognition

    let isMounted = true

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognitionRef.current){
        try{
          recognition.start()
          console.log("Recognition request is started")
        }catch(e){
          if(e.name !== "InvalidStateError"){
            console.error(e);
          }
        }
      }
    },1000)

    const safeRecognition = ()=>{
      if(!isSpeakingRef.current && !recognitionRef.current){
        try{
        recognition.start()
        console.log("Recognition requested to start");
        } catch(err){
          if(err.name !== "InvalidStateError"){
            console.error("Start error : ",err);
          } 
        }
      }
    }

    recognition.onstart = () =>{
      isRecognitionRef.current =true;
      setListening(true)
    }

    recognition.onend = ()=>{
      isRecognitionRef.current=false;
      setListening(false)
      if(isMounted && !isSpeakingRef.current){
      setTimeout(()=>{
        if(isMounted){
          try{
            recognition.start();
            console.log("Recognition restarted")
          } catch(e){
            if(e.name !== "InvalidStateError"){
              console.error(e)
            }
          }
        }
      },1000)
    }
    }
    recognition.onerror = (event) =>{
      console.warn("Recognition error:",event.error);
      isRecognitionRef.current = false
      setListening(false);
      if(event.error!== "aborted" && isMounted && !isRecognitionRef.current){
        setTimeout(()=>{
          if(isMounted){
            try{
              recognition.start();
              console.log("Recognition restarted after error")
            }catch(e){
              if(e.name !== "InvalidStateError"){
                console.log(e);
              }
            }
          } 
        },1000);
      }
    }

    recognition.onresult=  async (e)=>{
      try {
        console.log("onresult event with results count:", e.results.length);
        console.log("userData:", userData);
        console.log("assistantName:", userData?.assistantName);
        
        if(!e.results || e.results.length === 0){
          console.log("No results in recognition event");
          return;
        }
        
        // Concatenate all results to get the full transcript
        let fullTranscript = "";
        for(let i = 0; i < e.results.length; i++){
          if(e.results[i][0]){
            fullTranscript += e.results[i][0].transcript + " ";
          }
        }
        
        const transcript = fullTranscript.trim();
        console.log("Full transcript:", transcript);

        if(!userData?.assistantName){
          console.log("❌ Assistant name not set! Current assistantName:", userData?.assistantName);
          return;
        }

        const assistantNameLower = userData.assistantName.toLowerCase();
        const transcriptLower = transcript.toLowerCase();
        console.log("Checking if:", transcriptLower, "includes:", assistantNameLower);
        
        if(transcriptLower.includes(assistantNameLower)){
          console.log("✅ Assistant name detected! Processing command...");
          recognition.stop()
          setAiText("")
          setUserText(transcript)
          isRecognitionRef.current=false
          setListening(false)
          
          try {
            const data = await getGeminiResponse(transcript)
            console.log("Gemini response received:", data);
            
            if(data && data.response){
              console.log("Processing command with type:", data.type);
              handleCommand(data)
              setAiText(data.response)
              setUserText("")
            } else {
              console.error("Invalid response from gemini:", data);
              const errorMsg = "Sorry, I couldn't process that request";
              speak(errorMsg);
              setAiText(errorMsg);
            }
          } catch (error) {
            console.error("Error in voice command processing:", error);
            const errorMsg = "Sorry, I encountered an error";
            speak(errorMsg);
            setAiText(errorMsg);
          }
        } else {
          console.log("❌ Assistant name not detected in full transcript");
        }
      } catch (error) {
        console.error("Error in recognition.onresult:", error);
      }
    }

    const fallback = setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognitionRef.current){
        safeRecognition()
      }
    },10000)
    safeRecognition()

      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with`)
      greeting.lang = 'hi-IN';
      window.speechSynthesis.speak(greeting)


    return ()=>{
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognitionRef.current=false
    }

  },[])

  return (
    <div className='w-full h-screen bg-black bg-[radial-gradient(circle_at_25%_25%,#0b6e0b40_0%,transparent_40%),radial-gradient(circle_at_75%_75%,#0b6e0b40_0%,transparent_40%)] flex justify-center items-center flex-col gap-[20px] overflow-hidden' >
      <RiMenu3Fill className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
      <RxCross1 className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)} />
      <button
          type="submit"
          className="w-[200px] bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer top-[20px] right-[20px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>
       <button
          type="submit"
          className="w-[300px] bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer top-[100px] right-[20px] px-5 py-3"
          onClick={()=>navigate('/customize')}
        >
        Customize your Assistant
        </button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col'>
          {userData.history?.map((his)=>(
            <span className='text-gray-200 text-[18px] truncate'>{his}</span>
          ))}
        </div>
      </div>
       <button 
          type="submit"
          className="w-[200px] bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer absolute hidden lg:block top-[20px] right-[20px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>
       <button
          type="submit"
          className="w-[300px] bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer absolute hidden lg:block top-[100px] right-[20px] px-5 py-3"
          onClick={()=>navigate('/customize')}
        >
        Customize your Assistant
        </button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl bg-blue-400 shadow shadow-black'>
       <img src={userData.assistantImage} alt=""  className='h-full object-cover'/>
      </div>
       <h1 className='text-white text-2xl font-semibold'>I'm {userData?.assistantName}</h1>
       {!aiText &&  <img src={userImg} alt="" className='w-[200px]' /> }
       {aiText &&  <img src={aiImg} alt="" className='w-[200px]' /> }
       <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home

