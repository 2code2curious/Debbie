const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session  = require('express-session');
const flash = require('connect-flash');
const config = require('./config/database');
const passport = require('passport');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to mongoDB');
});

// Check for db errors
db.on('error', function(err){
  console.log(err);
});

// Init app
const app = express();

// Bring in models
let Task = require('./models/task');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'iamdebbie',
  resave: true,
  saveUninitialized: true
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport login
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
})

// Home route
app.get('/', function(req, res) {
  let today = new Date();
  today.setUTCHours(0,0,0,0);
  let query = {dueDate:today};
    Task.find(query, function(err, tasks){
      if(err){
        console.log(err);
      } else {
        res.render('index', {
          title:'Debbie welcomes you!',
          tasks:tasks
        });
      }
    });
});

// Route files
let tasks = require('./routes/tasks');
app.use('/tasks', tasks);

let users =  require('./routes/users');
app.use('/users', users);

// Start server
app.listen(3000, function() {
  console.log('Server started on port 3000...');
});
