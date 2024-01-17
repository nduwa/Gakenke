const Sequelize = require('sequelize');

const sequelize = new Sequelize('DG_HEALTH', 'postgres', 'nduwaJesus', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});
module.exports = sequelize;