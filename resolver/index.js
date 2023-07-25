// import bookResolver from "./book.resolver.js";

import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

// pubsub.publish('BOOK_CREATED', {
//   postCreated: {
//     author: 'Ali Baba',
//     comment: 'Open sesame',
//   },
// });

function getBooks(ctx) {
  return ctx.mongoMethods.getBooks();
  // return [
  //   { id: 1, title: 'The Hobbit', genre: 'Fantasy', authorId: 1 },
  //   { id: 2, title: 'Harry Potter', genre: 'Fantasy', authorId: 2 },
  //   { id: 3, title: 'The Dark Tower', genre: 'Fantasy', authorId: 3 },
  //   { id: 4, title: 'Eloquent Ruby', genre: 'Programming', authorId: 3 },
  //   { id: 5, title: 'The Ruby Way', genre: 'Programming', authorId: 4 },
  //   { id: 6, title: 'The Ruby Programming Language', genre: 'Programming', authorId: 5 }
  // ];
}

async function getAuthors(ctx) {
  await ctx.mongoMethods.getAuthors();
  // return [
  //   { id: 1, name: 'J.K. Rowling' },
  //   { id: 2, name: 'J.R.R. Tolkien' },
  //   { id: 3, name: 'Stephen King' },
  //   { id: 4, name: 'Hal Fulton' },
  //   { id: 5, name: 'David Flanagan' },
  //   { id: 6, name: 'Yukihiro Matsumoto'}
  // ];
}

async function getBookById(ctx, id) {
  return await ctx.mongoMethods.getBookById(id);
}

const resolvers = {
  Query: {
    books: async (parent, args, context) => await getBooks(context),
    book: async (parent, args, context) => await getBookById(context, args.id),
    authors: async (parent, args, context) => await getAuthors(context),
    // ...bookResolver
  },
  Book: {
    // id: (parent) => parent.id,
    author: async (parent, args, context) => {
      return await context.mongoMethods.getAuthorById(parent.authorId);
    }
  },
  Author: {
    books: async (parent, args, context) => {
      await context.mongoMethods.getBooksByAuthorId(parent.id);
    }
  },
  Mutation: {
    createBook: async (parent, args, context) => {
      const result = await context.mongoMethods.createBook(args)
      await pubsub.publish('BOOK_CREATED', {bookCreated: result});
      return result;
    },
    createAuthor: async (parent, args, context) => await context.mongoMethods.createAuthor(args),
  },
  Subscription: {
    bookCreated: {
      subscribe: (parent, args, context) => {
        return pubsub.asyncIterator('BOOK_CREATED');
      }
    }
  }
}

export default resolvers;
