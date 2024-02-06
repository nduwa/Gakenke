const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Insurance = sequelize.define('dg_insurance',{
    insurance_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_insurance:{
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
    insurance_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    percentage:{
        type: DataTypes.STRING,
        allowNull: false
    },
    registered_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    insurance_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Insurance;