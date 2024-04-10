const express = require('express');
const User = require('../modal/userSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const Authenticate = require('../middleware/authenticate');
require('../db/conn');



router.get('/', (req, res) => {
    res.send("hello world from the server from router")
});


router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plz fill the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist " });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password is not matching" });
        } else {
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
    } catch (err) {
        console.log(err);
    }
});


//login route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Plz fill the data" });
        }

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            // console.log(isMatch);

            const token = await userLogin.generateAuthToken();
            // console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "invalid credentials" })
            } else {
                res.json({
                    message: "User login successfully",
                    userInfo: {
                        name: userLogin.name,
                        email: userLogin.email,
                        phone: userLogin.phone
                    }
                })
            }

        } else {
            res.status(400).json({error: "Invalid Credentials"})
        }
    } catch (err) {
        console.log(err);
    }
})

// about
router.get('/about', Authenticate, (req, res) => {
    res.send(req.rootUser);
})


module.exports = router;