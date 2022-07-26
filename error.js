function handle400(req, res, next) {
  res.status(404).render('pages/error', {message: "Page not found", status: 404})
}

function handle500(err, req, res, next) {
  res.render('pages/error', {message: `Internal server error: ${err}`, status: 500})
}

module.exports = {handle400, handle500}