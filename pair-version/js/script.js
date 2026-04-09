(function () {
  "use strict";

  const tasks = [];
  let currentFilter = "all";
  let nextId = 1;

  const input = document.getElementById("task-input");
  const addButton = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const taskCount = document.getElementById("task-count");
  const filterButtons = document.querySelectorAll(".filter-btn");

  function addTask() {
    const title = input.value.trim();
    if (!title) return;

    tasks.push({
      id: nextId++,
      title: title,
      completed: false,
    });

    input.value = "";
    input.focus();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find(function (item) {
      return item.id === id;
    });
    if (!task) return;
    task.completed = !task.completed;
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    render();
  }

  function getFilteredTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (task) {
        return !task.completed;
      });
    }

    if (currentFilter === "completed") {
      return tasks.filter(function (task) {
        return task.completed;
      });
    }

    return tasks;
  }

  function renderList() {
    const visibleTasks = getFilteredTasks();
    taskList.innerHTML = "";

    if (visibleTasks.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "empty";
      emptyState.textContent = "No tasks to show.";
      taskList.appendChild(emptyState);
      return;
    }

    visibleTasks.forEach(function (task) {
      const item = document.createElement("li");
      item.className = "task-item" + (task.completed ? " completed" : "");
      item.dataset.taskId = String(task.id);
      item.textContent = task.title;
      taskList.appendChild(item);
    });
  }

  function renderCount() {
    const remaining = tasks.filter(function (task) {
      return !task.completed;
    }).length;

    const label = remaining === 1 ? "task" : "tasks";
    taskCount.textContent = remaining + " " + label + " remaining";
  }

  function renderFilterState() {
    filterButtons.forEach(function (button) {
      const isActive = button.dataset.filter === currentFilter;
      button.classList.toggle("is-active", isActive);
    });
  }

  function render() {
    renderList();
    renderCount();
    renderFilterState();
  }

  addButton.addEventListener("click", addTask);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  taskList.addEventListener("click", function (event) {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) return;
    toggleTask(Number(taskItem.dataset.taskId));
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.dataset.filter);
    });
  });

  render();
})();
