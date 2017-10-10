let mongoose = require('mongoose');

// Task schema
let taskSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  creator:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  dueDate:{
    type: Date
  }
});

let Task = module.exports = mongoose.model('Task', taskSchema);
