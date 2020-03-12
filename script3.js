function init(){
    const listsContainer = document.querySelector('[data-lists]') // Task container ul
    const newListForm = document.querySelector('[data-new-list-form]') // Task form event is submit
    const newListInput = document.querySelector('[data-new-list-input]') // for taking the value of input for task
    const deleteListButton = document.querySelector('[data-delete-list-button]')
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
            render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
        }
    })    

    // Selecting the Task Item 
    tasksContainer.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'p'){
           selectedParaId = e.target.dataset.paraId
           //console.log(selectedParaId)
           save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
           render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
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
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
    })


    // Deleting everything for list to list item
    deleteListButton.addEventListener('click', (e) => {
        lists = lists.filter(list => list.id !== selectedListId)
        selectedListId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
    })

    backListButton.addEventListener('click', (e) => {
        listDisplayContainer.style.display = 'none'
        selectedListId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
    })

    backTaskButton.addEventListener('click', (e) => {
        taskPriorityContainer.style.display = 'none'
        selectedParaId = null
        save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
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
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
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
        render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
    })

    render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer)
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
        priority: false,
        low: false,
        medium: false,
        high: false,
        content:'',
        due: false
    }
}



// Saving to the Local storage
function save(LOCAL_STORAGE_LIST_KEY, lists, LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId) {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}


// Rendering the task or task item
function render(listsContainer, lists, selectedListId,  listDisplayContainer, listTitleElement,listCountElement, selectedParaId, taskPriorityContainer, tasksContainer) {
    clearElement(listsContainer)
    renderLists(lists, selectedListId, listsContainer)
    const selectedList = lists.find(list => list.id === selectedListId)
    //console.log(selectedList)
    // console.log(selectedList.tasks)
    // console.log(selectedParaId)
    if (!selectedList) {
        taskPriorityContainer.style.display ='none'
        listDisplayContainer.style.display = 'none'
        document.querySelector('.all-tasks').style.display = ''
    } else {
        document.querySelector('.all-tasks').style.display = 'none'
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList, listCountElement)
        clearElement(tasksContainer)
        renderTasks(selectedList,  tasksContainer)
        const paraList = selectedList.tasks.find(list => list.id === selectedParaId)
        if(!paraList){
            taskPriorityContainer.style.display ='none'
            listDisplayContainer.style.display =''
            document.querySelector('.all-tasks').style.display = 'none'
        }
        else {
            taskPriorityContainer.style.display =''
            listDisplayContainer.style.display ='none'
            document.querySelector('.all-tasks').style.display = 'none'
            //listTitleElement.innerText = selList.name
            //clearElement(taskPriorityContainer)
            renderPriority(paraList)
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
function renderLists(lists, selectedListId,  listsContainer) {
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
function renderTasks(selectedList,  tasksContainer) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.createElement('div')
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type','checkbox')
        checkbox.id = task.id 
        checkbox.checked = task.complete
        const p = document.createElement('p')
        p.style.display = 'inline'
        p.dataset.paraId = task.id
        p.innerText = task.name
        taskElement.appendChild(checkbox)
        taskElement.appendChild(p)
        tasksContainer.appendChild(taskElement)
    })
}

// Rendering the task Priority
function renderPriority(paraList) {    
    const taskTitleElement = document.querySelector('[data-task-title]')
    taskTitleElement.innerText = paraList.name
}

// Clearing the childnode if exist
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
