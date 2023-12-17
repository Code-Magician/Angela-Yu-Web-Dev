import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import md5 from 'md5';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "My Session Secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connecting Mongoose database
mongoose.connect("mongodb://localhost:27017/userDB");

// Creating Schema to send to database
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);

// Creating a Model from the schema.
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
    if(!req.isAuthenticated())  res.render("home.ejs");
    else res.redirect("/secrets");
})

app.get("/register", (req, res) => {
    if(!req.isAuthenticated())  res.render("register.ejs");
    else res.redirect("/secrets");
})

app.get("/login", (req, res) => {

    if(!req.isAuthenticated())  res.render("login.ejs");
    else res.redirect("/secrets");
})

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) res.render("secrets.ejs");
    else res.redirect("/");
})

app.get("/logout", (req, res)=>{
    if(req.isAuthenticated())   
        req.logout(function(err){
            if(err) console.log(err.message);
            else res.redirect("/");
        });
    else res.redirect("/");
})

app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
})


app.post("/login", async (req, res) => {
    
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user, function(err){
        if(err) {
            console.log(err.message);
            res.redirect("/login");
        }
        else res.redirect("/secrets");
    });
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${3000}`);
})