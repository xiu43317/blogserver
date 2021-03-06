var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//操作db
var apis = require('./routes/apis');
const router = require('./routes/index');

var app = express();

// 有了這個才能讓不同網址也拿到資料
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded( {extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//啟用session
app.use(cookieSession({
  key:'node',
  secret:'HelloExpressSESSION'
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apis',apis);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
