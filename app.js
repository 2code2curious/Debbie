const express = require('express');
const path = require('path');
// Init app
const app = express();

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', function(req, res) {
  let tasks = [
    {
      id:1,
      title:'Task one',
      body:'This is task 1'
    },
    {
      id:2,
      title:'Task two',
      body:'This is task 2'
    },
    {
      id:3,
      title:'Task three',
      body:'This is task 3'
    }
  ];
  res.render('index', {
    title:'Debbie welcomes you!',
    tasks:tasks
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
