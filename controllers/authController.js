
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {makeToken}=require("../util/maketoken")
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};
exports.login=async(req,res,next) => {
    try{
    const {email,password}=req.body;
    if(!email){
        return res.status(400).json({
            message:"Email not found"
        })
    }
    if(!password){
        return res.status(400).json({
            message:"password required"
        })
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            message:"User not exit"
        })
    }
    const ok=await bcrypt.compare(password,user.password);
    if(!ok){
        res.status(200).json({
            message:"Invalid email or password"
        })
    }
    res.status(200).json({
        token:makeToken(user)
    })
  }
  catch(err){
    next(err);
  }
};