const mongoose = require("mongoose");


const dishSchema = new mongoose.Schema(
  {
    userId: {                             // this will have the id of admin/ sub-admin who make the dish
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "what is your name bro!!!"],
      ref:"User",
    },
    
    title: {
      type: String,
      required: [true, "title? keep it new"],
      trim:true,
      unique: true,
      maxlength: 25,
      
    },
    description: {
      type: String,
      //required: [true, "description is required!!!"],
      trim: true,
      maxlength:100
    },
    price: {
      type: Number
    }, 

    tags: {               // added multiple tags like starter, dinner, veg  etc for better search
      type: [String]      // it was exrta for making a better system
    },
    availableInRest:[{              // array of restaurant Id whereever this perticular dish will be present
      type: mongoose.Schema.Types.ObjectId,
      ref:"Restaurant",
    }],
    
  },
  {
    timestamps: true,
  }

);
module.exports = mongoose.model("Dishes", dishSchema);
