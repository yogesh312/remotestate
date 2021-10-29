const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");
const cookieParser = require('cookie-parser')


exports.register = async (req, res) => {
  const { name, email, password, role,location } = req.body; 
  if (password.length < 5) throw "Password must be atleast 6 characters long.";
  if (role=="user" && location==null) throw "user needs to provide location"; // only user needs to provide location

  const userExists = await User.findOne({         //checking is user with same email exist or not
    email,
  });

  if (userExists) throw "User with same email already exits.";
  

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
    role,
    location
  });

  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!",
    user
    
  });
  //res.send(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Email and Password did not match.";

  const token = await jwt.sign({ id: user.id }, process.env.SECRET);
  //console.log(user.id)
  //res.cookie('auth',token); // returning the jwt token along with user in cookie in case needed

  res.json({
    message: `${user.id} logged in succesfully`, //returing user id and jwt token on successful login
    token,
  });
};


exports.addByRole = async (req, res) => {
  const { name, email, password, role,location } = req.body;
  const userId=req.payload.id;          // by providing auth token it will have id of login user
  const userData= await User.findById(userId)
  if(userData.role=="admin" || userData.role=="sub-admin"){    // making sure the user is of role admin or sub-admin
    if (password.length < 5) throw "Password must be atleast 6 characters long.";
    if (role=="user" && location==null) throw "user needs to provide location";
    const userExists = await User.findOne({
    email,
  });
    if (userExists) throw "User with same email already exits.";
    const user = new User({
      parentId:userId,
      name,
      email,
      password: sha256(password + process.env.SALT),
      role,
      location
  });
  
  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!",
    user
    
  });
  }else{
    res.json("admin role require to make sub-admins or user")
  }
//res.send(user);
};

exports.showSubAdmins = async (req, res) => {
  try{
    let userId=req.payload.id
    let userData = await User.findById(userId)
    if(userData=="admin"){                 // if the user is admin he will see all the sub-admins ad asked in the requirement
      let allSubAdmins= await User.find({role:"sub-admin"})
      res.json(allSubAdmins)
    }
  }catch(err){
    console.log(err)
  }
};

exports.getByRole = async (req, res) => {
  try{
    let userId=req.payload.id
    let userData = await User.findById(userId)
    if(userData=="admin"){            // if role is admin he will see all list of users /subadmins
      let alluser= await User.find({})
      res.json(alluser)
    }else if(userData.role=="sub-admin"){           // if role is sub-admins he will see users created by him only
      let users = await User.find({parentId:userId})
      res.json(users)
    }
  }catch(err){
    console.log(err)
  }
};

exports.addMoreLocation = async(req,res)=>{
  try{
    const userId=req.params.id
    const newLoc =req.body.location
    const user =await User.findByIdAndUpdate(userId,{$unshift:{location:newLoc}},{new:true})
    //adding new location by using unshift so that it will be first array or cordinate to use
    res.json(user)
  }catch(err){

  }
}