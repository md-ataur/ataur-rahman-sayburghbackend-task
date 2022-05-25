const express = require('express');
const DB = require('../models/db');
const router = express.Router();

// New article form
router.get('/new', (req, res) => {
    res.render('posts/new', { article: new DB() });
});

// Edit article form
router.get('/edit/:id', async (req, res) => {
    const article = await DB.findById(req.params.id);
    res.render('posts/edit', { article: article });
});

// Get a single article by slug
router.get('/:slug', async (req, res) => {
    // res.send(req.params.id);
    const article = await DB.findOne({ slug: req.params.slug });
    if (article === null) {
        res.redirect('/');
    }
    res.render('posts/show', { article: article });
});

// Insert article
router.post('/', async (req, res) => {
    let tags = req.body.tags;
    let splitTags = tags.split(",");
    let article = new DB({
        title: req.body.title,
        description: req.body.description,
        tags: splitTags
    });
    try {
        article = await article.save();
        res.redirect(`/`)
    } catch (e) {
        res.render('posts/new', { article: article });
    }
});

// Update article
router.put('/:id', async (req, res) => {
    let tags = req.body.tags;
    let splitTags = tags.split(",");
    let article = await DB.findById(req.params.id);
    article.title = req.body.title
    article.description = req.body.description
    article.tags = splitTags
    try {
        article = await article.save();
        res.redirect(`/`)
    } catch (e) {
        res.render('posts/new', { article: article });
    }
});

// Delete article
router.delete('/:id', async (req, res) => {
    await DB.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;