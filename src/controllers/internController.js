const userModel = require("../models/userModel")
//const internModel = require("../models/internModels")
const ObjectId = require("mongoose").Types.ObjectId;

// validation//

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}


// create intern//

const createIntern = async function (req, res) {
  try {

    let data = req.body;

    if (Object.keys(data).length > 0) {


      if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "Email is required" }) }
      if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "First name is required" }) }
      if (!isValid(data.collegeId)) { return res.status(400).send({ status: false, msg: "College Id is required" }) }



      if (!ObjectId.isValid(data.collegeId)) { return res.status(400).send({ status: false, msg: "Please provide a valid College Id" }) }



      let collegeCheckId = await collegeModel.findOne({ _id: data.collegeId, isDeleted: false })
      if (!collegeCheckId) { return res.status(400).send({ msg: "college you are looking for internship, does not exist" }) }


      if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))) {
        return res.status(400).send({ status: false, msg: "Please provide a valid email" })
      }
      if (!(/^[6-9]\d{9}$/.test(data.mobile))) {
        return res.status(400).send({ status: false, msg: "Please provide a valid Moblie Number" })
      }



      let dupli = await internModel.findOne({ email: data.email })
      if (dupli) { return res.status(400).send({ status: false, msg: "Email already exists" }) }


      let dupliMobile = await internModel.findOne({ mobile: data.mobile })
      if (dupliMobile) { return res.status(400).send({ status: false, msg: "Mobile Number already exists" }) }

      let savedData = await internModel.create(data);
      let expectedResult = {
        isDeleted: savedData.isDeleted,
        name: savedData.name,
        email: savedData.email,
        mobile: savedData.mobile,
        collegeId: savedData.collegeId
      }
      return res.status(201).send({ status: true, internDetails: expectedResult });

    } else {
      return res.status(400).send({ ERROR: "BAD REQUEST" })
    }

  } catch (err) {

    return res.status(500).send({ ERROR: err.message })

  }
}


module.exports.createIntern = createIntern;