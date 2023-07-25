// import {bookType} from "./book.schema.js";
import {authorType} from "./author.schema.js";

const typeDefs = `
  # Book type
  type Book {
    id: ID!
    title: String
    genre: String
    author: Author
  }
  
  # Root Query
  type Query {
    books: [Book]
    authors: [Author]
    book(id: ID!): Book
    books1: [Book]
  }
  
  # Author type
  ${authorType}
  
  type Mutation {
    createBook(title: String!, genre: String!, authorId: ID!): Book
    createAuthor(name: String!, age: Int!): Author
  }
  
  type Subscription {
    bookCreated: Book
  }
`;

export default typeDefs;
