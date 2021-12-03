"use strict";
//CONSTANTS
const storedList = "storedList";

//LISTENERS
$(document).ready(function () {
    loadTodo(); //load from LocalStorage when ready
    $(window).on('unload', function(){ //save when closing tab
        saveTodo();
    });
});
$(".add-task-btn").click(addTask);
$(".to-do-list").click(checkTaskClick);
$(".delete-completed-btn").click(deleteCompleted);
//FUNCTIONS

//adds a new task via used input
function addTask(event) {
    event.preventDefault();

    if (inputError()) {
        return;
    }

    createTaskElement();
    $(".add-task-input").val("");
}

//creates a new task element
function createTaskElement(name, complete) {
    //main li
    const newTask = $("<li class='task'></li>");
    $(".to-do-list").append($(newTask));

    //complete button
    $(newTask).append($("<button class='task-complete-btn'>" +
        "<i class='fas fa-check'></i>" +
        "</button>"));

    //name, read from parameters when loading from LocalStorage
    if (name === undefined) {
        $(newTask).append($("<div class='task-text'>" + $(".add-task-input").val() +
            "</div>"))
    } else {
        $(newTask).append($("<div class='task-text'>" + name + "</div>"))
    }

    //delete button
    $(newTask).append($("<button class='task-delete-btn'>" +
        "<i class='fas fa-trash'></i>" +
        "</button>"));

    //check if completed
    if(complete){
        $(newTask).addClass("completed");
    }
}

//check which button on a task was clicked
function checkTaskClick(event) {
    const item = $(event.target);
    if ($(item).hasClass("task-delete-btn")) {
        deleteTask(item.parent());
    } else if ($(item).hasClass("task-complete-btn")) {
        $(item).parent().toggleClass("completed");
    }

}

//delete all completed tasks
function deleteCompleted() {
    $(".to-do-list").children().each(function () {
        if ($(this).hasClass("completed")) {
            deleteTask($(this));
        }
    })
}

//delete a task
function deleteTask(task) {
    $(task).css("position", "relative"); //relative needed for movement
    $(task).animate({
        right: '100px'
    }, { duration: 'slow', queue: false });
    $(task).fadeOut("slow", function () {
        // animation complete
        $(task).remove(); //actual deletion
    });
}

//check for input errors
function inputError() {
    //clear old errors
    $(".error-message").val("");

    //check if input under 3 characters long
    if ($(".add-task-input").val().length < 3) {
        $(".error-message").text("The task must be longer than 2 letters!");
        $(".add-task-input").addClass("error");
        $(".error-message").show();
        $(".add-task-input").on("transitionend", function () {
            $(".add-task-input").removeClass("error");
        })
        return true
    }
    $(".error-message").hide();
    return false;
}

//load the list from LocalStorage
function loadTodo() {
    const list = getLocalStorageTable(storedList);

    for (let i = 0; i < list.length; i++) {
        const task = list[i];
        createTaskElement(task.name, task.completed);
    }
}

//save the list to LocalStorage
function saveTodo() {
    let array = [];

    //regular DOM because jQuery seemed way more complicated
    const todoList = document.querySelector(".to-do-list");

    if (todoList.children.length > 0) {
        for (let i = 0; i < todoList.children.length; i++) {
            //dig down deep enough to find the task name
            const name = todoList.children[i].children[1].innerText;
            //and the completion status
            if (todoList.children[i].classList.contains("completed")) {
                array.push({ name: name, completed: true });
            } else {
                array.push({ name: name, completed: false });
            }
        }
    }
    saveToLocalStorage(storedList, array);
}

//saves data to LocalStorage
function saveToLocalStorage(localStorageName, data) {
    localStorage.setItem(localStorageName, JSON.stringify(data));
}

//get a LocalStorage table
function getLocalStorageTable(localStorageName) {
    let storedData;
    //check if data already exists in storage
    if (localStorage.getItem(localStorageName) === null) {
        storedData = []; //create new if not
    } else {
        storedData = JSON.parse(localStorage.getItem(localStorageName)); //parse from existing
    }
    return storedData;
}

//drag and drop functionality
$(function () {
    $(".to-do-list").sortable();
});