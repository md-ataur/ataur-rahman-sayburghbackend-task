const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

// New article form
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// Edit article form
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
});

// Get a single article by id
router.get('/:slug', async (req, res) => {
    // res.send(req.params.id);
    const article = await Article.findOne({ slug: req.params.slug });
    if (article === null) {
        res.redirect('/');
    }
    res.render('articles/show', { article: article })
});

// Insert article
router.post('/', async (req, res) => {
    let tags = req.body.tags;
    let splitTags = tags.split(",");
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        tags: splitTags
    })
    try {
        article = await article.save()
        res.redirect(`/`)
    } catch (e) {
        res.render('articles/new', { article: article })
    }
});

// Update article
router.put('/:id', async (req, res) => {
    let tags = req.body.tags;
    let splitTags = tags.split(",");
    let article = await Article.findById(req.params.id);
    article.title = req.body.title
    article.description = req.body.description
    article.tags = splitTags
    try {
        article = await article.save()
        res.redirect(`/`)
    } catch (e) {
        res.render('articles/new', { article: article })
    }
});

// Delete article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
});

module.exports = router;