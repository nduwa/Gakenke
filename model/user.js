const { DataTypes, Association } = require('sequelize');
const sequelize = require('../utils/database');
const Role = require('./role');
const Institute = require('./institution');
const Type = require('./branch_type');
const Branch = require('./branch');

const User = sequelize.define('dg_users',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_user:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_institution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_role:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_branch_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_branch:{
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    usercode:{
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createAt:{
        type: DataTypes.DATE,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '0'
    },
    pass_updated:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '0'
    },
    is_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    last_activity:{
        type: DataTypes.STRING,
        allowNull: false
    },
    last_seen:{
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = User;
