const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//register endpoint
const registerUser = async (req, res) => {
  try {
    //Extract user data from request body
    const { username, email, password, role } = req.body;

    //chek if the user already exists in our db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already in use, try again",
      });
    } else {
      //hash user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //create a new user and save in db
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
      if (newUser) {
        return res.status(200).json({
          success: true,
          message: "User registered successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Unable to register user, please try again",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, try again",
    });
  }
};

//login endpoint
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Finde if current user exists in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please register first",
      });
    }

    //Chek password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).json({
        success: false,
        message: "Incorrect password, try again",
      });
    }

    //Create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    //Grab the userId from the objetct req.userInfo created in authMiddleware
    const userId = req.userInfo.userId;

    //Extract old and new password from the body (frontend)
    const { oldPassword, newPassword } = req.body;
    
    //#1st validation
    //Check if newPassword is an empty string
    if(!newPassword || newPassword.trim() === ""){
      return res.status(400).json({
        success: false,
        message: "New password cannot be empty, please try again"
      })
    }

    //#2nd Validation:
    //Chek if old and new password are the same
    if (oldPassword === newPassword) {
      return res.status(404).json({
        success: false,
        message: "New passowrd must be diffrent than the old one, please try again",
      });
    }

    //#3rd Validation
    //Find the current logged in user
    const user = await User.findById(userId);
    //Check if user is in database
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //#4th Validation
    //Check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect, please try again",
      });
    }

    //If all validations were passed
    //Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    //Update user password and save it to the database
    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, try again",
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
