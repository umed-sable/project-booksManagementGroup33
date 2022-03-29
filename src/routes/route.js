const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const middleware=require("../middleware/middleware")



router.post("/register", userController.createUser)

router.post("/login", userController.login);

router.post("/books",middleware.authentication,middleware.authorization, bookController.createBook);

router.get("/books",middleware.authentication,middleware.authorization, bookController.getBooks);

router.get("/books/:bookId",middleware.authentication,middleware.authorization, bookController.getBooksByPath);

router.put("/books/:bookId",middleware.authentication,middleware.authorization, bookController.updateBooks);

router.delete("/books/:bookId",middleware.authentication,middleware.authorization,bookController.deleteBook)



module.exports = router;