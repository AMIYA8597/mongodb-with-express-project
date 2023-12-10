const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies", (req, res) => {
  res.cookie("color", "blue", { signed: true });
  res.cookie("name", "Amiya", { signed: true });
  res.cookie("age", "23", { signed: true });
  res.send("signed cookies set");
});

app.get("/verify", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("verified");
});

app.get("/getcookies", (req, res) => {
  res.cookie("greet", "How r U");
  res.cookie("talk", "r u ok?");
  res.send("send you some cookies");
});

app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi this is classroom root");
});

app.listen(3005, () => {
  console.log("server is listening in 3005");
});
