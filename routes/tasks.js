const express = require('express');
const router = express.Router();

// Bring in Task model
let Task = require('../models/task');
// Bring in User model
let User = require('../models/user');

// Add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_task', {
    title:'Add task'
  });
});

// Add Submit POST route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if (errors){
    res.render('add_task', {
      title: 'Add task',
      errors: errors
    });
  } else{
    let task = new Task();
    task.title = req.body.title;
    task.creator = req.user._id;
    task.body = req.body.body;
    task.dueDate = req.body.dueDate;

    task.save(function(err){
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Task added');
        res.redirect('/');
      }
    });
  }
});

// To fix: Crash occurs because of creator here.
// Get single task
// router.get('/:id', function(req, res){
//   Task.findById(req.params.id, function(err, task){
//     User.findById(task.creator, function(err, user){
//       res.render('task', {
//         task:task,
//         creator: user.name
//       });
//     });
//   });
// });

// Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Task.findById(req.params.id, function(err, task){
    if(task.creator != req.user._id){
      req.flash('danger', 'Not authorized');
      res.redirect('/');
    } else{
      res.render('edit_task', {
        title: 'Edit Task',
        task:task
      });
    }
  });
});

router.get('/list', function(req, res){
  Task.find(req.query.selectedDate, function(err, tasks){
    res.send(tasks);
  });
});

// Update Submit POST route
router.post('/edit/:id', function(req, res){
  let task = {};
  task.title = req.body.title;
  task.body = req.body.body;

  let query = {_id:req.params.id};

  Task.update(query, task, function(err){
    if(err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Task updated.');
      res.redirect('/');
    }
  });
});

// Delete task request
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id};

  Task.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success!');
  });
});

// Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
