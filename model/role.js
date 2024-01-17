const { DataTypes, Association } = require('sequelize');
const sequelize = require('../utils/database');
const Institute = require('./institution');
const User = require('./user');

const Role = sequelize.define('dg_role',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_role:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_institution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Role_Name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    reg_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '0'
    }
});

module.exports = Role;