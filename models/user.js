const mongoose = require("mongoose");

const { Schema } = mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose); //adds onto schema

module.exports = mongoose.model("User", userSchema);
