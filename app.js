var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var stylus = require('stylus');

//New Code
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');

//Connecting to Mongodb & Database
mongoose.connect('mongodb://192.168.7.102:27017/employee');
var Schema = mongoose.Schema;
var details = new Schema({
  username:String,
  password:String
},{
  collection:'user'
});

var userDetails = mongoose.model('user', details);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(stylus.middleware(
  {src:__dirname + '/public'
}
));


//Make our db accessible to our router
//p.use(function(req, res, next) {
  //q.db = db;
  //xt();  
//;

app.use('/', routes);
app.use('/users', users);

//Directing to Login Page.
app.get('/login', function(req, res) {
  res.sendfile('views/login.html');
});

app.post('/login',
passport.authenticate('local',{
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFailure'
})
);


//Login failure it is redirecting to Login Page.
app.get('/loginFailure', function(req, res, next){
  res.sendfile('views/login.html');
});

//Login Success, it is redirecting to Selection Page.
app.get('/loginSuccess', function(req, res, next){
  res.sendfile('views/Selection.html');
});

//Serailize the user.
passport.serializeUser(function(user, done) {
  done(null, user);
});

//De-seialize the user.
passport.deserializeUser(function(user, done){
  done(null, user);
});

//Getting the data from MongoDB & checking username and password.
passport.use(new LocalStrategy(function(username, password, done){
  process.nextTick(function() {
    userDetails.findOne({
      'username': username,
    }, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {

        return done(null, false, {message: 'Incorrect User.'});
      }
      if(user.password != password) {
        
        return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
     });
  });
}));

//Get the data from selection page and show web page
app.post('/performaction', function(req, res, next) {
  
  var oRadio = req.body.type;

  console.log(oRadio);

  if(oRadio == "Inserting") {
        res.sendfile('views/Inserting.html');
   }else if(oRadio == 'Updating') {
        res.sendfile('views/Updating.html');
    }else if(oRadio == 'Deleting') {
        res.sendfile('views/Deleting.html');
    }else if(oRadio == 'Reading') {
        res.sendfile('views/Reading.html');
    }
});


//Get the data from Reading page and show respected webpage.
app.post('/chooseoperation', function(req, res, next) {
  
  var value = req.body.type;

  if(value == "EmployeeId") {
        res.sendfile('views/Id.html');
   }else if(value == 'EmployeeName') {
        res.sendfile('views/Name.html');
    }else if(value == 'Designation') {
        res.sendfile('views/Designation.html');
    }else if(value == 'Salary') {
        res.sendfile('views/Salary.html');
    }else if(value == 'Location') {
        res.sendfile('views/Location.html');
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
