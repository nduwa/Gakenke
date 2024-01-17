const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Category = sequelize.define('dg_category',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Category_Name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createAt:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '0'
    }
})
module.exports = Category;