const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Role = sequelize.define('dg_branch',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_branch:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_institution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    branch_Name:{
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
})
module.exports = Role;