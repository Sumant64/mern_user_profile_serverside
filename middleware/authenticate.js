const jwt = require('jsonwebtoken');
const User = require('../modal/userSchema');

const Authenticate = async (req, res, next) => {
    try{
        // console.log(req.header('Authorization'));
        const token = req.header('Authorization');
        
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token })

        if(!rootUser) {
            throw new Error('User not found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }catch(err) {
        console.log(err);
        res.status(401).send("Unauthorized: No token provided")
    }
}

module.exports = Authenticate