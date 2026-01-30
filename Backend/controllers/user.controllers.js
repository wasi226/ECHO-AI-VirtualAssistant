import { response } from 'express';
import geminiResponse from '../gemini.js';
import User from '../models/user.model.js';
import moment from 'moment';
export const getAllUsers  = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
}

export const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
}

export const updatesAssistant = async (req, res) => {
    try {
        const { assistantName, imagesUrl } = req.body;
        let assistantImage;
        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path) // Assuming you're using multer and the file is available in req.file
        }else{
            assistantImage = imagesUrl;
        }
        const user = await User.findByIdAndUpdate(req.userId,{ assistantName, assistantImage }, { new: true }).select('-password');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: `Error updating assistant: ${error.message}` });
    }
}

export const askToAssistant = async (req,res)=>{
    try{
        console.log("=== askToAssistant endpoint called ===");
        const {command}=req.body
        console.log("1. Command received:", command);
        
        if(!command || command.trim() === ""){
            console.log("2. Command is empty");
            return res.status(400).json({response:"Please provide a command"})
        }
        
        const user = await User.findById(req.userId);
        console.log("2. User found:", user?.name);
        
        if(!user){
            return res.status(404).json({response:"User not found"});
        }
        
        user.history.push(command)
        await user.save()
        console.log("3. Command saved to history");
        
        const userName=user.name
        const assistantName=user.assistantName
        console.log("4. Calling Gemini with:", {command, assistantName, userName});
        
        const result = await geminiResponse(command,assistantName,userName)
        console.log("5. Gemini result received:", result?.substring(0, 100));
        
        if(!result){
            console.log("6. Gemini returned null");
            return res.status(400).json({response:"Sorry, Gemini didn't respond"})
        }
        
        const jsonMatch=result.match(/{[\s\S]*}/)
        console.log("7. JSON match found:", jsonMatch ? "yes" : "no");
        
        if(!jsonMatch){
            console.log("7a. No JSON found in response, raw:", result);
            return res.status(400).json({response:"Sorry, I can't understand"})
        }
        
        const gemResult=JSON.parse(jsonMatch[0])
        const type=gemResult.type
        console.log("8. Intent type:", type);

        switch(type){
            case "get-date":
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current data is ${moment().format("YYYY-MM-DD")}`
                });
            case "get-time":
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current time is ${moment().format("hh:mmA")}`
                });
            case "get-day":
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`Today is ${moment().format("dddd")}`
                })
            case "get-month":
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`Month of ${moment().format("MMMM")}`
                })
            case "youtube-search":
            case "google-search":
            case "youtube-play":
            case "calculator-open":
            case "facebook-open":
            case "weather-show":
            case "instagram-open":
            case "general":   
            return res.json({
                type,
                userInput:gemResult.userInput,
                response:gemResult.response,
            })

            default:
                console.log("9. Unknown type:", type);
                return res.status(400).json({response:"I didn't understand that command."})
        } 

    }catch(error){
        console.error("=== askToAssistant ERROR ===", error);
        return res.status(500).json({response:"ask assistant error: " + error.message})
    }
}