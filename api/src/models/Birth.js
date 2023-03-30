const bcrypt_nodejs = require("bcrypt");
const Sequelize = require('sequelize')
const sequelize = require("../database/conn");

const birthSchema = sequelize.define('certificates', {

    // Column-1, user_id is an object with 
    // properties like type, keys, 
    // validation of column.
    id: {
  
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    father_name: { type: Sequelize.STRING, allowNull: false },
    mother_name: { type: Sequelize.STRING, allowNull: false },
    gender: { type: Sequelize.STRING, allowNull: false },
    hospital_name: { type: Sequelize.STRING, allowNull: false },
    weight: { type: Sequelize.STRING, allowNull: false },
    placeofbirth: { type: Sequelize.STRING, allowNull: false },
    dob: { type: Sequelize.STRING, allowNull: false },
    address_birth: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
  })
  sequelize.sync()

  module.exports = birthSchema