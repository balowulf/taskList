// Initialize Modals
$(document).ready(function(){
  $('.modal').modal({
  });
});

$(document).ready(function(){
  $('#new-task').modal({
    onCloseEnd: function() {
      addTask();
    }
  });
});

// Define UI Variables
const form          = document.querySelector('#task-form');
const taskList      = document.querySelector('.collection');
const newTask       = document.querySelector('.new-task');
const clearBtn      = document.querySelector('.clear-tasks');
const filter        = document.querySelector('#filter');
const taskInput     = document.querySelector('#task');
const confirmDelete = document.querySelector('.confirm-delete');
const confirmEdit   = document.querySelector('.confirm-edit');
const confirmClear  = document.querySelector('.confirm-clear');
const newTaskModal  = document.querySelector('#new-task');

// Load all event listeners
loadEventListeners();

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', getTasks);
  taskList.addEventListener('click', editDeleteTask);
  clearBtn.addEventListener('click', clearTasks);
  filter.addEventListener('keyup', filterTasks);
  newTask.addEventListener('click', checkEmptyTask);
}

// Event Listener Functions
function getTasks() {
  let tasks;

  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.style.background = '#333';
    li.appendChild(document.createTextNode(task));
    const deleteLink = document.createElement('a');
    const editLink = document.createElement('a');
    deleteLink.className = 'delete-item secondary-content modal-trigger';
    deleteLink.innerHTML = '<i class="fa fa-remove"></i>';
    editLink.className = 'edit-item secondary-content modal-trigger';
    editLink.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
    li.appendChild(deleteLink);
    li.appendChild(editLink);
    taskList.appendChild(li);
  });
}

function checkEmptyTask(e) {
  if (taskInput.value === '') {
    e.target.setAttribute('data-target', 'empty-task');
  } else {
    e.target.removeAttribute('data-target');
    openNewTaskModal(e);
  }
}

function openNewTaskModal(e) {
  if (e.target.classList.contains('new-task')) {
    e.target.setAttribute('data-target', 'new-task')
    // Insert task name as title in modal popup
    newTaskModal.firstElementChild.firstElementChild.textContent = taskInput.value;
  };
}

function addTask(e) {
  const li = document.createElement('li');
  li.className = 'collection-item';
  li.style.background = '#333';
  li.appendChild(document.createTextNode(taskInput.value));
  const deleteLink = document.createElement('a');
  const editLink = document.createElement('a');
  deleteLink.className = 'delete-item secondary-content modal-trigger';
  deleteLink.innerHTML = '<i class="fa fa-remove"></i>';
  editLink.className = 'edit-item secondary-content modal-trigger';
  editLink.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
  li.appendChild(deleteLink);
  li.appendChild(editLink);
  taskList.appendChild(li);
  
  let newTaskDescription = document.querySelector('#new-task-description').value;
  let newTaskDue         = document.querySelector('#new-task-due').value;
  let newTaskPriority    = document.querySelector('#new-task-priority').value;

  console.log(newTaskDescription);
  console.log(newTaskDue);
  console.log(newTaskPriority);
  
  storeTaskInLocalStorage(JSON.parse(
    `{
      "title": "${taskInput.value}", 
      "description": "${newTaskDescription}", 
      "due": "${newTaskDue}", 
      "priority": "${newTaskPriority}"
    }`
  )); // TODO: pass object containing inputs from addTask modal
  
  taskInput.value = '';

  
}

function storeTaskInLocalStorage(task) {
  let tasks;

  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  
  if (!tasks.includes(task)) {
    tasks.push(task);
  } 

  console.log(tasks);

  // localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('tasks', tasks[0]);
}

function editDeleteTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    e.target.parentElement.href = '#modal1';
    let task = e.target.parentElement.parentElement;
    confirmDelete.addEventListener('click', () => {
      task.remove();
      removeTaskFromLocalStorage(task);
    }); 
  } else if (e.target.parentElement.classList.contains('edit-item')) {
    e.target.parentElement.href = '#edit';
    let taskItem = e.target.parentElement.parentElement;
    confirmEdit.addEventListener('click', () => {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.forEach(task => {
        if (task !== '' && task === taskItem.textContent) {
          task = confirmEdit.previousElementSibling.children[0].value;
          replaceTask(taskItem.textContent, task);
        }
      });
    });
  }
}

function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  
  tasks.forEach((task, index) => {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function replaceTask(oldTask, newTask) {
  if (newTask === '') {
    return;
  }

  let tasks;

  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach((task, index) => {
    if (oldTask === task) {
      tasks[index] = newTask;
      console.log(tasks);
    }
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTasks(e) {
    tasks = localStorage.getItem('tasks');
    if (tasks === null) {
      console.log(e.target);
      e.target.removeAttribute('data-target');
    }
    e.target.href = '#modal2';
    confirmClear.addEventListener('click', () => {
      localStorage.clear();
    }); 
}

function filterTasks(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.collection-item').forEach(function(task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) !== -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}