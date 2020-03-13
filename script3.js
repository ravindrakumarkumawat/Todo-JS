function init() {
    const listsContainer = document.querySelector('[data-lists]') // Task container ul
    const newListForm = document.querySelector('[data-new-list-form]') // Task form event is submit
    const newListInput = document.querySelector('[data-new-list-input]') // for taking the value of input for task
    const deleteListButton = document.querySelector('[data-delete-list-button]')
    const deleteTaskButton = document.querySelector('[data-delete-task-button]')
    const backListButton = document.querySelector('[data-back-list-button]')
    const backTaskButton = document.querySelector('[data-back-task-button]')
    const listDisplayContainer = document.querySelector('[data-list-display-container]')

    const taskPriorityContainer = document.querySelector('[data-task-priority-container]')


    const listTitleElement = document.querySelector('[data-list-title]')
    const listCountElement = document.querySelector('[data-list-count]')

    const tasksContainer = document.querySelector('[data-tasks]')
    const newTaskForm = document.querySelector('[data-new-task-form]')
    const newTaskInput = document.querySelector('[data-new-task-input]')

    const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

    //Priority Container
    const addTaskPriority = document.querySelector('[data-add-task-priority]')
    const noteText = document.querySelector('[data-note-text]')
    const datePriority = document.querySelector('[data-date-priority]')
    const selectPriority = document.querySelector('[data-select-priority]')

    const LOCAL_STORAGE_LIST_KEY = "task.lists"
    const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"

    let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
    let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

    let selectedParaId = null


    // Selecting the List
    listsContainer.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'li') {
            selectedListId = e.target.dataset.listId
            save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
            render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
        }
    })

    // Selecting the Task Item 
    tasksContainer.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'p') {
            selectedParaId = e.target.dataset.paraId
            //console.log(selectedParaId)
            save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
            render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
        }
    })


    // Checkbox the Task Item
    tasksContainer.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') {
            const selectedList = lists.find(list => list.id === selectedListId)
            const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
            selectedTask.complete = e.target.checked
            save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
            renderTaskCount(selectedList, listCountElement)
        }
    })


    // Clearing the task those are completed
    clearCompleteTasksButton.addEventListener('click', (e) => {
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })


    // Deleting everything for list to list item
    deleteListButton.addEventListener('click', (e) => {
        lists = lists.filter(list => list.id !== selectedListId)
        selectedListId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })

    // Deleting everything for list to list item
    deleteTaskButton.addEventListener('click', (e) => {
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => task.id !== selectedParaId)
        selectedParaId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })

    // back from task
    backListButton.addEventListener('click', (e) => {
        listDisplayContainer.style.display = 'none'
        selectedListId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })

    // Back from task priority
    backTaskButton.addEventListener('click', (e) => {
        taskPriorityContainer.style.display = 'none'
        selectedParaId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })


    // Adding New list
    newListForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const listName = newListInput.value
        if (!listName) return
        const list = createList(listName)
        newListInput.value = null
        lists.push(list)
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })


    // Adding new Task Item
    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const taskName = newTaskInput.value
        if (!taskName) return
        const task = createTask(taskName)
        newTaskInput.value = null
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks.push(task)
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })

    // Adding Priority Container
    addTaskPriority.addEventListener('click', (e) => {
        const selectedList = lists.find(list => list.id === selectedListId)
        const paraList = selectedList.tasks.find(list => list.id === selectedParaId)
        if (noteText.value) {
            paraList.noteText = noteText.value
        } else {
            paraList.noteText = ""
        }

        if (datePriority.value) {
            paraList.displayDate = datePriority.value
        } else {
            paraList.displayDate = ''
        }

        if (selectPriority.value !== 'none') {
            if (selectPriority.value === 'low') {
                paraList.lowPriority = true
                paraList.mediumPriority = false
                paraList.highPriority = false
                paraList.priorityValue = 'Low'
            }
            if (selectPriority.value === 'medium') {
                paraList.lowPriority = false
                paraList.mediumPriority = true
                paraList.highPriority = false
                paraList.priorityValue = 'Medium'
            }
            if (selectPriority.value === 'high') {
                paraList.lowPriority = false
                paraList.mediumPriority = false
                paraList.highPriority = true
                paraList.priorityValue = 'High'
            }
        } else {
            paraList.priority = false
            paraList.lowPriority = false
            paraList.mediumPriority = false
            paraList.highPriority = false
            paraList.priorityValue = 'None'
        }

        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
    })

    render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority)
}

