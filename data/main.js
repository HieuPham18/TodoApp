const app = document.querySelector(".todo-list")
const listToDo = document.getElementById("myList")
const check = document.querySelectorAll("check-todo")
const inputElement = document.querySelector(".input-todo")
const listItem = document.querySelectorAll('.list-item')

const urlToDo = 'http://localhost:5000/api/todos';
const urlList = 'http://localhost:5000/api/list'

function styleEl(el) {
    el.style.position = 'absolute'
    el.style.zIndex = 5
    el.style.width = '400px'
    el.style.cursor = 'move'
    el.style.backgroundColor = '#9da39e'
    el.style.opacity = '0.5'
    el.style.visibility = 'visible'
    el.style.pointerEvents = 'none'
}

function changePosition(arr, fromIndex, toIndex) {
    console.log("change")
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

const getTodo = async (url) => {
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error: ", error)
    }
}

const createData = async (data) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(urlToDo, options)
}

const deleteData = async (id, data) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(`${urlToDo}/${id}`, options)
}

const getDataById = async (id) => {
    const response = await fetch(`${urlToDo}/${id}`)
    const data = await response.json()
    return data
}

const updateData = async (url, id, data) => {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    await fetch(`${url}/${id}`, options)
}

class TodoList {
    constructor(element, data = null, dragEl = null, cloneEl = null, isDraging = false, indexItem = null, listID = null, listTask = []) {
        this.element = element;
        this.dragEl = dragEl
        this.cloneEl = cloneEl
        this.isDraging = isDraging
        this.indexItem = indexItem
        this.data = data
        this.listID = listID
        this.listTask = listTask
        this.element.addEventListener('click', this.onClick);
        this.element.addEventListener('mousedown', this.onMouseDown)
        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('mouseup', this.onMouseUp)
        this.load()
    }

    renderData(data) {
        if (data) {
            const htmls = data.map((item, index) => {
                return (
                    `<li class = 'list-item' data-index = ${index} data-id = ${item._id}>
                        <div class="check"><input type = "checkbox" class = "check-todo" ${item.status ? 'checked' : ''} value = ${item._id}></div>
                        <p class = ${item.status ? 'style-checked' : 'title'}>${item.title} - ${index}</p>
                        <div class = "del"><i class = "fa-solid fa-trash-can icon-del" data-id = ${item._id}></i></div>
                    </li>
                    `
                )
            })
            listToDo.innerHTML = htmls.join('')
        }
    }

    async load() {
        const data = await getTodo(urlList)
        this.data = data[0]
        this.listID = data[0]._id
        this.listTask = data[0].tasks
        this.renderData(this.listTask)
    }

    async save(url, id, data) {
        await updateData(url, id, data)
    }

    async addData() {
        let inputValue = inputElement.value
        let formData = {
            title: inputValue,
            status: false,
            listKey: this.listID 
        }
        await createData(formData)
        inputElement.value = ''
    }

    onClick = async (e) => {
        //Add
        if (e.target.matches('.btn-add')) {
            await this.addData()
            await this.load()
        }
        //Delete
        else if (e.target.matches('.icon-del')) {
            const id = e.target.getAttribute("data-id")
            const rs = await getDataById(id)
            await deleteData(id, rs)
            await this.load()
        }
        // Update checked
        else if (e.target.matches('.check-todo')) {
            const id = e.target.value
            if (e.target.checked) {
                const rs = await getDataById(id)
                const dataUpdate = {
                    ...rs, status: true
                }
                await updateData(urlToDo, id, dataUpdate)
                await this.load()
            }
            else {
                const rs = await getDataById(id)
                const dataUpdate = {
                    ...rs, status: false
                }
                await updateData(urlToDo, id, dataUpdate)
                await this.load()
            }
        }
    }

    onMouseDown = async (e) => {
        const target = e.target.closest('.list-item')
        if (e.target.matches('.icon-del') || e.target.matches('.check-todo')) return
        if (target) {

            //init
            this.isDraging = true;
            this.dragEl = target
            this.dragEl.style.visibility = 'hidden'

            // create clone node
            this.clone = this.dragEl.cloneNode(true)
            styleEl(this.clone)
            this.dragEl.appendChild(this.clone)
        }
    }

    onMouseMove = async (e) => {
        if (this.dragEl) {
            if (!this.isDraging) return
            this.clone.style.top = e.pageY - this.clone.offsetHeight / 2 + 'px'
            // this.clone.style.top = e.pageY + 'px'
        }
    }

    onMouseUp = async (e) => {
        if (this.dragEl) {
            const dropEl = e.target.closest('.list-item')
            if (dropEl && this.dragEl !== dropEl) {
                const rectDragEl = this.dragEl.getBoundingClientRect()
                const rectDropEl = dropEl.getBoundingClientRect()

                const mY = e.pageY
                const dY = mY - rectDropEl.y
                const dH = rectDropEl.height

                console.log(dY, dH)

                const fromIndex = parseInt(this.dragEl.getAttribute("data-index"))
                const toIndex = parseInt(dropEl.getAttribute("data-index"))

                if (rectDropEl.top > rectDragEl.top) {
                    // mouse down
                    if (dY > dH / 2) {
                        changePosition(this.list, fromIndex, toIndex)
                        const dataUpdate = {
                            ...this.data,
                            tasks: this.listTask
                        }
                        await this.save(urlList, this.listID , dataUpdate)
                        await this.load()
                    }
                    else {
                        console.log("...................<")

                        changePosition(this.listTask, fromIndex, toIndex - 1)
                        const dataUpdate = {
                            ...this.data,
                            tasks: this.listTask
                        }
                        await this.save(urlList, this.listID , dataUpdate)
                        await this.load()
                    }
                }
                else {
                    //mouse up
                    if (dY < dH / 2) {
                        changePosition(this.listTask, fromIndex, toIndex)
                        const dataUpdate = {
                            ...this.data,
                            tasks: this.listTask
                        }
                        await this.save(urlList, this.listID , dataUpdate)
                        await this.load()
                    }
                    else {
                        changePosition(this.listTask, fromIndex, toIndex + 1)
                        const dataUpdate = {
                            ...this.data,
                            tasks: this.listTask
                        }
                        await this.save(urlList, this.listID , dataUpdate)
                        await this.load()
                    }
                }
            }

            // reset
            this.dragEl.style.visibility = 'visible'
            this.clone.style.visibility = 'hidden'
            this.isDraging = false
            this.indexItem = null
            this.dragEl = null
            this.clone = null
        }
    }
}


const todo = new TodoList(document.querySelector('.todo-list'))
todo.renderData()

// this.clone.removeEventListener('mousedown', this.onMouseDown)
// this.clone.removeEventListener('mousemove', this.onMouseMove)




