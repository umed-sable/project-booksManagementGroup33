const userModel = require("../models/userModel")
const bookModel = require("../models/bookModels")
const ObjectId = require("mongoose").Types.ObjectId;

// validation//

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}


// create intern//

const createBook = async function (req, res) {
  try {
      const data = req.body;
      if (!(Object.keys(data).length > 0)) { return res.status(400).send({ status: false, msg: "Invalid request Please provide details of an user" }) }
      const { title, excerpt, userId, ISBN, category, subcategory, reviews, deleted, releasedAt, bookCover } = data;
      if (!isValid(title)) {return res.status(400).send({ status: false, msg: 'Book Title is required' })}

      const bookTitle = await bookModel.findOne({ title });
      if (bookTitle) {return res.status(400).send({ status: false,msg: "Title  already registered"})}


      if (!isValid(excerpt)) {return res.status(400).send({ status: false, msg: 'excerpt is required' })}

      const bookExcerpt = await bookModel.findOne({ excerpt });
      if (bookExcerpt) {return res.status(400).send({ status: false,msg: "this excerpt  already registered"})}

      if (!isValid(userId)) {return res.status(400).send({ status: false, msg: 'userId is required' })}

      if (!isValid(ISBN)) {return res.status(400).send({ status: false, msg: "ISBN is not a valid" })}

      const bookISBN = await bookModel.findOne({ ISBN });
      if (bookISBN) {return res.status(400).send({ status: false,msg: "ISBN  already registered"})}

     // const ISBNdata = await bookModel.findOne({ ISBN });
     // if (ISBNdata) {return res.status(400).send({ status: false, msg: `${ISBN} should be unique` })}
      if (!isValid(category)) {return res.status(400).send({ status: false, msg: 'Book category is required' }) }
      if (!isValid(subcategory)) { return res.status(400).send({ status: false, msg: 'Book subcategory is required' })}
      if (!isValid(releasedAt)) {return res.status(400).send({ status: false, msg: ' Please provide a valid ReleasedAt date' })}
     

      if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
          return res.status(400).send({ status: false, msg: "\"YYYY-MM-DD\" this Date format & only number format is accepted " })}


      const userDetails = await userModel.findById(userId);
      if (!userDetails) { return res.status(400).send({ status: false, msg: `User does not exists` })}
      
      const newBookData = await bookModel.create(data)
      const bookData = {
        title:newBookData.title,
        excerpt:newBookData.excerpt,
        userId:newBookData.userId,
        ISBN:newBookData.ISBN,
        bookCover:newBookData.bookCover,
        category:newBookData.category,
        subcategory:newBookData.subcategory,
        reviews:newBookData.reviews,
        releasedAt:newBookData.releasedAt,
        deleted: deleted ? deleted : false,
        deletedAt: deleted ? new Date() : null
    }
      res.status(201).send({ status: true, msg: ' book Data created successfully', data: bookData })

  } catch (error) {
      console.log(error)
      res.status(500).send({ status: false, msg: error.message });
  }
}
module.exports.createBook = createBook



//^(?:ISBN(?:-10)?:?●)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$)[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9X]$