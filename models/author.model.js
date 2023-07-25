import mongoose from "mongoose";
const AuthSchema = mongoose.Schema({
  name: String,
  age: Number,
});

export default mongoose.model("Author", AuthSchema);
