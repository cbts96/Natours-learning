const express=require("express");
const router=express.Router();
const userController=require("./../controller/userController");
const authController=require("./../controller/authController");

router.post("/signup",authController.signup);
router.post("/login",authController.login);
router
  .route('/')
  .get(userController.getallusers)
  .post(userController.createusers);
  router
  .route('/:id')
  .delete(userController.deleteusers)
  .get(userController.getusers)
  .patch(userController.updateusers);
module.exports=router;