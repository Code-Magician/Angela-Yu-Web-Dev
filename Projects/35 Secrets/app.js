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
import GoogleStrategy from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "My Session Secret.",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connecting Mongoose database
mongoose.connect("mongodb://localhost:27017/userDB");

// Creating Schema to send to database
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Creating a Model from the schema.
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));


app.get("/", (req, res) => {
    if (!req.isAuthenticated()) res.render("home.ejs");
    else res.redirect("/secrets");
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    }
);

app.get("/register", (req, res) => {
    if (!req.isAuthenticated()) res.render("register.ejs");
    else res.redirect("/secrets");
})

app.get("/login", (req, res) => {

    if (!req.isAuthenticated()) res.render("login.ejs");
    else res.redirect("/secrets");
})

app.get("/secrets", async (req, res) => {
    if (req.isAuthenticated()) {
        let allSecrets = [];
        try {
            const foundUsers = await User.find({ "secret": { $ne: null } });

            console.log(foundUsers);
            if (foundUsers) {
                for (let i = 0; i < foundUsers.length; i++) {
                    allSecrets.push(foundUsers[i].secret);
                };
            }
        } catch (err) {
            console.log(err);
        }

        res.render("secrets.ejs", { userSecrets: allSecrets });
    }
    else res.redirect("/");
})

app.get("/logout", (req, res) => {
    if (req.isAuthenticated())
        req.logout(function (err) {
            if (err) console.log(err);
            else res.redirect("/");
        });
    else res.redirect("/");
})

app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) res.render("submit.ejs");
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
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        }
        else res.redirect("/secrets");
    });
})


app.post("/submit", async (req, res) => {
    const secret = req.body.secret;

    if (!secret) res.redirect("/submit");
    else {
        const userId = req.user.id;

        try {
            const user = await User.findById(userId);

            if (user) {
                user.secret = secret;
                user.save();
                res.redirect("/secrets");
            }
            else res.redirect("/");
        } catch (err) {
            console.log(err);
            res.redirect("/");
        }
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${3000}`);
})