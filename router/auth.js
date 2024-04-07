const express = require('express');
const User = require('../modal/userSchema');
const router = express.Router();
require('../db/conn');



router.get('/', (req, res) => {
    res.send("hello world from the server from router")
});


router.post('/register', async(req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error: "plz fill the field properly"});
    }

    try{
        const userExist = await User.findOne({email: email});

        if(userExist){
            return res.status(422).json({ error: "Email already exist "});
        }else if(password != cpassword){
            return res.status(422).json({error: "password is not matching"});
        }else {
            const user = new User({
                name,
                email,
                phone,
                work,
                password,
                cpassword
            });
            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch(err) {
        console.log(err);
    }
});


//login route
router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body;
    } catch(err) {
        console.log(err);
    }
})


module.exports = router;