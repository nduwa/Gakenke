const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Backet = sequelize.define('dg_medical_backet',{
    ID :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    _kf_product:{
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
    batch:{
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity:{
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.STRING,
        allowNull: false
    },
    done_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    backet_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Backet;