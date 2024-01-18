const Sequelize = require('sequelize');

// const sequelize = new Sequelize('DG_HEALTH', 'postgres', 'nduwaJesus', {
//   host: 'localhost',
//   dialect: 'postgres',
//   port: 5432
// });

const sequelize = new Sequelize('DG_HEALTH','root','',{
  host: 'localhost',
  dialect: 'mysql',
  define:{
      freezeTableName:true,
      timestamps: false
  }
});
module.exports = sequelize;