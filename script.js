const LOCAL_STORAGE_LIST_KEY = "task.lists"
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = null
// List
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const listsContainer = document.querySelector('[data-lists]')

newListForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const listName = newListInput.value
    if (!listName) return
    const list = createList(listName) // Creating List
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

// Search List
newListForm.addEventListener('keyup', (e) => {
    const listName = newListInput.value
    const regex = RegExp(listName)
    if (!listName) renderLists()
    const searchList = []
    lists.forEach(list => {
        if (regex.test(list.name)) {
            searchList.push(list)
        }
    })
    clearElement(listsContainer)
    searchList.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-name')
        listElement.innerText = list.name
        if (list.id === selectedListId) listElement.classList.add('active-list')
        listsContainer.appendChild(listElement)
    })
})

// Selecting List 
listsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') selectedListId = e.target.dataset.listId
    render()
})
function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}


const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const tasksContainer = document.querySelector('[data-tasks]')
let selectedParaId = null

newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (!taskName) return
    const task = createTask(taskName) // Creating Task
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

newTaskForm.addEventListener('keyup', (e)=> {
    const taskName = newTaskInput.value
    const regex = RegExp(taskName)
    if(!taskName) renderTasks()
    const searchTask = []
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.find(task => {
        if (regex.test(task.name)){
            searchTask.push(task)
        }
    })
    clearElement(tasksContainer)
    searchTask.forEach(task => {
        const taskElement = document.createElement('div')
        if (task.priorityValue === "high") taskElement.classList.add('red')
        if (task.priorityValue === "medium") taskElement.classList.add('yellow')
        if (task.priorityValue === "low") taskElement.classList.add('green')
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const p = document.createElement('p')
        p.style.display = 'inline'
        p.dataset.paraId = task.id
        p.innerText = task.name
        if (task.id === selectedParaId) p.classList.add('active-task')
        taskElement.appendChild(checkbox)
        taskElement.appendChild(p)
        tasksContainer.appendChild(taskElement) 
    })
})

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false,
        noteText: "",
        displayDate: '',
        priorityValue: "none"
    }
}

// Selecting Task Item 
tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'P') selectedParaId = e.target.dataset.paraId
    render()
})

// Checkbox Task Item 
tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount()
    }
})

const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
clearCompleteTasksButton.addEventListener('click', (e) => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

const deleteListButton = document.querySelector('[data-delete-list-button]')
deleteListButton.addEventListener('click', (e) => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

const backListButton = document.querySelector('[data-back-list-button]')
backListButton.addEventListener('click', (e) => {
    taskDisplayContainer.style.display = 'none'
    selectedListId = null
    selectedParaId = null
    saveAndRender()
})

const deleteTaskButton = document.querySelector('[data-delete-task-button]')
deleteTaskButton.addEventListener('click', (e) => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== selectedParaId)
    selectedParaId = null
    saveAndRender()
})

const backTaskButton = document.querySelector('[data-back-task-button]')
backTaskButton.addEventListener('click', (e) => {
    taskPriorityContainer.style.display = 'none'
    selectedParaId = null
    saveAndRender()
})

// Add Priority Container
const addTaskPriority = document.querySelector('[data-add-task-priority]')
addTaskPriority.addEventListener('click', (e) => {
    const selectedList = lists.find(list => list.id === selectedListId)
    const paraTask = selectedList.tasks.find(list => list.id === selectedParaId)
    if (!noteText.value) paraTask.noteText = ""
    paraTask.noteText = noteText.value
    if (!datePriority.value) paraTask.displayDate = ''
    paraTask.displayDate = datePriority.value
    paraTask.priorityValue = selectPriority.value
    saveAndRender()
})

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
}

function saveAndRender() {
    save()
    render()
}

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const taskDisplayContainer = document.querySelector('[data-task-display-container]')
const taskPriorityContainer = document.querySelector('[data-task-priority-container]')
const listTitleElement = document.querySelector('[data-list-title]')

// Update list name
const editList = document.querySelector('[data-edit-list]')
editList.style.display = 'none'
editList.style.width = "70%"
listTitleElement.addEventListener('click', (e) => {
    const selectedList = lists.find(list => list.id === selectedListId)
    editList.style.display = ''
    const updatedList = document.querySelector('[data-updated-list-name]')
    const updateList = document.querySelector('[data-edit-list]')
    updateList.addEventListener('click', (e) => {
        e.preventDefault()
        const updateListName = updatedList.value
        if (!updateListName) return
        selectedList.name = updateListName
        updatedList.value = null
        editList.style.display = 'none'
        saveAndRender()
    })
})


