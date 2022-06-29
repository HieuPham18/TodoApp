import mongoose from "mongoose";

const schemaItem = mongoose.Schema({
    title: String,
    status: Boolean,
    listKey: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
  },
  {
    collection: "todos",
    versionKey: false,
  }
);

const schemaList = mongoose.Schema({
    title: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  },
  {
    collection: "List",
    versionKey: false,
  }
);

export const TodoModel = mongoose.model("Item", schemaItem);
export const ListModel = mongoose.model("List", schemaList);
