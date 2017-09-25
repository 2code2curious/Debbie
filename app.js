const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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
app.get('/tasks/add', function(req, res) {
  res.render('add_task', {
    title:'Add task'
  })
})
// Start server
app.listen(3000, function() {
  console.log('Server started on port 3000...');
});
