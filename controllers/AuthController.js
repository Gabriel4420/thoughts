const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login')
  }

  static async tryLogin(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      req.flash('message', 'Usuário não encontrado e/ou não cadastrado.')
      res.render('auth/login')
    }

    const passMatch = bcrypt.compareSync(password, user.password)

    if (!passMatch) {
      req.flash('message', 'senha invalida')
      res.render('auth/login')
    }

    req.session.userid = user.id

    req.flash('message', 'Login feito com sucesso!')

    req.session.save(() => {
      try {
        res.redirect('/')
      } catch (error) {
        console.log(error)
      }
    })
  }

  static registerScreen(req, res) {
    res.render('auth/register')
  }

  static async registerUser(req, res) {
    const { name, email, password, confirmpassword } = req.body

    // password match validation

    if (password != confirmpassword) {
      req.flash('message', 'As senhas não batem, tente novamente!')
      res.render('auth/register')

      return
    }

    const checkIfUserExist = await User.findOne({ where: { email } })

    if (checkIfUserExist) {
      req.flash('message', 'O e-mail já está em uso')
      res.render('auth/register')
    }

    // create a password

    const salt = bcrypt.genSaltSync(10)

    const hashedPass = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPass,
    }

    try {
      const userCreate = await User.create(user)

      req.session.userid = userCreate.id

      req.flash('message', 'Cadastro realizado com sucesso!')

      req.session.save(() => {
        res.redirect('/')
      })
    } catch (error) {
      req.flash('message', 'Houve um erro ao cadastrar!')
      console.log(error)
    }
  }

  static logout(req, res) {
    req.session.destroy()

    res.redirect('/login')
  }
}
