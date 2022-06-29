import { getData, getDataById, deleteData, postData, updateData, updateList, getListById } from "../controller/todoController.js"
import express from 'express'
const router = express.Router()


// TodoModel

// Get all posts
// router.get("/todos", getData)

// Post new todo
router.post("/todos", postData)

// Get todo by id
router.get("/todos/:id", getDataById)

//Delete todo by id
router.delete("/todos/:id", deleteData)

//Update
router.patch("/todos/:id", updateData)

//========================================================

// ListModel

// Get list
router.get("/list", getData)

// Update List
router.patch("/list/:id", updateList)

// Get List by id
router.get("/list/:id", getListById)


export default router