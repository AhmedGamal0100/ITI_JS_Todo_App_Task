var inputTitle = document.querySelector("#todoInput");
var inputDesc = document.querySelector("#todoDescription");
var inputSearch = document.querySelector("#todoSearch");
var addBtn = document.querySelector("#addButton");
var doneBtn = document.querySelector("#doneButton");
var todoListToDisplay = document.querySelector("#todoList");

// ID Generator
function idGenerator() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 8 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(8);
    });
}

// Check Local Storage
var todoList = [];
if (localStorage.getItem("todoList")) {
    todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.forEach(element => {
        renderTodoList(element.title, element.description, element.id);
    });
}
// Search list that will change its content depending on the search elements
var todoSearchList = todoList;
if (todoSearchList.length != 0) {
    checkedPreviewForAllElements(todoSearchList);
}

// Add to the main list
addBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    inputTitleValue = inputTitle.value.trim();
    inputDescValue = inputDesc.value.trim();
    if (inputTitleValue != "" || inputDescValue != "") {
        todoList.push({
            id: idGenerator(),
            title: inputTitleValue,
            description: inputDescValue,
            completed: false
        });
        // Clearing all inputs
        clearInputs()
        renderTodoList(inputTitleValue, inputDescValue, todoList[todoList.length - 1].id);
        checkedPreviewForAllElements(todoSearchList);
        saveInLocalStorage(todoList);
    }
    else {
        alert("Please fill in the title or description.");
    }
});

// Add the new element to the window
function renderTodoList(title, description, Id) {

    let todoItem = document.createElement('li');
    todoItem.setAttribute("class", "todo-item");
    todoListToDisplay.appendChild(todoItem);

    let todoItemContainer = document.createElement('div');
    todoItemContainer.setAttribute("class", "todo-items-container");
    todoItem.appendChild(todoItemContainer);

    let todoText = document.createElement('span');
    todoText.setAttribute("class", "todo-text");
    let todoButtons = document.createElement('span');
    todoButtons.setAttribute("class", "todo-buttons");

    todoItemContainer.appendChild(todoText);
    todoItemContainer.appendChild(todoButtons);

    let todoTextTile = document.createElement('p');
    todoTextTile.setAttribute("class", "todo-text-title");
    todoTextTile.innerHTML = title;
    let todoTextDesc = document.createElement('p');
    todoTextDesc.setAttribute("class", "todo-text-Desc");
    todoTextDesc.innerHTML = description;

    todoText.appendChild(todoTextTile);
    todoText.appendChild(todoTextDesc);

    let checkButton = document.createElement('button');
    checkButton.setAttribute("class", "check-button");
    checkButton.addEventListener("click", function (e) {
        e.stopPropagation();
        let container = e.target.parentElement.parentElement;
        let checkButton = e.target;
        let editButton = e.target.nextElementSibling;
        checkElement(Id, container, checkButton, editButton);
    });
    checkButton.innerHTML = "Check";

    let editButton = document.createElement('button');
    editButton.setAttribute("class", "edit-button");
    editButton.addEventListener("click", function (e) {
        e.stopPropagation();
        let checkElement = e.target.previousElementSibling;
        let deleteElement = e.target.nextElementSibling;
        editElement(Id, checkElement, deleteElement);
    })
    editButton.innerHTML = "Edit";

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.addEventListener("click", function (e) {
        e.stopPropagation();
        deleteElement(Id);
    })
    deleteButton.innerHTML = "Delete";

    todoButtons.appendChild(checkButton);
    todoButtons.appendChild(editButton);
    todoButtons.appendChild(deleteButton);
}

// Save in the local storage
function saveInLocalStorage(todoListToLocalStorage) {
    localStorage.setItem("todoList", JSON.stringify(todoListToLocalStorage));
}

// To preview searching list
function searchPreview(list) {
    todoListToDisplay.innerHTML = "";
    list.filter(todo => {
        renderTodoList(todo.title, todo.description, todo.id);
    })
    checkedPreviewForAllElements(list);
}

