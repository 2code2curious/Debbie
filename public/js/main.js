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
    $("#add-modal").modal('show');
  });

  $("#add-btn-modal").on('click', function(){
    $("#add-task-form").submit();
  })
});

function dateEvent(id){
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

  // Refresh the tasks' list on the right, with list items added to html.
  $.get('/tasks/list', function(tasks){
    var $tasks = $('<ul class="list-group"></ul>');
    tasks.forEach(function(task){
      if(task.dueDate==selectedDate){
        $tasks.append(`<li class="list-group-item"><input type="checkbox">
        <a href="/tasks/list">${task.title}</a></li>`);
      }
    });
    $("#task-list").html($tasks);
  });
}
