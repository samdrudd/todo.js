var data = JSON.parse(localStorage.getItem("todoData"));
data = data || {};

// -------------------------------------------------
// FUNCTION: createTask
// ACCEPTS: string title, string desc
// RETURNS: task object
// -------------------------------------------------
function createTask(title, desc)
{
  // Generate ID and return JSON object
  today = new Date();

  id = today.getTime();

  todaysDate = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear();

  return {id: id, title: title, desc: desc, status: 0, created: todaysDate}
}

// -------------------------------------------------
// FUNCTION: addTask
// ACCEPTS: Object task (returned from createTask)
// Adds given task to data array and localStorage
//
// -------------------------------------------------
function addTask(task)
{
  // Add task to localStorage
  data[task.id] = task;
  var taskDiv = $("#" + task.id);

  localStorage.setItem("todoData", JSON.stringify(data));

  addTaskToList(task);
  taskDiv.hide();
  taskDiv.fadeIn(500);
}

// -------------------------------------------------
// FUNCTION: clearTasks
// Clears list as well as localStorage
// -------------------------------------------------
function clearTasks()
{
  // Prompt for confirmation
  if (confirm("Click OK to delete all tasks."))
  {
    // Clear list and localStorage
    localStorage.clear();
    data = {};
    clearList(true, true);
  }
}

// -------------------------------------------------
// FUNCTION: deleteTask
// ACCEPTS: id of task to delete
// Removes task with associated id from data
// Pushes updated data to localStorage
// -------------------------------------------------
function deleteTask(taskid)
{
	var taskObj = $("#" + taskid);

	taskObj.addClass("deleting");

    // Confirm and delete the task
    if (confirm("Click OK to delete task:\n\n" + data[taskid].title))
    {
      // Remove the task from the data array
      delete data[taskid];

      // Push data to localStorage
      localStorage.setItem("todoData", JSON.stringify(data));

      // Remove corresponding div from list
      $("#" + taskid).fadeOut(500);
	}
	else
	{
		taskObj.removeClass("deleting");
	}
}

// -------------------------------------------------
// FUNCTION: doneTask
// ACCEPTS: id of task to mark done
// Collapses task's div and highlights it green to
// indicate the task has been completed
// -------------------------------------------------
function doneTask(taskid)
{
  var task = $("#" + taskid);

  // If the task is not already marked completed...
  if (!task.hasClass("completed"))
  {
	task.addClass("completed");
	// Change the checkmark circle icon from open to filled to further indicate task completion
	$("#" + taskid + "-done").removeClass("fa-check-circle-o").addClass("fa-check-circle");

	// Slide up task description and add 'completed' class to it
    $("#" + taskid + " .description, #" + taskid + " h4").slideUp();

	// Fade out the task and fade it back in under the 'completed tasks' section
	task.fadeOut(function() {
		task.remove().appendTo("#container_tasks_completed").fadeIn();
	});

	// Store completion status in localStorage data
	data[taskid].status = 1;
  }
  // If the task is already marked as completed
  else
  {
	// Remove 'completed' class and change checkmark circle icon from filled to open
	task.removeClass("completed");
	$("#" + taskid + "-done").removeClass("fa-check-circle").addClass("fa-check-circle-o");

	// Slide down the description
	$("#" + taskid + " .description, #" + taskid + " h4").slideDown();

	task.fadeOut(function() {
		task.remove().appendTo("#container_tasks_uncompleted").fadeIn();
	});

	// Store completion status in localStorage data
	data[taskid].status = 0;
  }

  // Push data to localStorage
  // @TODO: Probably should create a 'pushData' function to encapsulate this
  localStorage.setItem("todoData", JSON.stringify(data));
}

// -------------------------------------------------
// FUNCTION: addTaskToList
// ACCEPTS: task - task object to add to list
// Creates and displays HTML associated with task object
// -------------------------------------------------
function addTaskToList(task)
{
  // Create the delete button
  var delButton = $("<span>", {
	class: "fa fa-ban action delete",
	title: "Delete",
	onClick: "deleteTask(" + task.id + ");"});

  // Create done button
  var doneButton = $("<span>", {
    id: task.id + "-done",
	class: "fa fa-check-circle-o action done",
	title: "Done",
	onClick: "doneTask(" + task.id + ");"});

  // Create task div
  var taskDiv = $("<div>", {
    id: task.id,
	style: "",
	class: "task"});

  taskDiv.append(delButton);
  taskDiv.append(doneButton);

  taskDiv.append("<h3>" + task.title + "</h3><h4>Created: " + task.created + "</h4><span class='description' style=''>" + task.desc + "</span>");



  // If task is stored as completed
  if (task.status === 1)
  {
    $("#container_tasks_completed").append(taskDiv);
    $("#" + taskid + "-done").removeClass("fa-check-circle-o").addClass("fa-check-circle");
	taskDiv.addClass("completed");
	$("#" + taskid + " .description, #" + taskid + " h4").hide();

  }
  else
	$("#container_tasks_uncompleted").append(taskDiv);
}

// -------------------------------------------------
// FUNCTION: clearList
// ACCEPTS:
//   completed - boolean, if true clear completed tasks
//   uncompleted - boolean, if true clear uncompleted tasks
// Clears out HTML list of taks (DOES NOT UPDATE localStorage)
// @TODO: Make separate 'clearCompletedTasks' and 'clearUncompletedTasks' that call into this function
// -------------------------------------------------
function clearList(completed, uncompleted)
{
	if (completed)
	{
		$("#container_tasks_completed").find('*').not('.header').remove();
	}

	if (uncompleted)
	{
		$("#container_tasks_uncompleted").find('*').not('.header').remove();
	}
}

// -------------------------------------------------
// FUNCTION: updateList
// Clears HTML list and updates it with data currently
// in localStorage
// -------------------------------------------------
function updateList()
{
  // Clear list
  clearList(true, true);

  // Repopulate with tasks from data
  for (taskid in data)
  {
    addTaskToList(data[taskid]);
  }
}


// DOCUMENT.READY
$( document ).ready(function() {
var data = {};

// Initalize list from localStorage
updateList();

// -----------------------------------------------
// FUNCTION: ADD TASK
// Adds a task to the list and to localStorage
// @TODO: Create separate function for this and add onClick to add task button, to follow same pattern as rest of app
// -----------------------------------------------
$( "#add-task" ).click(function() {
  // Get task info from form
  var title = $("#task-title").val();
  var desc = $("#task-desc").val();

  // If no title, don't add anything
  if (title === "") return;

  // Create task, add it to list and localStorage
  var tasktoadd = createTask(title, desc);
  addTask(tasktoadd);

  // Clear form
  $("#task-title").val("");
  $("#task-desc").val("");
}); // END FUNCTION: ADD TASK

// Keep add task form with you as you scroll
$(window).scroll(function() {
  $("#add_task_container").animate({"marginTop": ($(window).scrollTop() + 5) + "px"}, 0);
});

}); // END DOCUMENT.READY