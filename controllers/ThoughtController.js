const Thought = require('../models/Thought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ThoughtController {
  static async showThoughts(req, res) {
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    let order = 'DESC'

    req.query.order === 'old' ? (order = 'ASC') : (order = 'DESC')

    const thoughtsWithoutFilter = await Thought.findAll({
      include: User,
      where: { title: { [Op.like]: `%${search}%` } },
      order: [['createdAt', order]],
    })

    const allThoughts = thoughtsWithoutFilter.map((result) =>
      result.get({ plain: true }),
    )

    let thoughtsQty = allThoughts.length

    if (thoughtsQty === 0) {
      thoughtsQty = false
    }

    res.render('thoughts/home', { allThoughts, search, thoughtsQty })
  }
  static async dashboard(req, res) {
    const userId = req.session.userid

    const user = await User.findOne({
      where: { id: userId },
      include: Thought,
      plain: true,
    })

    if (!user) {
      res.redirect('/login')
    }

    const thoughts = user.Thoughts.map((result) => result.dataValues)

    let isEmptyThoughts = false

    if (thoughts.length === 0) {
      isEmptyThoughts = true
    }

    res.render('thoughts/dash', { thoughts, isEmptyThoughts })
  }
  static createThoughts(req, res) {
    res.render('thoughts/create')
  }

  static async pushThoughts(req, res) {
    const { title } = req.body

    const thought = {
      title,
      UserId: req.session.userid,
    }

    try {
      await Thought.create(thought)

      req.flash('message', 'pensamento criado com sucesso')

      req.session.save(() => {
        res.redirect('/thoughts/dash')
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async removeThoughts(req, res) {
    const { id } = req.body
    const UserId = req.session.userid
    try {
      await Thought.destroy({ where: { id, UserId: UserId } })

      req.flash('message', 'pensamento removido com sucesso')

      req.session.save(() => {
        res.redirect('/thoughts/dash')
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async edit(req, res) {
    const { id } = req.params

    const thought = await Thought.findOne({ where: { id }, raw: true })

    res.render('thoughts/edit', { thought })
  }

  static async update(req, res) {
    const { id, title } = req.body

    const newThought = {
      title,
    }

    try {
      await Thought.update(newThought, { where: { id } })

      req.flash('message', 'pensamento atualizado com sucesso')

      req.session.save(() => {
        res.redirect('/thoughts/dash')
      })
    } catch (error) {
      console.log(error)
    }
  }
}
