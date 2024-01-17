const { DataTypes, Association } = require('sequelize');
const sequelize = require('../utils/database');
const Role = require('./branch');

const Institution = sequelize.define('dg_institution',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true
        
    },
    __kp_institution:{
        type: DataTypes.STRING,
        allowNull: false,primaryKey: true
    },
    _kf_user:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    _kf_branch_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Institute_name:{
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
    TIN:{
        type: DataTypes.STRING,
        allowNull: false
    },
    location:{
        type: DataTypes.STRING,
        allowNull: false
    },
    
    createdBy:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createAt:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('0','1'),
        allowNull:false,
        defaultValue: '0'
    }
});
Institution.Association = (model)=>{
    Institution.hasMany(sequelize.define('User'))
    Institution.belongsTo(sequelize.define('User'));
}

module.exports = Institution;