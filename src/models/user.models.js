import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    gender: {
        type: String,
        required: [true, "Please Enter Gender"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have atleast 8 chars"]
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    refreshToken:{
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ 
        _id: this._id ,
        email: this.email,
        name: this.name,
        gender: this.gender
    }, process.env.ACCESS_TOKEN_SECRET , 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id }
        , process.env.REFRESH_TOKEN_SECRET, 
        {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
};




userSchema.methods.getResetPasswordToken = async function () {

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // generate hash token and add to db
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

export const User = mongoose.model('User', userSchema);