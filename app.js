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

app.use(session({
  secret: 'iamdebbie',
  resave: true,
  saveUninitialized: true
}));

app.use(expressValidator());
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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
  Task.find({}, function(err, tasks){
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

// Add route
app.get('/tasks/add', function(req, res){
  res.render('add_task', {
    title:'Add task'
  });
});

// Add Submit POST route
app.post('/tasks/add', function(req, res){
  let task = new Task();
  task.title = req.body.title;
  task.body = req.body.body;

  task.save(function(err){
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

// Get single task
app.get('/task/:id', function(req, res){
  Task.findById(req.params.id, function(err, task){
    res.render('task', {
      task:task
    });
  });
});

// Load edit form
app.get('/task/edit/:id', function(req, res){
  Task.findById(req.params.id, function(err, task){
    res.render('edit_task', {
      title: 'Edit Task',
      task:task
    });
  })
});

// Update Submit POST route
app.post('/tasks/edit/:id', function(req, res){
  let task = {};
  task.title = req.body.title;
  task.body = req.body.body;

  let query = {_id:req.params.id};

  Task.update(query, task, function(err){
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

// Delete task request
app.delete('/task/:id', function(req, res){
  let query = {_id:req.params.id};

  Task.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success!');
  });
});

let users =  require('./routes/users.js');
app.use('/users', users);

// Start server
app.listen(3000, function() {
  console.log('Server started on port 3000...');
});