function render() {
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if (!selectedList) {
        listDisplayContainer.style.display = ''
        taskDisplayContainer.style.display = 'none'
        taskPriorityContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = 'none'
        taskDisplayContainer.style.display = ''
        taskPriorityContainer.style.display = 'none'
        listTitleElement.innerText = selectedList.name
        renderTaskCount()
        renderTasks()
        renderPriority()
    }

}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-name')
        listElement.innerText = list.name
        if (list.id === selectedListId) listElement.classList.add('active-list')
        listsContainer.appendChild(listElement)
    })
}

function renderTasks() {
    clearElement(tasksContainer)
    const selectedList = priorityFilter()
    selectedList.tasks.forEach(task => {
        const taskElement = document.createElement('div')
        if (task.priorityValue === "high") taskElement.classList.add('red')
        if (task.priorityValue === "medium") taskElement.classList.add('yellow')
        if (task.priorityValue === "low") taskElement.classList.add('green')
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const p = document.createElement('p')
        p.style.display = 'inline'
        p.dataset.paraId = task.id
        p.innerText = task.name
        if (task.id === selectedParaId) p.classList.add('active-task')
        taskElement.appendChild(checkbox)
        taskElement.appendChild(p)
        tasksContainer.appendChild(taskElement)
    })
}

const listCountElement = document.querySelector('[data-list-count]')
function renderTaskCount() {
    const selectedList = lists.find(list => list.id === selectedListId)
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function priorityFilter() {
    const selectedList = lists.find(list => list.id === selectedListId)
    const highPriority = []
    const mediumPriority = []
    const lowPriority = []
    const nonePriority = []
    selectedList.tasks.forEach(task => {
        if (task.priorityValue === "high") highPriority.push(task)
        if (task.priorityValue === "medium") mediumPriority.push(task)
        if (task.priorityValue === "low") lowPriority.push(task)
        if (task.priorityValue === "none") nonePriority.push(task)
    })
    const highPriority1 = filterDate(highPriority)
    const mediumPriority1 = filterDate(mediumPriority)
    const lowPriority1 = filterDate(lowPriority)
    const nonePriority1 = filterDate(nonePriority)
    selectedList.tasks = []
    const concatPrio = highPriority1.concat(mediumPriority1).concat(lowPriority1).concat(nonePriority1)
    for (let task of concatPrio) {
        selectedList.tasks.push(task)
    }
    return selectedList
}

const taskTitleElement = document.querySelector('[data-task-title]')
const noteText = document.querySelector('[data-note-text]')
const datePriority = document.querySelector('[data-date-priority]')
const selectPriority = document.querySelector('[data-select-priority]')

// Updated Task
const editTask = document.querySelector('[data-edit-task]')
editTask.style.display = 'none'
editTask.style.width = "70%"
taskTitleElement.addEventListener('click', (e) => {
    const selectedList = lists.find(list => list.id === selectedListId)
    const paraTask = selectedList.tasks.find(list => list.id === selectedParaId)
    editTask.style.display = ''
    const updatedTask = document.querySelector('[data-updated-task-name]')
    const updateTask = document.querySelector('[data-update-task]')
    updateTask.addEventListener('click', (e) => {
        e.preventDefault()
        const updateTaskName = updatedTask.value
        if (!updateTaskName) return
        paraTask.name = updateTaskName
        updatedTask.value = null
        editTask.style.display = 'none'
        saveAndRender()
    })

})

function renderPriority() {
    const selectedList = lists.find(list => list.id === selectedListId)
    const paraTask = selectedList.tasks.find(list => list.id === selectedParaId)
    if (!paraTask) {
        listDisplayContainer.style.display = 'none'
        taskDisplayContainer.style.display = ''
        taskPriorityContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = 'none'
        taskDisplayContainer.style.display = ''
        taskPriorityContainer.style.display = ''
        taskTitleElement.innerText = paraTask.name
        noteText.value = paraTask.noteText
        datePriority.value = paraTask.displayDate
        const option = ['none', 'high', 'medium', 'low']
        const index = option.indexOf(paraTask.priorityValue)
        selectPriority.selectedIndex = index.toString()
    }
}

function filterDate(priorityFilter) {
    const noDate = []
    const highAfter = []
    const highBefore = []
    priorityFilter.forEach(task => {
        if (!task.displayDate) noDate.push(task)
        if (task.displayDate && new Date(task.displayDate).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) highBefore.push(task)
        if (task.displayDate && new Date(task.displayDate).toISOString().slice(0, 10) >= new Date().toISOString().slice(0, 10)) highAfter.push(task)
    })
    highBefore.sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate))
    highAfter.sort((a, b) => new Date(a.displayDate) - new Date(b.displayDate))
    return [].concat(highAfter).concat(highBefore).concat(noDate)
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()


