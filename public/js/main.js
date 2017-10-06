$(document).ready(function(){
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
});
