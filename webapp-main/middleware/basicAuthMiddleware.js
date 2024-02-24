import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const basicAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        req.user = user
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Authentication failed due to an unexpected error' });
    }
}

export default basicAuthMiddleware;