init()


// This is format of create task
function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}


// This is the task item
function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false,
        noteText: "",
        displayDate: '',
        lowPriority: false,
        mediumPriority: false,
        highPriority: false,
        priorityValue: "None"
    }
}



// Saving to the Local storage
function save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId) {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}


// Rendering the task or task item
function render(listsContainer, lists, selectedListId, listDisplayContainer, listTitleElement, listCountElement, selectedParaId, taskPriorityContainer, tasksContainer, noteText, datePriority, selectPriority) {
    clearElement(listsContainer)
    renderLists(lists, selectedListId, listsContainer)
    const selectedList = lists.find(list => list.id === selectedListId)
    if (!selectedList) {
        taskPriorityContainer.style.display = 'none'
        listDisplayContainer.style.display = 'none'
        document.querySelector('.all-tasks').style.display = ''
    } else {
        document.querySelector('.all-tasks').style.display = 'none'
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList, listCountElement)
        clearElement(tasksContainer)
        renderTasks(selectedList, tasksContainer, selectedParaId)
        const paraList = selectedList.tasks.find(list => list.id === selectedParaId)

        if (!paraList) {
            taskPriorityContainer.style.display = 'none'
            listDisplayContainer.style.display = ''
            document.querySelector('.all-tasks').style.display = 'none'
        }
        else {
            taskPriorityContainer.style.display = ''
            listDisplayContainer.style.display = ''  //none
            document.querySelector('.all-tasks').style.display = 'none'
            renderPriority(paraList, noteText, datePriority, selectPriority)
        }
    }
}

// Showing the count of task left
function renderTaskCount(selectedList, listCountElement) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


// rendering the task list
function renderLists(lists, selectedListId, listsContainer) {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id //dataset
        listElement.classList.add('list-name')
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}


// Rendering the task item
function renderTasks(selectedList, tasksContainer, selectedParaId) {
    const highPriority = []
    const mediumPriority = []
    const lowPriority = []
    const nonePriority = []
    selectedList.tasks.forEach(task => {
        if (task.highPriority) highPriority.push(task)
        if (task.mediumPriority) mediumPriority.push(task)
        if (task.lowPriority) lowPriority.push(task)
        if (task.priorityValue.toLowerCase() === "none") nonePriority.push(task)
    })
    const highPriority1 = filterTask(highPriority)
    const mediumPriority1 = filterTask(mediumPriority)
    const lowPriority1 = filterTask(lowPriority)
    const nonePriority1 = filterTask(nonePriority)
    selectedList.tasks = []
    const concatPrio = highPriority1.concat(mediumPriority1).concat(lowPriority1).concat(nonePriority1)
    for (let task of concatPrio) {
        selectedList.tasks.push(task)
    }
    //selectedList.tasks.push()
    selectedList.tasks.forEach(task => {
        const taskElement = document.createElement('div')
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const p = document.createElement('p')
        p.style.display = 'inline'
        p.dataset.paraId = task.id
        p.innerText = task.name
        if(task.id === selectedParaId){
            p.classList.add('active-task')
        }
        taskElement.appendChild(checkbox)
        taskElement.appendChild(p)
        tasksContainer.appendChild(taskElement)
    })
}

// Rendering the task Priority
function renderPriority(paraList, noteText, datePriority, selectPriority) {
    const taskTitleElement = document.querySelector('[data-task-title]')
    taskTitleElement.innerText = paraList.name
    noteText.value = paraList.noteText
    datePriority.value = paraList.displayDate
    const prior = ['None', 'High', 'Medium', 'Low']
    const index = prior.indexOf(paraList.priorityValue)
    selectPriority.selectedIndex = index.toString()
}

function filterTask(priorityTask){
    const noDate = []
    const highAfter = []
    const highBefore = []
    priorityTask.forEach(task => {
        if (!task.displayDate) {
            noDate.push(task)
        } else if (new Date(task.displayDate).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) {
            highBefore.push(task)
        } else {
            highAfter.push(task)
        }
    })
    highBefore.sort(function (a, b) {
        const dateA = new Date(a.displayDate), dateB = new Date(b.displayDate);
        return dateB - dateA;
    })
    highAfter.sort(function (a, b) {
        const dateA = new Date(a.displayDate), dateB = new Date(b.displayDate);
        return dateA - dateB;
    })
    return [].concat(highAfter).concat(highBefore).concat(noDate)
}


// Clearing the childnode if exist
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
