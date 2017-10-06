const express = require('express');
const router = express.Router();

// Bring in Task model
let Task = require('../models/task');

// Add route
router.get('/add', function(req, res){
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
    task.body = req.body.body;

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

// Get single task
router.get('/:id', function(req, res){
  Task.findById(req.params.id, function(err, task){
    res.render('task', {
      task:task
    });
  });
});

// Load edit form
router.get('/edit/:id', function(req, res){
  Task.findById(req.params.id, function(err, task){
    res.render('edit_task', {
      title: 'Edit Task',
      task:task
    });
  })
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

module.exports = router;
