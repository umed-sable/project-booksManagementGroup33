const jwt = require("jsonwebtoken")
const bookModel = require("../models/bookModels")


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


const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "Book Management Key")

        let bookId = req.params.bookId
        if ( bookId ) {
            let userId = await bookModel.find({ _id: bookId }).select({ userId: 1, _id: 0 })
            userId = userId.map(x => x.userId)

            if (decodedtoken.userId != userId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        else {
            let userId = req.query.userId
            if ( !userId )  return res.status(400).send({error : "Please, enter userId"})
            if (decodedtoken.userId != userId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


module.exports.authorization = authorization
module.exports.authentication = authentication