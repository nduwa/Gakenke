const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Expense = sequelize.define('dg_expense',{
    expense_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_expense:{
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
    expense_desc:{
        type: DataTypes.STRING,
        allowNull: false
    },
    expense_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    },
    expense_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Done_By:{
        type: DataTypes.STRING,
        allowNull: false
    }
})
module.exports = Expense;