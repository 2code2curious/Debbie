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
  var date = $("#" + id).data("date");
  alert(date + " is clicked.");
  return true;
}
