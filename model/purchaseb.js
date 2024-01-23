const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const B_Purchase = sequelize.define('dg_medical_ba_purchase',{
    purch_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    _kf_product:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_user:{
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
    purchase_price:{
        type: DataTypes.STRING,
        allowNull: false
    },
    selling_price:{
        type: DataTypes.STRING,
        allowNull: false
    },
    medical_source:{
        type: DataTypes.STRING,
        allowNull: true
    },
    batch:{
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity:{
        type: DataTypes.STRING,
        allowNull: false
    },
    purchase_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    expired_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    expired_qty:{
        type: DataTypes.STRING,
        allowNull: false
    },
    purchase_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = B_Purchase;