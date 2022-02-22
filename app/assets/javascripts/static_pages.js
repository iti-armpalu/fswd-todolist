$(document).on("turbolinks:load", function () {

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();
  let day = days[ d.getDay() ].toUpperCase();
  let month = months[ d.getMonth() ];
  let date = d.getDate();
  $('.date').append(`<h6 class="my-0"><b>${day}, </b>${month} ${date}</h6>`);

  if ($('.static_pages.index').length > 0) {
    indexTasks(function (response) {

      var returnActiveTasks = response.tasks.filter(function (task) {
        if (!task.completed) {
          return task.id;
        }
      });

      var returnCompletedTasks = response.tasks.filter(function (task) {
        if (task.completed) {
          return task.id;
        }
      });

      var filter = $('.active').attr('id');
  
        if (filter === 'all' || filter === '') {
          taskItems = response.tasks;
        }
        if (filter === 'active') {
          taskItems = returnActiveTasks;
        }
        if (filter === 'completed') {
          taskItems = returnCompletedTasks;
        }

      var htmlString = response.tasks.map(function(task) {
        return `
        <div class="task">
          <div class="checkbox-give-space custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input mark-complete" id="customCheck${task.id}" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
            <label class="custom-control-label" for="customCheck${task.id}"></label>
          </div>
          <p class="task-content ${task.completed ? 'crossed-out' : ''}">${task.content}</p>
          <button class="btn delete-button px-3" data-id="${task.id}"><i class="far fa-trash-alt"></i></button>
        </div>
      `;
      });
      $("#tasks").html(htmlString);

      $('.to-do-amount span').text(returnActiveTasks.length);
    });
  }


});