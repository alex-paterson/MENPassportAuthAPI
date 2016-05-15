const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String
});

// On save hook, encrypt password
// Before saving a model run this function
userSchema.pre('save', function(next) {
  // get access to the user model. context is user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {return next(err);};

    // hash (encrpyt) password using salt then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {return next(err);};

      // overwrite plaintext password with encrypted
      user.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  })
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;