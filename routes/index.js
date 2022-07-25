const router = require('express').Router()
const Article = require('../models/article').Model

router.get('/', async (req, res) => {
  const articles = await Article.find()

  res.render('pages/index', {articles: articles})
})


module.exports = router