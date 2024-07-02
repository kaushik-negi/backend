import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefreshTokens = async(userId) =>{
    try {
       const user =  await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
   // get user details from frontend 
   //validation - not empty
   // check if user already exist : email
   // check for avatar
   // upload them to cloudinary , avatar
   //create user object - create entry in db
   //remove pasword and refrest token field from response
   //check for user creation
   // return reponse

   const {name , email , gender ,password  } = req.body

    // if(name === ""){
    //     throw new ApiError(400,"Name is required")
    // }

    if(
        [name,email,gender,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{email}]
    })

    if (existedUser){
        throw new ApiError (409,"Email already existed")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
      }

     const avatar = await uploadOnCloudinary(avatarLocalPath);

     if (!avatar || !avatar.url) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
     }

  const user = await User.create({
    name,
    avatar:avatar.url,
    email,
    password,
    gender
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Successfully")
    )
})


const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const {email , password} = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "Email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})



const logoutUser = asyncHandler(async (req, res) => {
   await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure:true,
    }

    return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )

})


const refreshAccessToken = asyncHandler(async (req,res)=>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

 try {
      const decodedToken =  jwt.verify(
           incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
       )
   
       const user = await User.findById(decodedToken?._id)
   
       if(!user){
           throw new ApiError(401,"Unauthorized request")
       }
   
   
       if(incomingRefreshToken !== user?.refreshToken){
           throw new ApiError(401 , "Refresh token is expired or used")
       }
   
       const options = {
           httpOnly : true ,
           secure:true
       }    
   
       const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
   
       return res
       .status(200)
       .cookie("accessToken", accessToken , options)
       .cookie("refreshToken",newRefreshToken,options)
       .json(
           new ApiResponse(
               200,
               {accessToken , refreshToken : newRefreshToken},
               "Access Token Refreshed"
   
           )
       )
 } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh Token")
 }
})






export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}