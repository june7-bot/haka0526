const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
  },

  role: {
    type: Number,
    default: 0,
  },

  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//next 하면 save로 넘어감
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
    mongoose.modelNames;
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567     암호화된 비밀번호 A
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
userSchema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  // user._id + 'secretToken' = token
  //     ->s
  //     'secretToken' -> user._id
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token) {
  var user = this;
  let isAuth = true;
  let x;
  jwt.verify(token, "secretToken", function (err, decoded) {
    user.findOne({ token: token }, function (err, user) {
      if (err) isAuth = false;
      else {
        console.log(user);
        x = user;
      }
    });
  });

  if (isAuth) return x;
  else return isAuth;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
