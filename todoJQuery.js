"use strict";
//CONSTANTS
const storedNameList = "storedNameList";
const storedStatusList = "storedStatusList";

//LISTENERS
//$(document).ready(createTodoListFromLocalStorage);
$(".add-task-btn").click(addTask);
$(".to-do-list").click(checkTaskClick);
$(".delete-completed-btn").click(deleteCompleted);
//FUNCTIONS

function addTask(event) {
    event.preventDefault();

    if (inputError()) {
        return;
    }
    const newTask = $("<li class='task'></li>");
    $(".to-do-list").append($(newTask));
    $(newTask).append($("<button class='task-complete-btn'>" +
        "<i class='fas fa-check'></i>" +
        "</button>"));
    $(newTask).append($("<div class='task-text'>" + $(".add-task-input").val() +
        "</div>"))
    $(newTask).append($("<button class='task-delete-btn'>" +
        "<i class='fas fa-trash'></i>" +
        "</button>"));
    //$(newTask).addClass("completed");
    $(".add-task-input").val("");
}

function checkTaskClick(event) {
    const item = $(event.target);
    if ($(item).hasClass("task-delete-btn")) {
        console.log($(item));
        deleteTask(item.parent());
    } else if ($(item).hasClass("task-complete-btn")) {
        $(item).parent().toggleClass("completed");
    }

}

function deleteCompleted() {
    $(".to-do-list").children().each(function(){
        if($(this).hasClass("completed")){
            console.log($(this));
            deleteTask($(this));
        }
    })
}

function deleteTask(task){
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