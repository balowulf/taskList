// Define UI Variables
const form          = document.querySelector('#task-form');
const taskList      = document.querySelector('.collection');
const clearBtn      = document.querySelector('.clear-tasks');
const filter        = document.querySelector('#filter');
const taskInput     = document.querySelector('#task');
const confirmDelete = document.querySelector('.confirm-delete');
const confirmEdit   = document.querySelector('.confirm-edit');
const confirmClear  = document.querySelector('.confirm-clear');

// Load all event listeners
loadEventListeners();

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', getTasks);
  form.addEventListener('submit', addTask);
  taskList.addEventListener('click', editDeleteTask);
  clearBtn.addEventListener('click', clearTasks);
  filter.addEventListener('keyup', filterTasks);
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

function addTask(e) {
  if (taskInput.value === '') {
    alert('Add a task');
  }
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
  storeTaskInLocalStorage(taskInput.value);

  taskInput.value = '';
  
  e.preventDefault();
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

  localStorage.setItem('tasks', JSON.stringify(tasks));
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
        if (task === taskItem.textContent) {
          removeTaskFromLocalStorage(taskItem);
          task = confirmEdit.previousElementSibling.children[0].value;
          storeTaskInLocalStorage(task);
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

function clearTasks(e) {
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