// Search
inputSearch.addEventListener("input", function (e) {
    e.stopPropagation();
    disableAddButtonWhileSearching();
    if (inputSearch.value == "") {
        todoSearchList = todoList;
        todoListToDisplay.innerHTML = "";
        todoSearchList.forEach(element => {
            renderTodoList(element.title, element.description, element.id);
        });
        checkedPreviewForAllElements(todoSearchList);
    }
    else if (inputSearch.value.length != "") {
        todoSearchList = todoList.filter(todo =>
            todo.title.toLowerCase().includes(inputSearch.value.toLowerCase()));
        searchPreview(todoSearchList);
    }
});

// Empty the search bar input
function clearSearchBarPerAction() {
    inputSearch.value = "";
}

// Disable add button while searching
function disableAddButtonWhileSearching() {
    if (inputSearch.value != "") {
        addBtn.disabled = true;
        addBtn.style.cursor = "not-allowed";
        addBtn.style.backgroundColor = "#ccc";
    }
    else {
        addBtn.disabled = false;
        addBtn.style.cursor = "pointer";
        addBtn.style.backgroundColor = "#007bff";
    }
}

// Empty the inputs 
function clearInputs() {
    inputTitle.value = "";
    inputDesc.value = "";
}

// Delete the element from the list
function deleteElement(Id) {
    todoList = todoList.filter(todo => todo.id != Id);
    saveInLocalStorage(todoList);
    clearInputs()
    clearSearchBarPerAction();
    todoSearchList = todoList;
    todoListToDisplay.innerHTML = "";
    todoList.forEach(element => {
        renderTodoList(element.title, element.description, element.id);
    });
    searchPreview(todoSearchList);
}

// Edit the element from the list
var idToEdit = 0;
function editElement(Id, checkElement, deleteElement) {
    addBtn.classList.add("hidden-Btn");
    doneBtn.classList.remove("hidden-Btn");
    let todoToEdit = todoList.find(todo => todo.id == Id);
    inputTitle.value = todoToEdit.title;
    inputDesc.value = todoToEdit.description;
    disableBtnsWhileEdit(checkElement, deleteElement);
    idToEdit = Id;
}

// Disable the buttons while editing
function disableBtnsWhileEdit(checkElement, deleteElement) {
    deleteElement.disabled = true;
    deleteElement.style.cursor = "not-allowed";
    checkElement.disabled = true;
    checkElement.style.cursor = "not-allowed";
}

// Done button to save the edit changes
doneBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    let inputTitleValue = inputTitle.value.trim();
    let inputDescValue = inputDesc.value.trim();
    if (inputTitleValue != "" || inputDescValue != "") {
        let todoToEdit = todoList.find(element => element.id == idToEdit);
        todoToEdit.title = inputTitleValue;
        todoToEdit.description = inputDescValue;
        saveInLocalStorage(todoList);
        clearInputs()
        clearSearchBarPerAction();
        todoSearchList = todoList;
        todoListToDisplay.innerHTML = "";
        todoList.forEach(element => {
            renderTodoList(element.title, element.description, element.id);
        });
        addBtn.classList.remove("hidden-Btn");
        doneBtn.classList.add("hidden-Btn");
        checkedPreviewForAllElements(todoSearchList);
    }
    else {
        alert("Please fill in the title or description.");
    }
})

// Check the element from the list
function checkElement(Id, container, checkButton, editButton) {
    let checkElementItSelf = todoList.find(todo => todo.id == Id);
    if (checkElementItSelf.completed == false) {
        checkElementItSelf.completed = true;
    }
    else {
        checkElementItSelf.completed = false;
    }
    saveInLocalStorage(todoList);
    checkedPreviewForAllElements(todoSearchList);
}

// Check preview for selected elements
function checkedPreviewForAllElements(todoListToDisplay) {
    todoElements = document.querySelectorAll(".todo-item");

    console.log(todoElements);
    console.log(todoListToDisplay);

    for (let i = 0; i < todoListToDisplay.length; i++) {
        if (todoListToDisplay[i].completed == true) {
            todoElements[i].classList.add("checkDone");
            todoElements[i].querySelector(".check-button").innerHTML = "Uncheck";
            todoElements[i].querySelector(".edit-button").disabled = true;
        }
        else {
            todoElements[i].classList.remove("checkDone");
            todoElements[i].querySelector(".check-button").innerHTML = "Check";
            todoElements[i].querySelector(".edit-button").disabled = false;
        }
    }
}
