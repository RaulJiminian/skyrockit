const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const db = require("./db/connection.js");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const authController = require("./controllers/auth.js");

const port = process.env.PORT ? process.env.PORT : "3000";

app.use(express.urlencoded({ extended: false })); // Allows us to parse form data and include in request body
app.use(methodOverride("_method")); // "Tricks" Express into allowing PUT and DELETE requests from forms
app.use(morgan("dev")); // Logger

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.use("/auth", authController);

db.on("connected", () => {
  console.log(`Connected to MongoDB.`);
  app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
});
