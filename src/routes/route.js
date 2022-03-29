const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")


//users..............................................
router.post("/register", userController.createUser)

router.post("/login", userController.login);


//book..............................................
router.post("/books", bookController.createBook);

router.get("/books", bookController.getBooks);

router.get("/books/:bookId", bookController.getBooksByPath);

router.put("/books/:bookId", bookController.updateBooks);

router.delete("/books/:bookId",bookController.deleteBook)


//review................................................
router.post("/books/:bookId/review", reviewController.createReview);

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


module.exports = router;