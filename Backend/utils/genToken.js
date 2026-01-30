import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
    } catch (error) {
        console.log("JWT generation error:", error);
        throw new Error("Token generation failed");
    }
}

export default genToken;
