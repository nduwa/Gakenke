const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Type = sequelize.define('dg_branch_type',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_branch_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    type_Name:{
        type: DataTypes.STRING,
        allowNull: false
    }
})
module.exports = Type;