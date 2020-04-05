const User = require('./../models/userModel');

const catchAsync=require("../utils/catchAsync");

exports.getallusers = catchAsync(async (req, res,next) => {
   const user = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: user.length,
      data: {
        user
      }
    });
  });
  
  exports.createusers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
    });
  };
  
  exports.deleteusers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
    });
  };
  
  exports.getusers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
    });
  };
  
  exports.updateusers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'this route is not yet defined'
    });
  };
  