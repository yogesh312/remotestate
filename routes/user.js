const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");


const auth = require("../middlewares/auth");

router.post("/login", catchErrors(userController.login));
//API for login a user weather its role is any


router.post("/register", catchErrors(userController.register));
//registration of a user/admin/sub-admin by himself only
//we can prohibit this from frontend for anyone register as admin 
//we can remove role register from frontend as well and it will be user by role by default


router.post("/admin/register", catchErrors(userController.registerByRole));
//API for an admin to make sub-admins/user by admin

router.get("/subadmin",auth, catchErrors(userController.showSubAdmins))
//API for admin to list all sub-admin 

router.get("/all", auth, catchErrors(userController.getByRole))
//API for admin to list all admin/sub-admin/user
//API for sub-admin to list user created by him

router.put("/addloc/:id", auth, catchErrors(userController.addMoreLocation))
//adding more location to the user

module.exports = router;
