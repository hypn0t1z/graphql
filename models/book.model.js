import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
  title: String,
  genre: String,
  authorId: String,
});

export default mongoose.model("Book", BookSchema);
