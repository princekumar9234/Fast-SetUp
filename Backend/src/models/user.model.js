import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username is unique"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email is unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verified :{
    type:Boolean,
    default: false,
  }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
