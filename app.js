class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.querySelector('#book-list');
    //create tr element
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>
        <a href="#" class="delete">X</buttton>
      </td>
    `;

    list.appendChild(row);
  };

  showAlert(message, className) {
    // create div
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    // insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('book-form').reset();
  }
}

// localStorage class 
class Store {
  static getBooks() {
    let books;

    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books  = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI;

      // add book to ui
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', Store.displayBooks)


// Event listeners
document.getElementById('book-form').addEventListener('submit', function (event) {
  // get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // validate
  if (title === '' || author === '' || isbn === '') {
    // error alert
    ui.showAlert('Please fill in all inputs', 'error')
  } else {
    // Add book to list
    ui.addBookToList(book);

    // add to the localStorage
    Store.addBook(book);
  
    // show alert for adding book
    ui.showAlert('Book Added!', 'success')

    // clear form
    ui.clearFields();
  }

  event.preventDefault();
});


// Event listner for delete
document.getElementById('book-list').addEventListener('click', function(event) {
  const ui = new UI();

  ui.deleteBook(event.target);

  // remove from LS
  Store.removeBook(event.target.parentElement.previousElementSibling.textContent);

  //show alert
  ui.showAlert('Book Removed!', 'success');

  event.preventDefault();
})
