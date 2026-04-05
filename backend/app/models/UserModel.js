

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
    required: false
  },
  wallet:{
    type:Number,
    required:true
  },
  phoneNumber: {
    type: String,
    required: false
  },
}, { timestamps: true });

const UserModel = mongoose.model("UserModel", UserSchema);

export default UserModel;

