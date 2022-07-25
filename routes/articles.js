const router = require('express').Router()
const Article = require('../models/article').Model
const User = require('../models/user').Model
const auth = require('../authentication')

router.get('/new', (req, res) => {
  if (req.user) {
    res.render('pages/new')
  } else {
    req.method = "post"
    res.redirect('../users/login')
  }
})

router.get('/:id/update', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) res.status(404).send('Not found')
    res.render('pages/update', {article: article})
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) res.status(404).send('Not found')
    res.render('pages/article', {article: article})
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

router.post('/', async (req, res) => {
  try {
    if(!req.user) return res.status(400).send('No user for this post')
    res.status(400)
    const article = new Article({ 
      author: req.user,
      title: req.body.title,
      body: req.body.body,
      date: new Date()
    })
    await article.save()
    res.redirect(`${req.baseUrl}/${article.id}`)
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if(!article) return res.status(404).send('Not found')
    if(!req.user || req.user._id != article.author.id) return res.status(400).send('Not allowed')
    await article.updateOne({body: req.body.body, title: req.body.title})
    res.redirect('/')
  } catch(err) {
    res.status(500).send(err.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if(!article) return res.status(404).send('Article not found')
    if(!req.user || req.user._id != article.author.id) return res.status(400).send('Not allowed')
    await article.delete()
    res.redirect('/')
  } catch(err) {
    res.status(500).send(err.message)
  }
})

module.exports = router