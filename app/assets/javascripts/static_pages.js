$(document).on("turbolinks:load", function () {

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();
  let day = days[ d.getDay() ].toUpperCase();
  let month = months[ d.getMonth() ];
  let date = d.getDate();
  $('.date').append(`<h6 class="my-0"><b>${day}, </b>${month} ${date}</h6>`);

  if ($('.static_pages.index').length > 0) {
    var refreshData = function() {

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

        var sortedItems = taskItems.sort(function (a, b) {
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        });

        var htmlString = sortedItems.map(function(task) {
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

    // ---- Get all Tasks ----
    refreshData();

    // ---- Post a Task ----

    var createTask = function () {
      $.ajax({
        type: 'POST',
        url: 'api/tasks?api_key=1',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          task: {
            content: $('.add-input').val()
          }
        }),
        success: function (response, textStatus) {
          $('.add-input').val('');
          refreshData();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });  
    }
  
    $('#create-task').on('submit', function (e) {
      e.preventDefault();
      createTask();
    });

    // ---- Delete a Task by ID ----

    var deleteTask = function (id) {
      $.ajax({
        type: 'DELETE',
        url: 'api/tasks/' + id + '?api_key=1',
        success: function (response, textStatus) {
          refreshData();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    }
  
    $(document).on('click', '.delete-button', function () {
      deleteTask($(this).data('id'))
    });

    // ---- Mark task complete and active----

    var markTaskComplete = function (id) {
      $.ajax({
        type: 'PUT',
        url: 'api/tasks/' + id + '/mark_complete?api_key=1',
        dataType: 'json',
        success: function (response, textStatus) {
          refreshData();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    }

    var markTaskActive = function (id) {
      $.ajax({
        type: 'PUT',
        url: 'api/tasks/' + id + '/mark_active?api_key=1',
        dataType: 'json',
        success: function (response, textStatus) {
          refreshData();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    }

    $(document).on('change', '.mark-complete', function () {
      if (this.checked) {
        markTaskComplete($(this).data('id'));
      } else {
        markTaskActive($(this).data('id'));
      }
    });

    // ---- Filter active button ----

    $('.to-do-filter button').on('click', function() {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    refreshData();
  });
  }
});