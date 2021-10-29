const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const restaurantController = require("../controllers/restaurantController");



const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(restaurantController.getAllRest));
//API to get all the restaurants by any role

router.get("/:id", auth, catchErrors(restaurantController.getRest));
//API for getting perticular restaurants by id geting from params

router.get("/dish/:id", auth, catchErrors(restaurantController.getDishes)); 
//API for getting dishes in a restaurants by id from params

router.get("/distance", auth, catchErrors(restaurantController.distance))   
//API to get distance between user and a restaurant
//the id of restaurant is taken from body
//---------------------------------------------------------------

router.get("/all", auth, catchErrors(restaurantController.getRestByRole));
//API to get restaurants by role, admin will see all retaurants and sub-admins will see the one created by him only
router.get("/dish/all", auth, catchErrors(restaurantController.getDishByRole));
//same API for Dishes

router.post("/",auth, catchErrors(restaurantController.createRestaurant))
//Creating a restaurant by admin/sub-admin only
router.post("/dish",auth, catchErrors(restaurantController.createDish))
//API to create DIsh by admin or sub-admin only

// -------------------------------------------------------------------------------------------
//additioncal APIs
router.put("/:id", auth, catchErrors(restaurantController.updateRest));
//API to update restaurant details by id

router.put("/dish/:id", auth, catchErrors(restaurantController.updateDish));
//API to update dish details by Id


module.exports = router;
