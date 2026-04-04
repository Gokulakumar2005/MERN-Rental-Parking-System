

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user", "vendor"],
    default: "user",
    required: true
  },
  profilePic: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true
  },
  wallet:{
    type:Number,
    required:true
  },
  phoneNumber: {
    type: String,
    required: true
  },
}, { timestamps: true });

const UserModel = mongoose.model("UserModel", UserSchema);

export default UserModel;

