var isDateClicked = false;

$(document).ready(function(){
  $("#calendar").zabuto_calendar({
    language: 'en',
    today: true,
    action: function() {
      return dateEvent(this.id);
    }
  });

  $('.delete-task').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/tasks/'+id,
      success: function(response){
        alert('Deleting task');
        window.location.href='/';
      },
      error: function(error){
        console.log(error);
      }
    })
  });

  $("#add-btn").on('click', function(){
    // If no date is clicked on calendar, today's date is chosen by default for task.
    if(!isDateClicked){
      document.getElementById('dueDate').value = new Date().toISOString();
    }
    $("#add-modal").modal('show');
  });

  $("#add-btn-modal").on('click', function(){
    $("#add-task-form").submit();
  })
});

function dateEvent(id){
  isDateClicked = true;
  var selectedDate = $("#" + id).data("date");
  selectedDate = new Date(selectedDate);
  selectedDate = selectedDate.toISOString();
  document.getElementById('dueDate').value = selectedDate;
  // Send selected date to render corresponding date's tasks
  $.ajax({
    method: 'GET',
    url: '/tasks/list',
    data: {selectedDate:selectedDate},
    success: function(response){
      alert('Refreshing your list..');
    },
    error: function(error){
      console.log(error);
    }
  });

  /** Refresh the tasks' list on the right, with list items added to html.
    * Show the checkboxes only if the user has logged in and mark them checked
    * by default if the status has been set 'complete'.
   **/
  $.get('/tasks/list', function(tasks){
    var $tasks = $('<ul class="list-group" id="task-list"></ul>');
    tasks.forEach(function(task){
      var checkBox;
      if (user){
        if (user._id==task.creator){
          checkBox = '<input type="checkbox" class="checkitem">';
        } else{
          checkBox = ''
        }
      } else {
        checkBox = '';
      }
      if(task.dueDate==selectedDate){
          var taskItem = '<li class="list-group-item">'+checkBox+
          `<a href="/tasks/${task._id}">${task.title}</a></li>`;
          if (user && task.isCompleted){
            checkBox = '<input type="checkbox" class="checkitem" checked="checked">';
            taskItem = '<strike><li class="list-group-item">'+checkBox+
            `<a href="/tasks/${task._id}">${task.title}</a></li></strike>`;
          }
          $tasks.append(taskItem);
      }
    });
    $("#task-list").html($tasks);
    if($tasks.children().length === 0){
      $("#task-list").html('<img src="../img/hooray.jpg" width="400"><br><h4> Hooray! No tasks for today.</h4>');
    }
  });
}

// Toggle strikethrough task item when checkbox is checked/unchecked.
// function toggle(){
$("#task-list").on('click', 'li', function(e){
  if ($(this).closest('li').find('input.checkitem').is(':checked')){
    ($(this).closest("li")).wrap("<strike>");
    var taskId = $(this).closest("li").find('a').attr('href').split('/')[2];
    updateTaskStatus(taskId, true);
  } else if(!($(this).closest('li').find('input.checkitem').is(':checked'))){
    ($(this).closest("li")).unwrap();
    var taskId = $(this).closest("li").find('a').attr('href').split('/')[2];
    updateTaskStatus(taskId, false);
  }
});

function updateTaskStatus(taskId, isComplete){
  $.ajax({
    url: '/tasks/taskStatus/',
    type: 'PUT',
    data: {taskId:taskId, isComplete:isComplete},
    success: function(response){
      alert('Updating task status..');
    },
    error: function(error){
      console.log(error);
    }
  });
}
