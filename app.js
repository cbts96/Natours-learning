const express = require('express');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHnadler = require('./controller/errorController');
const app = express();
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:"fail",
  //   message:`cant find ${req.originalUrl} on this server`
  //})
  // const err=new Error(`cant find ${req.originalUrl} on this server`);
  // err.status="fail";
  // err.statusCode=404;
  next(new AppError(`cant find ${req.originalUrl} on this server`), 404);
});
app.use(globalErrorHnadler);
module.exports = app;
