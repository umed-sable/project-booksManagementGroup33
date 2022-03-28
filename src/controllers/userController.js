const userModel = require("../models/userModel")
//const bookModels = require("../models/bookModels")
const jwt = require("jsonwebtoken")



const isValid = function (value) {
  if (typeof value == undefined || value == null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}


//CREATE AUTHOR
const createUser = async function (req, res) {
  try {

    let data = req.body;
    if (!(Object.keys(data).length > 0)) { return res.status(400).send({ status: false, msg: "Invalid request Please provide details of an user" }) }

    if (!isValid(data.title)) { return res.status(400).send({ status: false, msg: "Title is required" }) }
    if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "Name is required" }) }
    if (!isValid(data.phone)) { return res.status(400).send({ status: false, msg: "Phone Number is required" }) }


    if (!(/^[6-9]\d{9}$/.test(data.phone))) {
      res.status(400).send({ status: false, msg: "phone number should be valid number" })
    }

    let checkPhone = await userModel.findOne({ phone: data.phone })
    if (checkPhone) { return res.status(400).send({ msg: "phone Already exist" }) }

    if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "Email-Id is required" }) }

    if (!(/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/.test(data.email))) {
      return res.status(400).send({ status: false, message: "Email should be a valid email address" })
    }

    let checkEmail = await userModel.findOne({ email: data.email })
    if (checkEmail) { return res.status(400).send({ msg: "Email Already exist" }) }

    if (!isValid(data.password)) {
      return res.status(400).send({ status: false, msg: "Password is required" })
    }

    if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(data.password))) {
      return res.status(400).send({ status: false, msg: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
    }

    let savedData = await userModel.create(data)
    let userData = {
      title: savedData.title,
      name: savedData.name,
      phone: savedData.phone,
      email: savedData.email,
      password: savedData.password,
      address: savedData.address

    }
    return res.status(201).send({ status: true, data: userData })

  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}






const login = async function (req, res) {

  try {
    let data = req.body
    let email = req.body.email;
    let password = req.body.password;
    if (!(Object.keys(data).length > 0)) { return res.status(400).send({ status: false, msg: "Invalid request Please provide details of an author" }) }


    if (!isValid(email)) { return res.status(400).send({ status: false, msg: "Email-Id is required" }) }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      return res.status(400).send({ status: false, msg: "Email should be a valid email address" })
    }

    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: "Password is required" })
    }

    if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password))) {
      return res.status(400).send({ status: false, msg: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
    }

    let specificUser = await userModel.findOne({ email: email, password: password });

    if (!specificUser)
      return res.status(404).send({
        status: false,
        logInFailed: "username or the password is not correct",
      });


    let token = jwt.sign(
      {
        authId: specificUser._id,
        batch: "Project3-Book-Management",
        organisation: "FunctionUp",
      },
      "Book Management Key", { expiresIn: "1hr" },
    );
    res.header('x-new-data', token);
    return res.status(201).send({ status: true, TOKEN: token });
  }

  catch (err) {
    return res.status(500).send({ ERROR: err.message });
  }


}


module.exports.createUser = createUser
module.exports.login = login