const mongoose = require("mongoose");

var mongoosePaginate = require('mongoose-paginate');
//const dishes = require("./dishes");

const restaurantSchema = new mongoose.Schema(
  {
    userId: {                                //it will have id of the admin/sub-admin who will create it
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",
    },
    name: {
      type: String,
      required:[true,"name of the restaurant is requied"],
      maxlength:100,
      trim:true
    },
    locationRest: {                       // storing one location of restaurant
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
        
    },
    dishList:[{                            // this is array of the dishes present in the restaurant
      type:mongoose.Schema.Types.ObjectId,
      ref:"Dishes"
    }]
  },
  {
    timestamps: true,
  }

);
module.exports = mongoose.model("Restaurant", restaurantSchema);
