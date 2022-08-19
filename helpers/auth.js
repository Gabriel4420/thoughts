module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid

  !userId && res.redirect('/login')

  next()
}
