const userModel = require("../models/userModel")
const bookModel = require("../models/bookModels")
//const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel")
const ObjectId = mongoose.Types.ObjectId
// validation//

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}


// create intern.....................................................................

const createBook = async function (req, res) {
  try {
    const data = req.body;
    if (!(Object.keys(data).length > 0)) { return res.status(400).send({ status: false, msg: "Invalid request Please provide details of an user" }) }
    const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt, bookCover } = data;
    if (!isValid(title)) { return res.status(400).send({ status: false, msg: 'Book Title is required' }) }

    const bookTitle = await bookModel.findOne({ title });
    if (bookTitle) { return res.status(400).send({ status: false, msg: "Title  already registered" }) }


    if (!isValid(excerpt)) { return res.status(400).send({ status: false, msg: 'excerpt is required' }) }

    //const bookExcerpt = await bookModel.findOne({ excerpt });
    //if (bookExcerpt) { return res.status(400).send({ status: false, msg: "this excerpt  already registered" }) }

    if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: 'userId is required' }) }

    if (!isValid(ISBN)) { return res.status(400).send({ status: false, msg: "ISBN is not a valid" }) }
    if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(data.ISBN.trim()))) {
      return res.status(400).send({ status: false, ERROR: "ISBN is not valid" })
    }

    const bookISBN = await bookModel.findOne({ ISBN });
    if (bookISBN) { return res.status(400).send({ status: false, msg: "ISBN  already registered" }) }

    if (!isValid(category)) { return res.status(400).send({ status: false, msg: 'Book category is required' }) }
    if (!isValid(subcategory)) { return res.status(400).send({ status: false, msg: 'Book subcategory is required' }) }
    if (!isValid(releasedAt)) { return res.status(400).send({ status: false, msg: ' Please provide a valid ReleasedAt date' }) }


    if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
      return res.status(400).send({ status: false, msg: "\"YYYY-MM-DD\" this Date format & only number format is accepted " })
    }


    const userDetails = await userModel.findById(userId);
    if (!userDetails) { return res.status(400).send({ status: false, msg: "User does not exists" }) }

    const newBookData = await bookModel.create(data)
    const bookData = {
      _id: newBookData._id,
      title: newBookData.title,
      excerpt: newBookData.excerpt,
      userId: newBookData.userId,
      ISBN: newBookData.ISBN,
      bookCover: newBookData.bookCover,
      category: newBookData.category,
      subcategory: newBookData.subcategory,
      reviews: newBookData.reviews,
      releasedAt: newBookData.releasedAt,
      isDeleted: isDeleted ? isDeleted : false,
      deletedAt: isDeleted ? new Date() : null
    }
    res.status(201).send({ status: true, msg: ' book Data created successfully', data: bookData })

  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, msg: error.message });
  }
}
module.exports.createBook = createBook



//^(?:ISBN(?:-10)?:?●)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$)[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9X]$


//get books..............................................................................

const getBooks = async function (req, res) {

  try {
    let filters = req.query
    console.log(filters)
    if (Object.keys(filters).length == 0) {
      return res.status(400).send({ status: false, msg: "filters Are Required" })
    }
    let availableBooks = await bookModel.find({ $and: [filters, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
    if (availableBooks.length > 0) { return res.status(200).send({ status: true, msg: "book  list", data: availableBooks }) }



    if (availableBooks.length == 0) {
      return res.status(404).send({ status: false, msg: "No Book Found For Given info" })
    }

    let dataReview= await reviewModel.findById({bookId:availableBooks.bookId,isDeleted:false})
    return res.status(200).send({ status: true, msg: availableBooks })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: "failed", msg: err.message })
  }

}

module.exports.getBooks = getBooks


//getBooksByPath......................

const getBooksByPath = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!(isValid(bookId) && isValidObjectId(bookId))) { return res.status(400).send({ status: false, msg: "Valid bookId is required" }) }

    let book = await bookModel.findById({ _id: bookId, isDeleted: false })

    if (!book) return res.status(404).send({ status: false, msg: "book does not exist" })
    if (book) return res.status(200).send({ status: true, data: book })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }

}
module.exports.getBooksByPath = getBooksByPath

//updated..............................................

const updateBooks = async (req, res) => {

  try {
    let data = req.body
    if (!isValid(data)) return res.status(400).send({ status: false, Message: "Please provide the data..!!" });

    let Id = req.params.bookId
    if (!isValidObjectId(Id)) return res.status(400).send({ status: false, Message: "Please provide the valid Id..!!" });

    let ifExist = await bookModel.findById(Id)

    if (!ifExist) {
      return res.status(404).send({ status: false, msg: "Book Not Found" })
    }

    if (ifExist.isDeleted == false) {


      let newTitle = data.title
      let newExcerpt = data.excerpt
      let newDate = data.releasedDate
      let isbn = data.ISBN
      let newCategory=data.category
      let newSubCategory=data.subcategory

      let updatedBook = await bookModel.findByIdAndUpdate({ _id: Id },
        {
          
          $set: { title: newTitle, excerpt: newExcerpt, releasedAt: newDate, ISBN: isbn ,category: newCategory},
          $push: {  subcategory: newSubCategory },
        },
        { new: true })

      console.log(updatedBook)
      return res.status(200).send({ Status: true, data: updatedBook })

    } else {
      return res.status(400).send({ status: false, message: "Data is deleted..!!" })
    }


  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

module.exports.updateBooks = updateBooks


//delete..............................................


const deleteBook = async function (req, res) {
  try {
    const bookIdDelete = req.params.bookId;

    //checking validation for invalid params
    if (!isValidObjectId(bookIdDelete)) {
      return res.status(400).send({ status: false, message: "book id is invalid" })
    }

    //finding book is available in database or not  
    const findBook = await bookModel.findById({ _id: bookIdDelete })

    if (!findBook) {
      return res.status(400).send({ status: false, message: "No Book Available for this Id" })
    }

    /*
            //checking person is authorized or not to delete the book  
            else if(findBook.userId !=req.UserId)
            {
                return res.status(401).send({status:false,messege:"you are Not authorised person to delete this book"})
            }
    
            //checking if book is already deleted 
            else if(findBook.deleted==true)
            {
                return res.status(400).send({status:false,messege:"the book is already deleted"})
            }
    */
    //if book is not deleted 
    else {
      const deleteData = await bookModel.findOneAndUpdate({ _id: { $in: findBook } },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }).select({ _id: 1, title: 1, isDeleted: 1, deletedAt: 1 })
      return res.status(200).send({ status: true, message: "Book deleted successfullly.", data: deleteData })
    }
  }

  catch (err) {
    return res.status(500).send({ status: false, Error: err.message })
  }

}

module.exports.deleteBook = deleteBook











