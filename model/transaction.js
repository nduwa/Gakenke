const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Transaction = sequelize.define('dg_transaction',{
    transaction_ID :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_transaction:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_institution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_branch:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_user:{
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_number:{
        type: DataTypes.STRING,
        allowNull: false
    },
    total_price:{
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_transaction:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    trans_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Transaction;