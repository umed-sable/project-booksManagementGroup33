const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/middleware")


//users..............................................
router.post("/register", userController.createUser)

router.post("/login", userController.login);


//book..............................................
router.post("/books",middleware.authentication, bookController.createBook);

router.get("/books",middleware.authentication,bookController.getBooks);

router.get("/books/:bookId",middleware.authentication, bookController.getBooksByPath);

router.put("/books/:bookId", middleware.authentication,middleware.authorization,bookController.updateBooks);

router.delete("/books/:bookId",middleware.authentication,middleware.authorization,bookController.deleteBook)


//review................................................
router.post("/books/:bookId/review", middleware.authentication,reviewController.createReview);

router.put("/books/:bookId/review/:reviewId", middleware.authentication,middleware.authorization, reviewController.updateReview);

router.delete("/books/:bookId/review/:reviewId", middleware.authentication,middleware.authorization,reviewController.deleteReview)


module.exports = router;