const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const collegeSchema = new mongoose.Schema({
  name: {
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
  emailDomain: {
    type: String,
    required: true,
    unique: true,
  },
  collegeRepresentatives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeRep"
  },
],
isdb: { type: Boolean, default: false },
});

collegeSchema.pre('save', async function(next) {
  const college = this;

  if (college.collegeRepresentatives.length > 0) {
    for (let rep of college.collegeRepresentatives) {
      if (rep.isModified('password')) {
        rep.password = await bcrypt.hash(rep.password, 10);
      }
    }
  }

  next();
});

module.exports = mongoose.model("College", collegeSchema);