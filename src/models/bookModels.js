const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    excerpt: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId:{
      type:ObjectId,
      required:true,
      ref:"user"
    },
    ISBN:{
     type:String,
     required:true,
     unique:true,
     trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
        
    },
    subcategory: {
        type: String,
    required:true,
    trim: true,  

    },
    
    deleted: {
        type: Boolean,
        default: false
    },
    reviews:{
        type:Number,
        default: 0,
       comment: Number
     },
     deletedAt:{
          type:Date,
          
     },
    releasedAt:{
        type:Date,
        required:true,
        default:Date.now()

    }

},
    { timeStamps: true })

module.exports = mongoose.model('books', bookSchema)
