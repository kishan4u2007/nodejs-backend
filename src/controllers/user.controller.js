import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    //res.status(200).json({ message: "Ok" })
    // get User details from frontend
    // Validation - not Empty
    // check user is already exists :  username, email
    // check for image, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refersh token field from response
    // check for user creation
    // res

    const {fullName, username, email, password} = req.body

    if([fullName, username, email, password].some((field) => field?.trim === "" )) {
        throw new ApiError(400, "All files are complsury")
    }

    const existedUser =  User.findOne({
        $or : [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "Username and email is already existed")
    }

    //multer has given us access of req.files just like mongoose give us access of req.body
    console.log("avatar file name", req.files?.avatar[0]?.path)

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!!")
    }

    //upload image on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required!!")
    }

    //create user object - create entry in db

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    //check user is created or not if yes monogdb provide us unique Id for every object
    // inside select method ("-password") we are using for we will remove password field from user object 

    const createdUser =  User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong!!")
    }

    //if everything looks good send respone to server
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully!!")
    )
    

})

export {
    registerUser,
}