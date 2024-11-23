const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject("No Books available!");
      }
    }, 1000);
  });
  myPromise
    .then((resp) => {
      return res.status(200).json({
        books: resp,
        message: "Books fetched successfully!",
        status: true,
      });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("No Book found with given ISBN");
      }
    }, 1000);
  });

  myPromise
    .then((resp) => {
      return res
        .status(200)
        .json({ book: resp, message: "Book Details based on isbn!" });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof getBookDetailsByAuthor(author) === "object") {
        resolve(getBookDetailsByAuthor(author));
      } else {
        console.log("inside else");
        reject(`NO Book found!`);
      }
    }, 1000);
  });
  myPromise
    .then((resp) => {
      return res
        .status(200)
        .json({ book: resp, message: "Book Details based on author!" });
    })
    .catch((err) => {
      return res.status(404).json({ message: err, err: "err" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof getBookDetailsByTitle(title) === "object") {
        resolve(getBookDetailsByTitle(title));
      } else {
        reject("NO Book found!");
      }
    }, 1000);
  });
  myPromise
    .then((resp) => {
      return res
        .status(200)
        .json({ book: resp, message: "Book Details based on title!" });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res
    .status(200)
    .json({ reviews: getBookReviewsByISBN(req.params.isbn) });
});

function getBookDetailsByAuthor(author) {
  for (const bookId in books) {
    if (books[bookId].author === author) {
      return books[bookId];
    }
  }
  return "Book not found";
}
function getBookDetailsByTitle(title) {
  for (const bookId in books) {
    if (books[bookId].title === title) {
      return books[bookId];
    }
  }
  return "Book not found";
}
function getBookReviewsByISBN(isbn) {
  return books[isbn].reviews;
}
module.exports.general = public_users;
