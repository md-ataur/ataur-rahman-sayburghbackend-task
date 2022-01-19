const express = require('express');
const articleRouter = require('./routes/articles');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 5000;

// DB connection to cloud atlas
mongoose.connect(`mongodb+srv://blog-application:vVxttCij58HAMFg4@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

// DB connection to localhost
// mongoose.connect('mongodb://localhost/blog');

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Tell express how to access form data
app.use(express.urlencoded({ extended: false }));

// Override the method
app.use(methodOverride('_method'));

// Get all articles
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles });
});

// Routing
app.use('/articles', articleRouter);

// Port 5000
app.listen(port, () => {
    console.log('listening at', port);
});
