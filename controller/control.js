const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const moment = require('moment');
const format = moment().format("YYYY-MM-DD hh:mm:ss");
const dateFormat = moment().format("YYYY-MM-DD");
const bcrypt = require('bcryptjs');
const Institute = require('../model/institution');
const Category = require('../model/category');
const Type = require('../model/branch_type');
const Branch = require('../model/branch');
const Role = require('../model/role');
const Users = require('../model/user');

/*=======  Get page for login form ============*/
exports.getUser = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    res.render('index', {
        pageTitle: 'PACE | DG-HEALTH',
        path: '/',
        errorMessage: message
    })
}
/*=======  Get  for login function ============*/
exports.getUserData = (req, res, next)=>{
    const {username,password} =req.body;
    Users.findOne({where:{username:username}})
    .then(async user => {
        if(!user){
            console.log('No user');
            req.flash('error', 'Your username is not exist!');
            return res.redirect('/')
        }else{
            if(user.status == '1'){
                let hashedPassword = user.password;	
	            bcrypt.compare(password, hashedPassword, (err, result) => {
	            if (err) {
	               console.log('bcrypt - error - ', err);
	            } else {
                    console.log('bcrypt - result - ', result);
                    if(result === true){
                        console.log('loggedIn');
                        req.session.isLoggedIn = true
                        req.session.user = user;
                        Institute.findOne({where:{__kp_institution:req.session.user._kf_institution}})
                        .then(instit =>{
                            req.session.institutes = instit; 
                            Category.findOne({where:{__kp_category:req.session.institutes._kf_category}})
                            .then(inst_category =>{
                                req.session.institute_category = inst_category; 
                                Role.findOne({where:{__kp_role:req.session.user._kf_role}})
                                .then(roles =>{
                                    req.session.role = roles; 
                                    Type.findOne({where:{__kp_branch_type:req.session.institutes._kf_branch_type}})
                                    .then(branch_type =>{
                                        req.session.branch_type = branch_type;

                                        if(req.session.branch_type.type_Name != 'UNIQUE' && req.session.role.Role_Name != 'ADMIN'){
                                            const col = {_kf_institution:req.session.user._kf_institution, __kp_branch:req.session.user.__kp_branch};
                                            Branch.findAll({where:col})
                                            .then(branch =>{
                                                req.session.branch = branch;
                                            }).catch(err =>{console.log(err);})
                                        }else{
                                            Users.update({is_type:'online',last_activity:format},{where:{__kp_user:req.session.user.__kp_user}})
                                            .then(logged =>{
                                                //console.log('You are logged In');
                                                if(req.session.institute_category.Category_Name =='ADMNISTRATION'){
                                                    console.log('You are logged In as Administration');
                                                    return res.redirect('/ADM011');
                                                }
                                                if(req.session.institute_category.Category_Name =='HEALTHCARE'){
                                                    console.log('You are logged In as Health');
                                                    return res.redirect('/HL011');
                                                }
                                                if(req.session.institute_category.Category_Name =='PHARMACIE'){
                                                    console.log('You are logged In as Pharmacie');
                                                    return res.redirect('/PH0011');
                                                }
                                            }).catch(err =>{console.log(err);})
                                        }
                                    }).catch(err =>{console.log(err);})
                                }).catch(err =>{console.log(err);})
                            }).catch(err =>{console.log(err);})
                        }).catch(err =>{console.log(err);})
                        
                    }else{
                        console.log('loggedOut');
                        req.flash('error', 'Your password is not exist!');
                        res.redirect('/')
                    }
	            }
	            });
            }else{
                req.flash('error', 'You are not allowed to enter into the system Please conctact the Administration!');
                return res.redirect('/')
            }
            
        }
    })
    .catch(err => console.log(err));

}
/*=======  Get page for log out system ============*/
exports.getLogout = (req, res, next) =>{
    Users.update({is_type: 'offline', last_seen: format}, {where:{__kp_user: req.session.user.__kp_user}})
    .then(logout =>{
        req.session.destroy(err =>{
            if(err) throw err;
            else{res.redirect('/');}
        });
    }).catch(err =>{console.log(err);}) 
};
/*=======  Get Home page for Administration ============*/
exports.getHomeAdmin = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    res.render('admin/home',{
        pageTitle: 'PACE | DG-HEALTH',
        path: '/ADM011',
        isAuthenticated:req.session.isLoggedIn,
        user_session: req.session.user,
        institute_session: req.session.institutes,
        institute_category_session: req.session.institute_category,
        branch_type_session: req.session.branch_type,
        role_session: req.session.role,
        branch_session: req.session.branch,
        errorMessage: message
    })
}
/*=======  Get user page for Administration ============*/
exports.getAdminUser = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    let user = req.session.user._kf_institution;
    if(req.session.institutes.Institute_name == 'PACE'){
        var sql =`SELECT *,dg_users.id as user_ID,dg_users.status as user_status FROM dg_users
        INNER JOIN dg_roles ON dg_users._kf_role = dg_roles.__kp_role
        INNER JOIN dg_institutions ON dg_users._kf_institution = dg_institutions.__kp_institution
        ORDER BY dg_users.id DESC`
    }else{ 
        var sql =`SELECT *,dg_users.id as user_ID,dg_users.status as user_status FROM dg_users
        INNER JOIN dg_roles ON dg_users._kf_role = dg_roles.__kp_role
        INNER JOIN dg_institutions ON dg_users._kf_institution = dg_institutions.__kp_institution
        WHERE dg_users._kf_institution = '${user}' ORDER BY dg_users.id DESC`
    }
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(data =>{ Role.findAll({where:{_kf_institution:req.session.user._kf_institution}})
        .then(datarole =>{ Branch.findAll({where:{_kf_institution:req.session.user._kf_institution}})
            .then(databranch =>{
                res.render('admin/users',{
                    pageTitle: 'PACE | DG-HEALTH',
                    path: '/ADM012',
                    isAuthenticated:req.session.isLoggedIn,
                    user_session: req.session.user,
                    institute_session: req.session.institutes,
                    institute_category_session: req.session.institute_category,
                    branch_type_session: req.session.branch_type,
                    role_session: req.session.role,
                    branch_session: req.session.branch,
                    user_data: data,roledata: datarole,
                    branchdata: databranch,
                    errorMessage: message
                })
            })
        }) 
    })
    
}
/*=======  post and save user for Administration ============*/
exports.postUserAdmin = async (req, res, next) =>{
    let action = req.body.action;
    let pwd2               =  "pace@123";
    let hashPassword = await bcrypt.hash(pwd2, 8);
    // program to generate random strings
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    let dot = '-';
    let data = generateString(8);
    let data0 = generateString(8);
    let data1 = generateString(8);
    let data2 = generateString(4);
    let data21 = generateString(4);
    let data3 = generateString(4);
    let data4 = generateString(4);
    let data5 = generateString(12);
    let data6 = generateString(12);
    let data7 = generateString(12);
    let kp_user  = data1+dot+data2+dot+data3+dot+data4+dot+data5;
    let kp_instit  = data+dot+data2+dot+data3+dot+data4+dot+data6;
    let kp_rol  = data0+dot+data21+dot+data3+dot+data4+dot+data7;
    let kp_cat  = data0+dot+data21+dot+data3+dot+data4+dot+data7;
    let kp_bra  = data0+dot+data2+dot+data3+dot+data4+dot+data7;

    if(action == 'save_users_administration'){
        const { _kf_institution,userID,full_name,email,phone,branch_type,branch,user_role,username } = req.body;
        // Example data
        const userData = {__kp_user:kp_user,_kf_institution:_kf_institution,_kf_role:user_role,
            _kf_branch_type:branch_type,_kf_branch:branch,full_name:full_name,email:email,
            phone:phone,username:username,password:hashPassword,usercode:pwd2,createdBy:userID,
            createAt:dateFormat,status:1,pass_updated:0,is_type:'Offline',last_activity:'',last_seen:''
        };
        Users.create(userData)
        .then(user => {
            req.flash('error', 'Record created successfully');
            if(req.session.institute_category.Category_Name =='ADMNISTRATION'){
                return res.redirect('/ADM012');
            }
            if(req.session.institute_category.Category_Name =='HEALTHCARE'){
                return res.redirect('/HL012');
            }
            if(req.session.institute_category.Category_Name =='PHARMACIE'){
                return res.redirect('/PH012');
            }
        }).catch(error => { console.error('Error creating record:', error);});    
    }
    if(action == 'remove_user'){
        const {user} = req.body;
        console.log(user);
        Users.destroy({where:{__kp_user:user}})
        .then(remove =>{
            req.flash('error', 'Record removed successfully');
            res.redirect('/ADM012');
        }).catch(err =>{console.log(err);})
    }
    if(action == 'save_institution_info'){
        const {institution_name,category_name,Institution_type,email,phone_number,TIN_number,
            location,userID,full_name,representor_email,representor_phone,username} = req.body;
        const institution_data = {__kp_institution:kp_instit,_kf_user:kp_user,_kf_category:category_name,
            _kf_branch_type:Institution_type,Institute_name:institution_name,email:email,phone:phone_number,
            TIN:TIN_number,location:location,createdBy:userID,createAt:dateFormat,status:0
        };
        const roles_data = {__kp_role:kp_rol,_kf_institution:kp_instit,Role_Name:'ADMIN',reg_date:dateFormat,status:1};

        const userData = {__kp_user:kp_user,_kf_institution:kp_instit,_kf_role:kp_rol,_kf_branch_type:Institution_type,
            _kf_branch:Institution_type,full_name:full_name,email:representor_email,phone:representor_phone,
            username:username,password:hashPassword,usercode:pwd2,createdBy:userID,
            createAt:dateFormat,status:1,pass_updated:0,is_type:'Offline',last_activity:'',last_seen:''
        };
        Institute.create(institution_data)
        .then(inst =>{
            Role.create(roles_data)
            .then(rosi =>{
                Users.create(userData)
                .then(giho =>{
                    req.flash('error', 'Record created successfully');
                    res.redirect('/ADM013');
                }).catch(err =>{console.log(err);})
            }).catch(err =>{console.log(err);})
        }).catch(err =>{console.log(err);})
            
    }
    if(action == 'remove_institution_data'){
        const {rosi_institution,rosi_status} = req.body;
        if(rosi_status == '0'){
            Institute.destroy({where:{__kp_institution:rosi_institution}})
            .then(rosi_reomved =>{
                Role.destroy({where:{_kf_institution:rosi_institution}})
                .then(role_rosi =>{
                    Users.destroy({where:{_kf_institution:rosi_institution}})
                    .then(user_rosi =>{
                        req.flash('error', 'Record removed successfully');
                        res.redirect('/ADM013');
                    }).catch(err =>{console.log(err);})
                }).catch(err =>{console.log(err);})
            }).catch(err =>{console.log(err);})
        }else{
            req.flash('error', 'Not allowed to remove it!');
            res.redirect('/ADM013');
        }
        
    }
    if(action == 'save_category_info'){
        const {category_name} = req.body;
        const cat ={__kp_category:kp_cat,Category_Name:category_name,createAt:dateFormat,status:0}
        Category.create(cat)
        .then(cat_data =>{
            req.flash('error', 'Record created successfully');
            res.redirect('/ADM013');
        })
    }
    if(action == 'save_branch_info'){
        const {branch_name} = req.body;
        const branches ={__kp_branch:kp_bra,_kf_institution:req.session.user._kf_institution,
            branch_Name:branch_name,reg_date:dateFormat,status:0}
        Branch.create(branches)
        .then(bra_data =>{
            req.flash('error', 'Record created successfully');
            res.redirect('/PH0012');
        }).catch(err =>{console.log(err);})
    }
    if(action == 'save_role_info'){
        const {role_name} = req.body;
        const rolese ={__kp_role:kp_rol,_kf_institution:req.session.user._kf_institution,
            Role_Name:role_name,reg_date:dateFormat,status:0}
        Role.create(rolese)
        .then(ro_data =>{
            req.flash('error', 'Record created successfully');
            if(req.session.institute_category.Category_Name =='ADMNISTRATION'){
                return res.redirect('/ADM012');
            }
            if(req.session.institute_category.Category_Name =='HEALTHCARE'){
                return res.redirect('/HL012');
            }
            if(req.session.institute_category.Category_Name =='PHARMACIE'){
                return res.redirect('/PH0012');
            }
        }).catch(err =>{console.log(err);})
    }
}
/*=======  get, change user info for Administration ============*/
exports.getUserAdmin = (req, res, next)=>{
    const { action } = req.params.action;
    console.log(action);
}
/*=======  get data setting info for Administration ============*/
exports.getAdminSetting = (req, res, next)=>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    var sql = `SELECT *,dg_institutions.id as inst_ID,dg_institutions.status as inst_status 
    FROM dg_institutions INNER JOIN dg_categories ON dg_institutions._kf_category = dg_categories.__kp_category
    INNER JOIN dg_branch_types ON dg_institutions._kf_branch_type = dg_branch_types.__kp_branch_type
    ORDER BY dg_institutions.id DESC`;
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(results =>{
        Role.findAll({where:{_kf_institution:req.session.user._kf_institution}})
        .then(resulta =>{
            Category.findAll() 
            .then(resulted =>{
                Type.findAll()
                .then(type_result =>{
                    res.render('admin/setting',{
                        pageTitle: 'PACE | DG-HEALTH',
                        path: '/ADM013',
                        isAuthenticated:req.session.isLoggedIn,
                        user_session: req.session.user,
                        institute_session: req.session.institutes,
                        institute_category_session: req.session.institute_category,
                        branch_type_session: req.session.branch_type,
                        role_session: req.session.role,
                        branch_session: req.session.branch,
                        errorMessage: message,
                        instit_data: results,
                        cate_data:resulted,
                        role_data:resulta,
                        type_data:type_result
                    })
                }).catch(err =>{console.log(err);})
            }).catch(err =>{console.log(err);}) 
        }).catch(err =>{console.log(err);})
    }).catch(err =>{console.log(err);})
    
    
    
}
/*=======  post and save user for Administration ============*/
/*=======  pharmaceutical ============*/
exports.getPharmaHome = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    res.render('Pharmacie/home',{
        pageTitle: 'PACE | DG-HEALTH',
        path: '/PH0011',
        isAuthenticated:req.session.isLoggedIn,
        user_session: req.session.user,
        institute_session: req.session.institutes,
        institute_category_session: req.session.institute_category,
        branch_type_session: req.session.branch_type,
        role_session: req.session.role,
        branch_session: req.session.branch,
        errorMessage: message
    })
};
/*=======  get data setting info from Pharmacie ============*/
exports.getPharmaSetting = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    Role.findAll({where:{_kf_institution:req.session.user._kf_institution}})
    .then(roles =>{
        Branch.findAll({where:{_kf_institution:req.session.user._kf_institution}})
        .then(branchdata =>{
            res.render('Pharmacie/setting',{
                pageTitle: 'PACE | DG-HEALTH',
                path: '/PH0012',
                isAuthenticated:req.session.isLoggedIn,
                user_session: req.session.user,
                institute_session: req.session.institutes,
                institute_category_session: req.session.institute_category,
                branch_type_session: req.session.branch_type,
                role_session: req.session.role,
                branch_session: req.session.branch,
                errorMessage: message,
                roledatas:roles,
                branchdatas: branchdata
            })
        })
    })
    
}
