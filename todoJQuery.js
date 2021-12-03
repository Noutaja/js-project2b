"use strict";
//CONSTANTS
const storedList = "storedList";

//LISTENERS
$(document).ready(function () {
    loadTodo()
    $(window).on('unload', function(){
        saveTodo();
    });
});
//window.onunload = saveTodo();


$(".add-task-btn").click(addTask);
//$(".add-task-btn").click(saveTodo);
$(".to-do-list").click(checkTaskClick);
$(".delete-completed-btn").click(deleteCompleted);
//FUNCTIONS

function addTask(event) {
    event.preventDefault();

    if (inputError()) {
        return;
    }

    createTaskElement();
    //$(newTask).addClass("completed");
    $(".add-task-input").val("");
}

function createTaskElement(name, complete) {
    const newTask = $("<li class='task'></li>");
    $(".to-do-list").append($(newTask));
    $(newTask).append($("<button class='task-complete-btn'>" +
        "<i class='fas fa-check'></i>" +
        "</button>"));
    if (name === undefined) {
        $(newTask).append($("<div class='task-text'>" + $(".add-task-input").val() +
            "</div>"))
    } else {
        $(newTask).append($("<div class='task-text'>" + name + "</div>"))
    }
    $(newTask).append($("<button class='task-delete-btn'>" +
        "<i class='fas fa-trash'></i>" +
        "</button>"));
    if(complete){
        $(newTask).addClass("completed");
    }
}

function checkTaskClick(event) {
    const item = $(event.target);
    if ($(item).hasClass("task-delete-btn")) {
        deleteTask(item.parent());
    } else if ($(item).hasClass("task-complete-btn")) {
        $(item).parent().toggleClass("completed");
    }

}

function deleteCompleted() {
    $(".to-do-list").children().each(function () {
        if ($(this).hasClass("completed")) {
            deleteTask($(this));
        }
    })
}

function deleteTask(task) {
    $(task).css("position", "relative");
    $(task).animate({
        right: '100px'
    }, { duration: 'slow', queue: false });
    $(task).fadeOut("slow", function () {
        // Animation complete.
        $(task).remove();
    });
}

function inputError() {
    $(".error-message").val("");

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

function loadTodo() {
    const list = getLocalStorageTable(storedList);

    for (let i = 0; i < list.length; i++) {
        const task = list[i];
        createTaskElement(task.name, task.completed);
    }
}

function saveTodo() {
    let array = [];

    //regular DOM because jQuery seemed way more complicated
    const todoList = document.querySelector(".to-do-list");

    if (todoList.children.length > 0) {
        for (let i = 0; i < todoList.children.length; i++) {
            const name = todoList.children[i].children[1].innerText;
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

$(function () {
    $(".to-do-list").sortable();
});