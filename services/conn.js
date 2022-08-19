require('dotenv').config()
const { Sequelize } = require('sequelize')

const seq = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIAL,
  },
)

try {
  seq.authenticate()
  console.log('conectado com sucesso')
} catch (error) {
  console.log(error)
}

module.exports = seq
