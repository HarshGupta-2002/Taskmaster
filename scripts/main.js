document.addEventListener("DOMContentLoaded", function () {
    var taskArray = JSON.parse(localStorage.getItem("Tasks")) || [];

    var taskname = document.getElementById("taskname");
    var taskdate = document.getElementById("taskdate");
    var description = document.getElementById("description");

    var container = document.getElementById("container");
    var filterButton = document.getElementById("filter");
    var dropdown = document.getElementById("dropdown");

    function display() {
        var tbody = document.getElementById("tbody");
        tbody.innerHTML = ""; // Clear existing table rows
        var filteredTasks = filterTasks();

        if (!filteredTasks.length) {
            var newrow = tbody.insertRow(0);
            var cell = newrow.insertCell(0);
            cell.colSpan = 4;
            cell.id = "none";
            cell.innerHTML = "No Tasks Added";
        } else {
            filteredTasks.forEach((task, index) => {
                var newrow = tbody.insertRow(0);
                var cell0 = newrow.insertCell(0);
                var cell1 = newrow.insertCell(1);
                var cell2 = newrow.insertCell(2);
                var cell3 = newrow.insertCell(3);
                cell3.className = "crud";

                cell0.innerHTML = `<div class="taskContainer">${task.taskname} <div class="taskDescription">${task.description == "" ? "No Description" : task.description}</div></div>`;
                cell1.innerHTML = task.taskdate;
                cell2.innerHTML = task.status;
                cell3.innerHTML = `<div class="crudBtnContainer"><button class="crud completeButton" data-index="${index}"><i class="fa-solid fa-check"></i></button>
                                    <button class="crud deleteButton" data-index="${index}"><i class="fa-solid fa-trash"></i></button></div>`;
            });
        }
        attachDeleteEventListeners();
        attachCompleteEventListeners();
    }

    function filterTasks() {
        var filter = dropdown.getAttribute('data-status') || 'all';
        if (filter === "all") {
            return taskArray;
        } else {
            return taskArray.filter(task => task.status === filter);
        }
    }

    function attachDeleteEventListeners() {
        document.querySelectorAll('.deleteButton').forEach(button => {
            button.addEventListener('click', function() {
                var index = this.getAttribute('data-index');
                deleteTask(index);
            });
        });
    }

    function attachCompleteEventListeners() {
        document.querySelectorAll('.completeButton').forEach(button => {
            button.addEventListener('click', function() {
                var index = this.getAttribute('data-index');
                completeTask(index);
            });
        });
    }

    function deleteTask(index) {
        taskArray.splice(index, 1);
        localStorage.setItem("Tasks", JSON.stringify(taskArray));
        display();
        notif("Task Deleted Successfully", "green");
    }

    function completeTask(index) {
        var task = taskArray[index];
        task.status = (task.status === "pending") ? "completed" : "pending";
        localStorage.setItem("Tasks", JSON.stringify(taskArray));
        display();
        notif("Task Status Updated", "green");
    }

    display();

    var addtask = document.getElementById("addtask");
    addtask.addEventListener("click", function () {
        if (taskname.value == "" || taskdate.value == "") {
            notif("Please fill in all fields", "red");
        } else {
            var taskObject = {
                taskname: taskname.value,
                taskdate: taskdate.value,
                description: description.value,
                status: "pending"
            };

            taskArray.push(taskObject);
            localStorage.setItem("Tasks", JSON.stringify(taskArray));
            taskname.value = "";
            taskdate.value = "";
            description.value = "";

            notif("Task Added Successfully", "green");
            display();
        }
    });

    function notif(message, id) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.id = id;
        notification.innerHTML = message;
        container.appendChild(notification);

        setTimeout(disappear, 3000);
        function disappear() {
            notification.remove();
        }
    }

    var deleteAll = document.getElementById("deleteAll");
    deleteAll.addEventListener("click", function () {
        taskArray = [];
        display();
        localStorage.removeItem("Tasks");
        notif("All Tasks Deleted", "green");
    });

    filterButton.addEventListener("click", function() {
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    });

    dropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            var status = this.getAttribute('data-status');
            dropdown.setAttribute('data-status', status);
            if(status=="all") {
                filterButton.innerHTML = "Filter";
            }
            else {
                filterButton.innerHTML = status.charAt(0).toUpperCase() + status.slice(1);
            }
            display();
        });
    });

    window.addEventListener("click", function(event) {
        if (!event.target.matches('#filter')) {
            dropdown.style.display = "none";
        }
    });
});
