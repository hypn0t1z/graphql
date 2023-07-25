import BookSchema from "./models/book.model.js";
import AuthorSchema from "./models/author.model.js";

export const mongoMethods = {
  getBooks: async () => await BookSchema.find({}),
  getAuthors: async () => await AuthorSchema.find({}),
  getBookById: async (bookId) => await BookSchema.findById(bookId),
  getAuthorById: async (authorId) => await AuthorSchema.findById(authorId),
  getBooksByAuthorId: async (authorId) => await BookSchema.find({ authorId }),
  createBook: async (args) => {
    const { title, genre, authorId } = args;
    console.log({ title, genre, authorId })
    const book = new BookSchema({ title, genre, authorId });
    return await book.save();
  },
  createAuthor: async (args) => {
    const { name, age } = args;
    const author = new AuthorSchema({ name, age });
    return await author.save();
  }
}
