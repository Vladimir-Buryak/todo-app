import { Schema, model } from "mongoose";

const Token = new Schema({
   tokenId: { type: String, required: true },
   userId: { type: String, required: true },
});

export default model("Token", Token);