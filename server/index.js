const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const config = require("./config/key");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const xml = require("xml");
const fs = require("fs");
const md5 = require("md5");
const { parseString, Builder } = require("xml2js");
const format = require("xml-formatter");
var jsdom = require("jsdom");
const jquery = require("jquery");
const { JSDOM } = jsdom;
const convert = require("xml-js");
const { type } = require("os");
var XMLWriter = require("xml-writer");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/testDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/api/users/register", (req, res) => {
  const { email, password, name } = req.body;

  const fs = require("fs");
  const { parseString, Builder } = require("xml2js");
  const xml = fs.readFileSync("test.xml", "utf-8").toString();

  parseString(xml, function (err, data) {
    const tt = data.Databse;
    const tmp = email.substring(0, email.indexOf("@"));

    Object.assign(tt, {
      [tmp]: {
        email: email,
        name: name,
        password: md5(password),
      },
    });
    const builder = new Builder();
    const xml = builder.buildObject(data);

    fs.writeFileSync("test.xml", xml, function (err, file) {
      if (err) throw err;
      console.log("Save");
    });
  });

  res.send({ success: true });
});

// app.post("/api/users/authentication", (req, res) => {
//   User.findOne({ token: req.cookies.x_auth }, (err, user) => {
//     if (err) res.send({ authentication: false });
//     else {
//       res.send({
//         authentication: true,
//         info: user.name,
//       });
//     }
//   });
// });

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const tmp = email.substring(0, email.indexOf("@"));
  const xml = fs.readFileSync("test.xml", "utf-8").toString();

  parseString(xml, function (err, data) {
    Object.keys(data.Databse).map((value) => {
      if (tmp == value) {
        if (data.Databse[tmp][0].password == md5(password)) {
          res.send({ loginSuccess: true, user: data.Databse[tmp][0].name });
        }
      }
    });
  });
});
//         };
// };

// res.send({ loginSuccess: false });
// console.log(Object.keys(data.Databse));

// User.findOne({ email: req.body.email }, (err, user) => {
//   if (!user) {
//     return res.json({
//       loginSuccess: false,
//       message: "제공된 이메일에 해당하는 유저가 없습니다.",
//     });
//   }

//   user.comparePassword(req.body.password, (err, isMatch) => {
//     if (!isMatch)
//       return res.json({
//         loginSuccess: false,
//         message: "비밀번호가 틀렸습니다.",
//       });

//비밀번호까지 맞다면 토큰을 생성하자.

// });
// });
// });

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
