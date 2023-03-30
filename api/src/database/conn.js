const Sequelize = require('sequelize')
//Set up default mongoose connection
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER,process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres'
});

module.exports = sequelize;
//Bind connection to error event (to get notification of connection errors)