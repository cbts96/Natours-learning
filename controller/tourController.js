const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync=require("../utils/catchAsync");
const AppError=require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getalltours = catchAsync(async (req, res,next) => {
 
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  
    res.status(404).json({
      status: 'fail',
      message: err
    });
  })


exports.gettours = catchAsync(async (req, res,next) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id'
  //   });
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: { tour }
  // });
  
    const tour = await Tour.findById(req.params.id);
    if(!tour){
      return next(new AppError("No tour found with this id",404))
    }
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  
    res.status(404).json({
      status: 'fail',
      message: err
    });
  });


exports.updatetours = catchAsync(async (req, res,next) => {
 
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if(!tour){
      return next(new AppError("no tour found with this id",404))
    }
    res.status(200).json({
      status: 'success',

      data: { tour }
    });
  
    res.status(404).json({
      status: 'fail',
      message: err
    });
  })


exports.deletetours = catchAsync(async (req, res,next) => {
  
    const tour=await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
      return next(new AppError("no tour found with this id",404))
    }
    res.status(204).json({
      status:"success",
      data:null
    })
 
    res.status(404).json({
      status: 'fali',
      message: err
    });
  });




exports.createtours = catchAsync(async (req, res,next) => {
 const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
 
  })

exports.getTourStats = catchAsync(async (req, res,next) => {
  
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  
    res.status(404).json({
      status: 'fail',
      message: err
    });
  })


exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  
    res.status(404).json({
      status: 'fail',
      message: err
    });
  });

