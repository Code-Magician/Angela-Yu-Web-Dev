import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import md5 from 'md5';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Connecting Mongoose database
mongoose.connect("mongodb://localhost:27017/userDB");

// Creating Schema to send to database
const userSchema = new mongoose.Schema( {
    email : String,
    password : String
});

// Encryption of password using a Secret.
// userSchema.plugin(encrypt,{ secret: process.env.SECRET , encryptedFields: ['password'] });

// Creating a Model from the schema.
const User = new mongoose.model("User", userSchema);


app.get("/", (req, res)=>{
    res.render("home.ejs");
})

app.get("/register", (req, res)=>{
    res.render("register.ejs");
})

app.get("/login", (req, res)=>{
    res.render("login.ejs");
})

app.post("/register", (req, res)=>{
    bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS), (err, hash)=>{
        if(err) console.log(err.message);

        const newUser = new User({
            email : req.body.username,
            password : hash                        // Storing the hashed password in DB instead of plain text.
            // password : md5(req.body.password)   // Hashing the password.
        });
    
        try{
            newUser.save();
    
            res.render("secrets.ejs");
        }catch(err){
            console.log(err);
        }
    });
})


app.post("/login",async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    // const password = md5(req.body.password);   // Hashing the password.

    try{
        const foundUser = await User.where({email:username}).findOne();

        if(foundUser){
            bcrypt.compare(password, foundUser.password, (err, result)=>{
                if(err) console.log(err.message);

                if(result) res.render("secrets.ejs");
                else console.log("username or password incorrect.");
            })
        }
        else console.log("username or password incorrect.")
    }catch(err){
        console.log(err);
    }
})


app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${3000}`);
})