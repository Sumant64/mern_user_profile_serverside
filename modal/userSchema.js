const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    skills: {
        type: Array,
        required: true
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.cpassword;
    delete userObject.tokens;

    return userObject
}

//hashing the password
userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.password, 12);
    }
    next();
});

// we are generating token
userSchema.methods.generateAuthToken = async function () {
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(err) {
        console.log(err);
    }
}


const User = mongoose.model("USER", userSchema);

module.exports = User;