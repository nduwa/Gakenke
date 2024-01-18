const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Income = sequelize.define('dg_income',{
    income_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_income:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_institution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Amount:{
        type: DataTypes.STRING,
        allowNull: false
    },
    income_desc:{
        type: DataTypes.STRING,
        allowNull: false
    },
    income_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    },
    income_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Done_By:{
        type: DataTypes.STRING,
        allowNull: false
    }
})
module.exports = Income;