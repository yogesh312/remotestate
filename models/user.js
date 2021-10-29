const mongoose = require("mongoose");
require("mongoose-type-email")

const userSchema = new mongoose.Schema(
  {
    parentId: {                           // if an admin or sub admin will create then it willl store id of that user
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    name: {
      type: String,
      required: [true, "what is your name sir!!!"], // validations on model itself
      trim:true,
      maxlength: 15,
    },
    email: {
      type: mongoose.SchemaTypes.Email,  // using an NPM module for email validation
      required: [true, "email is invalid, try again"],// it does all sorts or email validations
      unique:true,
    },
    password: {
        type: String,
        required: "Password is required!",
    },
    // phone: {
    //   type: Number,
    //   required: [true, "phone number  is required!!!"],
    //   trim: true,
    //   maxlength:[10,"phone number should be 10 digits"],
    //   minlength:[10,"phone number should be 10 digits"],
    //   unique:[true,"phone number exist"]
    // },
    role: {
      type: String,
      enum:["admin","sub-admin","user"],
      default: "user",                 // default user will be user only
      
    },
    location:[{                 // here i am having array of locations for storing multiple lcations
      type:{
        type: String, 
        enum: ['Point'],       // for storing point type location
        required: true
      },
      coordinates:{
        type: [Number],       //it will be array of lattitude and longitude
        required: true
      }
    }]
  },
  {
    timestamps: true,
  }

);
module.exports = mongoose.model("User", userSchema);
