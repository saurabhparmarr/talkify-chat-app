import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const isAuth = async (req, res, next) => {
    const isCheckRoute = req.path === '/check' || req.originalUrl?.includes('/users/check');

    try {
        const token = req.cookies?.token;

        if (!token) {
            if (isCheckRoute) {
                req.user = null;
                return next();
            }
            return res.status(401).json({ message: 'Authorization denied', success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            if (isCheckRoute) {
                req.user = null;
                return next();
            }
            return res.status(401).json({ message: 'Token is not valid', success: false });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            if (isCheckRoute) {
                req.user = null;
                return next();
            }
            return res.status(401).json({ message: 'User not found', success: false });
        }

        req.user = user;
        next();
    } catch (error) {
        if (isCheckRoute) {
            req.user = null;
            return next();
        }
        return res.status(401).json({ message: 'Token is not valid', success: false });
    }
};

export default isAuth;