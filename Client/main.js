const app = document.querySelector(".todo-list")
const listToDo = document.getElementById("myList")
const check = document.querySelectorAll("check-todo")
const inputElement = document.querySelector(".input-todo")
const listItem = document.querySelectorAll('.list-item')


const urlToDo = "http://localhost:3000/api/todos"


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
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

class TodoList {
    constructor(element, lsKey = 'todolist', dragEl = null, cloneEl = null, isDraging = false, indexItem = null, shiftY = null) {
        this.element = element;
        this.localStorageKey = lsKey
        this.dragEl = dragEl
        this.cloneEl = cloneEl
        this.isDraging = isDraging
        this.indexItem = indexItem
        this.element.addEventListener('click', this.onClick);
        this.element.addEventListener('mousedown', this.onMouseDown)
        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('mouseup', this.onMouseUp)
        this.load()
    }

    load() {
        this.data = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
    }
    save() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.data))
    }

    renderData() {
        //Local storge

        let list = this.data
        // Map innerHTML
        const htmls = list.map((item, index) => {
            return (
                `<li class = 'list-item' data-id = ${index}>
                    <div class="check"><input type = "checkbox" class = "check-todo" ${item.status ? 'checked' : ''} value = ${index}></div>
                    <p class = ${item.status ? 'style-checked' : 'title'}>${item.title} - ${index}</p>
                    <div class = "del"><i class = "fa-solid fa-trash-can icon-del" data-id = ${index}></i></div>
                </li>
                `
            )
        })
        listToDo.innerHTML = htmls.join('')
    }

    addData() {
        let inputValue = inputElement.value
        let formData = {
            title: inputValue,
            status: false,
        }
        this.data = [...this.data, formData]
        inputElement.value = ''
        this.save()
    }

    deleteData = (id) => {
        this.data.splice(id, 1)
        this.renderData()
        this.save()
    }

    onClick = (e) => {
        //Add
        if (e.target.matches('.btn-add')) {
            this.addData()
            this.renderData()
        }

        //Delete
        else if (e.target.closest('.icon-del')) {
            let id = e.target.getAttribute('data-id')
            this.deleteData(id)

            // Checkbox
        } else if (e.target.closest('.check-todo')) {
            //Checked
            if (e.target.checked) {
                this.data[e.target.value] = { ...this.data[e.target.value], status: true }
                this.renderData()
            }

            // Unchecked
            else {
                this.data[e.target.value] = { ...this.data[e.target.value], status: false }
                this.renderData()
            }
            this.save()
        }
    }

    onMouseDown = (e) => {
        const target = e.target.closest('.list-item')
        if(e.target.matches('.icon-del') || e.target.matches('.check-todo')) return
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

    onMouseMove = (e) => {
        if (this.dragEl) {
            if (!this.isDraging) return
            // this.clone.style.top = e.pageY - this.clone.offsetHeight / 2 + 'px'
            this.clone.style.top = e.pageY + 'px'
            const rectDragEl = this.dragEl.getBoundingClientRect()
            const rectClone = this.clone.getBoundingClientRect()

        }
    }

    onMouseUp = (e) => {
        if (this.dragEl) {
            const dropEl = e.target.closest('.list-item')
            if (dropEl && this.dragEl !== dropEl) {
                const rectDragEl = this.dragEl.getBoundingClientRect()
                const rectDropEl = dropEl.getBoundingClientRect()
                
                const mY = e.pageY
                const dY = mY - rectDropEl.y
                const dH = rectDropEl.height

                console.log(dY, dH)

                const fromIndex = parseInt(this.dragEl.getAttribute("data-id"))
                const toIndex = parseInt(dropEl.getAttribute("data-id"))

                if (rectDropEl.top > rectDragEl.top) {
                    // mouse down
                    if (dY > dH / 2) {
                        changePosition(this.data, fromIndex, toIndex)
                        this.save()
                        this.renderData()
                    }
                    else {
                        changePosition(this.data, fromIndex, toIndex - 1)
                        this.save()
                        this.renderData()
                    }
                }
                else {
                    if (dY < dH / 2) {
                        changePosition(this.data, fromIndex, toIndex)
                        this.save()
                        this.renderData()
                    }
                    else {
                        changePosition(this.data, fromIndex, toIndex + 1)
                        this.save()
                        this.renderData()
                    }
                }
            }

            // reset
            // this.dragEl.style.color = 'red'
            this.dragEl.style.visibility = 'visible'
            this.clone.style.visibility = 'hidden'
            // this.clone.removeEventListener('mousedown', this.onMouseDown)
            // this.clone.removeEventListener('mousemove', this.onMouseMove)
            this.isDraging = false
            this.indexItem = null
            this.dragEl = null
            this.clone = null
        }
    }

}

const todo = new TodoList(document.querySelector('.todo-list'))
todo.renderData()
