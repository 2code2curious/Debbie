const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/debbie');
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
  })
})

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
    })
  });
});

// Start server
app.listen(3000, function() {
  console.log('Server started on port 3000...');
});
