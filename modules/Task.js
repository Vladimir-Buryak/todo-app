import { Schema, model } from "mongoose";

const Task = new Schema({
   userId: { type: String, required: true },
   task: [{ type: Object }]
});

export default model("Task", Task);