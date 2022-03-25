const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: 'Email Id is required',
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },

    mobile: {
        type: Number,
        required: 'Mobile Number is required',
        match: [/^[6-9]\d{9}$/, "please fill a valid mobile Number"],
        unique: true
    },
    collegeId: {
        type: ObjectId,
        ref: "college",
        match: [/^[a-zA-Z]{24,24}$/, "Please fill Id with valid length"],


    },
    isDeleted: {
        type: Boolean,
        default: false
    },

},
    { timeStamps: true })

module.exports = mongoose.model('intern', internSchema)

/*
title: {string, mandatory, unique},
  excerpt: {string, mandatory}, 
  userId: {ObjectId, mandatory, refs to user model},
  ISBN: {string, mandatory, unique},
  category: {string, mandatory},
  subcategory: {string, mandatory},
  reviews: {number, default: 0, comment: Holds number of reviews of this book},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  releasedAt: {Date, mandatory, format("YYYY-MM-DD")},*/