import { Schema, model } from "mongoose";

const Users = new Schema({
   first_name: { type: String, required: true },
   last_name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true }
});

export default model("Users", Users);