const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")




router.post("/register", userController.createUser)

router.post("/login", userController.login);

router.post("/books", bookController.createBook);

router.get("/books", bookController.getBooks);

router.get("/books/:bookId", bookController.getBooksByPath);

router.put("/books/:bookId", bookController.updateBooks);

router.delete("/books/:bookId",bookController.deleteBook)



module.exports = router;