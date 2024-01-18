const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Product = sequelize.define('dg_medical_product',{
    product_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    __kp_product:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    product_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    register_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    product_status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '1'
    }
})
module.exports = Product;