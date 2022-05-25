const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const articleRouter = require('./routes/articles');
const mongoose = require('mongoose');
const DB = require('./models/db');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 5000;

// Database connection to localhost
// mongoose.connect('mongodb://localhost/blog');

// Database connection to the cloud atlas
mongoose.connect(`mongodb+srv://blog-application:vVxttCij58HAMFg4@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

const database = mongoose.connection;
database.on("error", console.error.bind(console, "Connection error: "));
database.once("open", function () {
    console.log("Database Connected successfully");
});

// Set EJS template engine for viewing
app.set('view engine', 'ejs');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Override the method
app.use(methodOverride('_method'));

// Get all articles
app.get('/', async (req, res) => {
    const articles = await DB.find().sort({ createdAt: 'desc' });
    res.render('posts/index', { articles: articles });
});

// Routing
app.use('/articles', articleRouter);

// login
app.get('/login', async (req, res) => {
    res.render('auth/login');
});

// Sign Up
app.get('/register', async (req, res) => {
    res.render('auth/register');
});

// profile page
app.get('/profile', async (req, res) => {
    res.render('profile');
});

// Port 5000
app.listen(port, () => {
    console.log('listening at', port);
});
