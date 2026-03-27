import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

 const isAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({ message: " authorization denied", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Token is not valid", success: false });
        }
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({ message: "User not found", success: false });
        }
        req.user = user;
        next();
    } catch(error){
        res.status(401).json({ message: "Token is not valid", success: false });

    }
}

export default isAuth;