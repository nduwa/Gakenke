const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Medi_category = sequelize.define('dg_medical_category',{
    category_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_mede_category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    category_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    category_desc:{
        type: DataTypes.STRING,
        allowNull: false
    },
    category_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Medi_category;