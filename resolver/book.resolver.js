function getBooks() {
  return [
    { id: 1, title: 'The Hobbit', genre: 'Fantasy', authorId: 1 },
    { id: 2, title: 'Harry Potter', genre: 'Fantasy' },
    { id: 3, title: 'The Dark Tower', genre: 'Fantasy' },
    { id: 4, title: 'Eloquent Ruby', genre: 'Programming' },
    { id: 5, title: 'The Ruby Way', genre: 'Programming' },
    { id: 6, title: 'The Ruby Programming Language', genre: 'Programming' }
  ];
}

function getBookById(id) {
  console.log({id})
  return getBooks().find(book => book.id == id);
}

const bookResolver = {
  books: getBooks,
  book: (parent, args) => getBookById(args.id),
};

export default bookResolver;
