import { ListModel, TodoModel } from "../models/todoModel.js";

// Get all data
export const getData1 = async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.send(todos);
    console.log("todos", todos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getData = async (req, res) => {
  try {
    const todos = await ListModel.find().populate("tasks");
    res.send(todos);
    console.log("todos", todos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Post data
export const postData = async (req, res) => {
  const newTask = req.body;
  const { title, status, listKey } = req.body;
  const todo = new TodoModel(newTask);
  todo
    .save()
    .then((item) => {
      ListModel.findByIdAndUpdate(
        listKey,
        { $push: { tasks: item._id } },
        { new: true, useFindAndModify: false },
        (err) => {
          if (err) {
            return res.status(500).json({ success: false, msg: err.message });
          }
          res.status(200).json({ success: true, item });
        }
      );
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err.message });
    });
}

// Get data by id
export const getDataById = async (req, res) => {
  try {
    const todo = await TodoModel.findOne({ _id: req.params.id });
    res.send(todo);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Delete data by id
export const deleteData = async (req, res) => {
  try {
    const { title, status, listKey } = req.body;
    console.log("id", listKey)

    //Delete to in tasks
    const todo = await ListModel.findByIdAndUpdate(
      listKey, 
      {
        $pull: { tasks: req.params.id },
      },
      { new: true }
    );

    if (!todo) {
      return res.status(400).send("Todo not found");
    }

    // Delete todo in todos
    await TodoModel.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "todo doesn't exist!" });
  }
};

// Update data
export const updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const todo = await TodoModel.findByIdAndUpdate(id, updatedData, options);
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getListById = async (req, res) => {
  try {
    const todo = await ListModel.findOne({ _id: req.params.id });
    res.send(todo);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const updateList = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const todo = await ListModel.findByIdAndUpdate(id, updatedData, options);
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get data by id
// export const getDataById1 = async (req, res) => {
//     try {
//       const todo = await ListModel.findOne({ _id: '62b2d893d5aec47c7f6a43e1' });
//       res.send(todo);
//     } catch (err) {
//       res.status(500).json({ error: err });
//     }
//   };

    // const todo = new ListModel({
    //   title: "listItem",
    // });
    // todo.save();