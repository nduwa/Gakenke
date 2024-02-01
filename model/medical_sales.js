const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Sales = sequelize.define('dg_medical_sales',{
    ID :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    _kf_transaction:{
        type: DataTypes.STRING,
        allowNull: false
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
    _kf_insurance:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_patient:{
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
    sub_total:{
        type: DataTypes.STRING,
        allowNull: false
    },
    done_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sales_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Sales;