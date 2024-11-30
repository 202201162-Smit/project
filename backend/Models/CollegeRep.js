const mongoose = require("mongoose");
const hashvalue = 10
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const CollegeRep = new mongoose.Schema({
  clubName:{
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
});

CollegeRep.pre('save', async function (next) {
  const collegeRep = this;
  console.log(collegeRep)
  if (!collegeRep.isModified('password')) return next();

  try {
      const saltRound = await bcrypt.genSalt(hashvalue);
      const hashedPassword = await bcrypt.hash(collegeRep.password, saltRound);
      collegeRep.password = hashedPassword;
      next();
  } catch (error) {
      console.error(error);
      next(error);
  }
});

CollegeRep.methods.generateToken = async function () {
  try {
      return jwt.sign({
          name: this.name,
          userId: this._id.toString(),
          email: this.email,
      }, "Smit", {
          expiresIn: "30d",
      });
  } catch (error) { 
      console.error(error);
  }
};

CollegeRep.methods.comparePassword = async function (password) {
  // console.log(password)
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("CollegeRep", CollegeRep);
