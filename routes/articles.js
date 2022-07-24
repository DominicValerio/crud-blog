const router = require('express').Router()
const Article = require('../models/article').Model
const User = require('../models/user').Model

router.get('/new', (req, res) => {
  res.render('pages/new')
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

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findById("62dcad4665567d9311973eba")
    const article = new Article({ 
      author: user,
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
    await article.updateOne({body: req.body.body, title: req.body.title})
    res.redirect('/')
  } catch(err) {
    res.status(500).send(err.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    await article.delete()
    res.redirect('/')
  } catch(err) {
    res.status(500).send(err.message)
  }
})

module.exports = router