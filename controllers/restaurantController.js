const mongoose = require("mongoose");
const Restaurant = mongoose.model("Restaurant");
const User = mongoose.model("User");
const Dishes = mongoose.model("Dishes");
const bodyParser = require("body-parser")



exports.getAllRest = async (req, res) => {
    try{
        let Restaurants = await Restaurant.find({}).populate();// pupulating it because it might have array or id of dish/user
        res.json(Restaurants);
    } catch(err){
        console.log(err)
    }
};

exports.getRest = async (req, res) => {
    try{
        let Id= req.params.id
        let Restaurants = await Restaurant.findById(Id).populate();
        res.json(Restaurants);
    } catch(err){
        console.log(err)
    }
};

exports.getDish = async (req, res) => {
    try{
        let Id= req.params.id
        let dish = await Dishes.findById(Id).populate();
        res.json(dish);
    } catch(err){
        console.log(err)
    }
};

exports.distance = async (req, res) => {
    try{// ids are taken from body, can also be taken from params and query, i hope its fine by you
        let Restaurants = await Restaurant.findById(req.body.restaurantid).populate();//having data of Rest from id taken from body
        let user = await User.findById(req.body.userid).populate(); // having data of user taken from body
        let userLat=user.location[0].coordinate[0][0] //taking the first element of location from user
        let userlon=user.location[0].coordinate[0][1] // because user having multiple location stored
        let restLat=Restaurants.locationRest.coordinate[0] // coordinated of restaurants
        let restLon=Restaurants.locationRest.coordinate[1]

        if ((userLat==restLat)&&(userlon==restLon)){ // if user and Restaurant coodinate is same by chance
            res.json("zero Km")
        }else{
            var raduserLat = Math.PI * userLat/180;
            var radrestLat = Math.PI * restLat/180;
            var theta = userlon-restLon;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(raduserLat) * Math.sin(radrestLat) + Math.cos(raduserLat) * Math.cos(radrestLat) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344  // to have distance in KM
            const totalDist =dist.toFixed(2) // using toFixed so that it will show only two decimal after point
            res.json(totalDist+"killometer distance")
        }
    } catch(err){
        console.log(err)
    }
};

exports.getRestByRole = async (req, res) => {
    try{
        let Id= req.payload.id
        let userData= await User.findById(Id)
        if(userData.role=="admin"){ // as asked in requirement admin will see all the restaurants
            let restaurants=await Restaurant.find({})
            res.json("the role was admin so here is all the restaurants", restaurants)
        }else{
            let Restaurants = await Restaurant.find({userId:Id}).populate();//its for sub-admin restaurants/cn also work for different input
            res.json(Restaurants);
        }
        
    } catch(err){
        console.log(err)
    }
};

exports.getDishByRole = async (req, res) => {
    try{
        let Id= req.payload.id
        let userData= await User.findById(Id)
        if(userData.role=="admin"){
            let Dishes=await Dishes.find({})
            res.json("the role was admin so here is all the restaurants", Dishes)
        }else{
            let Dishes = await Dishes.find({userId:Id}).populate();// for sub-admin to see his dishes
            res.json(Dishes);
        }// same way I perform it for dishes
    } catch(err){
        console.log(err)
    }
};
exports.createRestaurant = async (req, res) => {
    try{
        const { name, locationRest} = req.body;
        const userId = req.payload.id;
        let userData= await User.findById(userId)
        if(userData.role=="user"){ // a user can not create a restaurant
            
            res.json({message: "admin or subadmin role is required to create Restaurant",
        });
    }
    else if(userData.role=="admin"||userData.role=="sub-admin"){ // verifying role 
        const Restaurant=new Restaurant({
            userId, // storing Id or user who created this restaurant
            name,
            locationRest // storing location of restaurant as a point
        });
        await Restaurant.save();
        res.json({
            message:`Restaurant created by user ${userId}`
        })
    }
    }catch(err){
        console.log(err)
    }
};

exports.createDish = async (req, res) => {
    try{
        const { title, description, price, tags, RestaurantId} = req.body;
        const userId = req.payload.id;
        let userData= await User.findById(userId)
        if(userData=="user"){
            //verifying role for creating a dish
            res.json({message: "admin or sub-admin role required to create a dish",
        });
    }
    else if(userData=="admin"|| userData=="sub-admin"){
        const Dish = new Dish({
            userId,
            title,
            description,
            price,
            tags
        });
        await Dish.save();
        await Restaurant.findByIdAndUpdate(RestaurantId,{$push:{dishList:dish.id}},{new:true})
        //when a dish is created and we are doing it async we store its id in restaurant
            
        res.json({message: "Restaurant created!",
    });
    }}catch(err){
        console.log(err)
    }
};

exports.updateRest = async (req, res) => {
    try{
        const id = req.params.id;
        const updated= await Restaurant.findByIdAndUpdate(id, req.body, {new: true})
        res.json({ message: updated });
    } catch(err){
        console.log(err)
    }
    
};

exports.updateDish = async (req, res) => {
    try{
        const id = req.params.id;
        const updated= await Dishes.findByIdAndUpdate(id, req.body, {new: true})
        res.json({ message: updated });
    } catch(err){
        console.log(err)
    }
    
};