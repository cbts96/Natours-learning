const express = require('express');
const router = express.Router();
const authController=require("../controller/authController");
const tourController = require('./../controller/tourController');
//router.param("id",tourController.checkID)
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get(authController.protect, tourController.getalltours)
  .post(
    //tourController.checkBody,
    tourController.createtours
  );
router
  .route('/:id')
  .delete(tourController.deletetours)
  .get(tourController.gettours)
  .patch(tourController.updatetours);

module.exports = router;
