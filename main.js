// import
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));

// database connection
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("connected to DataBase :)");
  })
  .catch(error => {
    console.error("Error connecting to database:", error);
  });
  
  const db = mongoose.connection;
  db.on('error', (error) => console.error("MongoDB connection error:", error));  

// middleware 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
    secret: 'shush!!',
    saveUninitialized: true,
    resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () =>{
    console.log(`serveer started at http://localhost:${PORT}`);
});