const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const config = require("./config/key");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/testDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  console.log(user);
  user.save((err, userInfo) => {
    console.log("+=================================");
    console.log(err);
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo,
    });
  });
});

app.post("/api/users/authentication", (req, res) => {
  User.findOne({ token: req.cookies.x_auth }, (err, user) => {
    if (err) res.send({ authentication: false });
    else {
      res.send({
        authentication: true,
        info: user.name,
      });
    }
  });
  // if (!isAuth) {
  //   res.send({ authentication: false });
  // } else {
  //   User.findOne({ token: req.cookies.x_auth }, (err, user) => {
  //     res.send({
  //       authentication: true,
  //       info: user.name,
  //     });
  //   });
  // }
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호까지 맞다면 토큰을 생성하자.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userName: user.name });
      });
    });
  });
});

// role 1 어드민 role 2 특정부서 어드민
// role 0 -> 일반유저 role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`);
});
