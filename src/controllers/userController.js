const userModel = require("../models/userModel")
const internModels = require("../models/internModels")
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
    if (Object.keys(data).length > 0) {
    //if(!data){return res.status(400).send({status:false,msg:"Data is required"})}
    if(!isValid(data.title)){return res.status(400).send({status:false,msg:"Title is required"})}
    if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "Name is required" }) }
    if (!isValid(data.phone)) { return res.status(400).send({ status: false, msg: "Phone Number is required" }) }

    let checkPhone= await userModel.findOne({ phone: data.phone })
    if (checkPhone) { return res.status(400).send({ msg: "phone Already exist" }) }

    if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "Email-Id is required" }) }

    let checkEmail = await userModel.findOne({ email: data.email })
    if (checkEmail) { return res.status(400).send({ msg: "Email Already exist" }) }

            
    if (!isValid(data.password)) { return res.status(400).send({ status: false, msg: "Password is required" }) }
    
    
      let password = data.password
      let email = data.email
      let phone=data.phone
      if (email && password && phone) {

        if (/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/.test(email)) 
        {
        /*const emailRegex = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/;


        if (!emailRegex.test(email.trim())) {
          return res.status(400).send({
            status: false, message: `${email} is not a valid email`,
          })
        
    */
   if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "Email-Id is required" }) }


          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password))
         
          {
            if(/^[6-9]\d{9}$/.test(phone))
            {

            let savedData = await userModel.create(data)//.select({title:1,name:1,phone:1,email:1,password:1,address:1});
            let userData = {
              title:savedData.title,
              name: savedData.name,
              phone: savedData.phone,
              email: savedData.email,
              password: savedData.password,
              address: savedData.address
    
            }
    
            return res.status(201).send({ Data: userData });

          } else {
            return res.status(400).send("Please enter valid Mobile Number")
          }
        }else{
          return res.status(400).send("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
          }
        } else {
          return res.status(400).send("Not a valid email")
        }
      } else {
        return res.status(400).send("email,password and phone number is empty")
      }

    }

    else { return res.status(400).send({mgs:"please enter some data"}) }

  } catch (err) {

    return res.status(500).send({ ERROR: err.message })

  }
}
    


// get college detalis controller.........................

const login= async function (req, res) {

  try {
    let data = req.body
  
      if (Object.keys(data).length > 0) {

        let userName = req.body.email;
        if (!isValid(userName)) { return res.status(400).send({ status: false, msg: "Email-Id is required" }) }

        if (/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/.test(userName)) {
        
          let password = req.body.password;
          if (!isValid(password)) { return res.status(400).send({ status: false, msg: "Password is required" }) }

          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)) {
    let specificUser = await userModel.findOne({ email: userName, password: password });

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
      "Book Management Key", { expiresIn: "1hr" }
    );

    return res.status(201).send({ status: true, TOKEN: token });
  } else {
    return res.status(400).send("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
  }
} else {
  return res.status(400).send("Valid Email is Required")
}
}

else { return res.status(400).send({ ERROR: "Bad Request" }) }

}
  catch (err) {
    return res.status(500).send({ ERROR: err.message });
  }


}


module.exports.createUser = createUser
module.exports.login = login