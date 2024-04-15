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
    const { name, email, phone, work, password, cpassword, skills } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword || !skills) {
        return res.status(422).json({ error: "plz fill the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist " });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password is not matching" });
        } else {
            let skillArr = skills.split(',');
            skillArr = skillArr.map((item) => {
                return item.trim()
            })

            const user = new User({
                name,
                email,
                phone,
                work,
                password,
                cpassword,
                skills: skillArr
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
            console.log(token);

            // res.cookie("jwtoken", token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true
            // });

            if (!isMatch) {
                res.status(400).json({ error: "invalid credentials" })
            } else {
                res.json({
                    message: "User login successfully",
                    userInfo: {
                        name: userLogin.name,
                        email: userLogin.email,
                        phone: userLogin.phone,
                        token: token
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

// get user data for contact us and home page
router.get('/getdata', Authenticate, (req, res) => {
    res.send(req.rootUser);
})

// contact message
router.post('/contact', Authenticate, async (req, res) => {
    try{
        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({error: "plzz fill the contact form"})
        }

        const userContact = await User.findOne({_id: req.userID}); 

        if(userContact) {
            userContact.messages = {name, email, phone, message};
            await userContact.save();
            res.status(201).json({message: "user contact added successfully"})
        }

    }catch(err) {
        console.log(err);
        res.status(400).send({error: "Some error occured"})
    }
})


//logout page
router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', {path: '/'})
    res.status(200).send('user logout');
})


module.exports = router;