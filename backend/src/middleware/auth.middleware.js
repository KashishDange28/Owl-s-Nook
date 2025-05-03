import jwt from "jsonwebtoken";
import User from "../models/User.js";

//const response = await fetch("http://localhost:3000/api/books",{
  //  method: "POST",
    //body: JSON.stringify({
      //  title,
        //caption,
    
    //}),
    //headers:
    //{Authorization: `Bearer ${token}`},
//});
const protectRoute = async (req, res, next) => {
    try{
      const token = req.headers.authorization?.replace("Bearer ", "")?.trim();
if (!token) return res.status(401).json({ message: "Not authorized, no token" });


const decoded = jwt.verify(token, process.env.JWT_SECRET);

const user = await User.findById(decoded.userId).select("-password");
if (!user) return res.status(401).json({ message: "Not authorized, no user" });
req.user = user;
next();
    }
    catch(error){
console.log("Error in auth middleware", error);
res.status(500).json({ message: "Internal server error" });
    }
};
export default protectRoute;
//     const { email, password } = req.body;