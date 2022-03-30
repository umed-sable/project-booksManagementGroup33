const jwt=require('jsonwebtoken')
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModels")
const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
        let decodedToken = jwt.verify(token, "Book Management Key");
        
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }

}


let authorization = async function (req, res, next)  {

    try {
        let token=req.headers["x-api-key"]
        if(!token){return res.status.send({status:false,message:"token must be present"})}

        let decodedToken=jwt.verify(token,"Book Management Key")

        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }

        let decodedUserId=decodedToken.userId
        let bookIdParams=req.params.bookId
        
        let bookDetailsId=await bookModel.findOne({_id:bookIdParams})
        
        let bookUserId=bookDetailsId.userId

        if(decodedUserId!=bookUserId){return res.status(400).send({status:false,message:"You are not an authorized person to make these changes"})}
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


module.exports.authorization = authorization
module.exports.authentication = authentication
/*
const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;

const isValidObjectId= function (a){
    if((ObjectId.isValid(a)))//checking for 12 bytes id in input value 
    {  
        let b =  (String)(new ObjectId(a))//converting input value in valid object Id
        
        if(b == a) //comparing converted object Id with input value
        {       
            return true
        }else{
                return false;
            }
    }else{
        return false
    }
}

const authenticationUser=function(req,res,next)
{
try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, message: "token must be present" });
    //verifying token with secret key
    let decodedToken = jwt.verify(token, "book-management-project");
    
    if (!decodedToken)
        return res.status(401).send({ status: false, message: "token is invalid" });//validating token value inside decodedToken
    //req.authorId = decodedToken.userId;
    next();
}
catch(error)
{
res.status(500).send({message:"Error", Error:error.message})
}
}


const authorisationUser=function(req,res,next)
{
try {
    let token = req.headers["x-api-key"];
    if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present" } )
    }
    let decodedToken = jwt.verify(token, "book-management-project");

    let authorisedUser=decodedToken.userId;
    let logedInUser=req.query.userId;
    let userCheck=isValidObjectId(logedInUser)
    if(!userCheck) return res.status(400).send({status:false,message:"Not a valid userId"})

    if(authorisedUser!=logedInUser) return res.status(401).send({status:false,message:"You are not an authorized person to make these changes"})
    next();  
}
catch(error)
{
return res.status(500).send({message:"Error", Error:error.message})
}
}
module.exports.authentication = authenticationUser;

module.exports.authorization = authorisationUser;*/


/* let token = req.headers["x-api-key"]
        if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present" } )
        }

        let decodeToken = jwt.verify(token,"Book Management Key")
        if(!decodeToken){
        return res.status(401).send( { status : false , msg : "Invalid Token" } )
        }
        
        let bookId = req.params.bookId
        
        let book = await bookModel.findById(bookId)
        if(!book){
            return res.status(404).send( { status : false , msg : "Book Not Found , Please Check Book Id"  } )
        }
     
        let ownerOfBook = book.userId
     

        if(decodeToken.userId != ownerOfBook){
            return res.status(403).send( { status : false , msg : "User logged is not allowed to modify the requested users data" } )
        }
         

        next()*/