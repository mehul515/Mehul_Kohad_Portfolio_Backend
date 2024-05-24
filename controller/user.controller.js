import { catchAsyncError } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import { User } from "../models/userSchema.js"
import { v2 as cloudinary } from "cloudinary"
import { generateToken } from "../utils/jwtToken.js"

export const register = catchAsyncError(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar and resume are required!", 400));
    }
    const { avatar, resume } = req.files;

    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "AVATARS" });

    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        console.error("Cloudinary Error : ", cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error!");
    }

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "RESUME" });

    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        console.error("Cloudinary Error : ", cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error!");
    }

    const { fullName, email, phone, aboutMe, password,portfolioURL, githubURL, linkedInURL } = req.body;
    
    const user = await User.create({
        fullName, email, phone, aboutMe, password,portfolioURL, githubURL, linkedInURL,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url,
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url,
        }
    })

    generateToken(user, "User Registered", 201, res)
})

export const login = catchAsyncError(async (req, res, next) => {
  console.log("received");
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Email and password are required!"));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password!"));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password!"));
    }
    generateToken(user, "Logged In", 200, res); 
})


export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({success: true, message: "Logged Out"});
})


export const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true, user})
});



export const updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      aboutMe: req.body.aboutMe,
      githubURL: req.body.githubURL,
      instagramURL: req.body.instagramURL,
      portfolioURL: req.body.portfolioURL,
      facebookURL: req.body.facebookURL,
      twitterURL: req.body.twitterURL,
      linkedInURL: req.body.linkedInURL,
    };
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      const user = await User.findById(req.user.id);
      const profileImageId = user.avatar.public_id;
      await cloudinary.uploader.destroy(profileImageId);
      const newProfileImage = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "PORTFOLIO AVATAR",
        }
      );
      newUserData.avatar = {
        public_id: newProfileImage.public_id,
        url: newProfileImage.secure_url,
      };
    }
  
    if (req.files && req.files.resume) {
      const resume = req.files.resume;
      const user = await User.findById(req.user.id);
      const resumeFileId = user.resume.public_id;
      if (resumeFileId) {
        await cloudinary.uploader.destroy(resumeFileId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "PORTFOLIO RESUME",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Profile Updated!",
      user,
    });
  });


  export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new ErrorHandler("Please Fill All Fields.", 400));
    }
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect Current Password!"));
    }
    if (newPassword !== confirmNewPassword) {
      return next(
        new ErrorHandler("New Password And Confirm New Password Do Not Match!")
      );
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated!",
    });
  });


  export const getUserForPortfolio = catchAsyncError(async (req, res, next) => {
    const id = "664f30e2ab4bebd873f9c5df";
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user,
    });
  });


