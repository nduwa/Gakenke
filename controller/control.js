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
const Product = require('../model/medical_product');
const Medi_category = require('../model/medi_category');
const Income = require('../model/income');
const Expense = require('../model/expenses');
const Purchase = require('../model/purchase');
const B_Purchase = require('../model/purchaseb');
const Backet = require('../model/medical_backet');
const Insurance = require('../model/insurance');
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
	            }else{
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
                                        if(req.session.branch_type.type_Name !='UNIQUE' && req.session.role.Role_Name != 'ADMIN'){
                                            const col = {_kf_institution:req.session.user._kf_institution,__kp_branch:req.session.user._kf_branch};
                                            Branch.findAll({where:col},{raw:true})
                                            .then(branch =>{
                                                req.session.branch = branch;
                                                let branches = req.session.branch.branch_Name;
                                                console.log(branches);  
                                            }).catch(err =>{console.log(err);})
                                        }else{
                                            let branches = req.session.branch_type.__kp_branch_type;
                                            console.log(branches);
                                        }
                                        Users.update({is_type:'online',last_activity:format},{where:{__kp_user:req.session.user.__kp_user}})
                                        .then(logged =>{
                                            //console.log('You are logged In');
                                            if(req.session.institute_category.Category_Name =='ADMNISTRATION'){
                                                console.log('You are logged In as Administration');
                                                return res.redirect('/ADM011');
                                            }
                                            if(req.session.institute_category.Category_Name =='HEALTHCARE'){
                                                console.log('You are logged In as Health');
                                                return res.redirect('/HLCA0011');
                                            }
                                            if(req.session.institute_category.Category_Name =='PHARMACIE'){
                                                console.log('You are logged In as Pharmacie');
                                                return res.redirect('/PH0011');
                                            }
                                        }).catch(err =>{console.log(err);})
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
        INNER JOIN dg_role ON dg_users._kf_role = dg_role.__kp_role
        INNER JOIN dg_institution ON dg_users._kf_institution = dg_institution.__kp_institution
        ORDER BY dg_users.id DESC`
    }else{ 
        var sql =`SELECT *,dg_users.id as user_ID,dg_users.status as user_status FROM dg_users
        INNER JOIN dg_role ON dg_users._kf_role = dg_role.__kp_role
        INNER JOIN dg_institution ON dg_users._kf_institution = dg_institution.__kp_institution
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
                return res.redirect('/PH0012');
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
    var sql = `SELECT *,dg_institution.id as inst_ID,dg_institution.status as inst_status 
    FROM dg_institution INNER JOIN dg_category ON dg_institution._kf_category = dg_category.__kp_category
    INNER JOIN dg_branch_type ON dg_institution._kf_branch_type = dg_branch_type.__kp_branch_type
    ORDER BY dg_institution.id DESC`;
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
/*=======  post, get and save user for pharmaceutical ============*/

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
/*=======  get data medecal category info from Pharmacie ============*/
exports.getPharmaMediCategory = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    Medi_category.findAll()
    .then(medi_cate =>{
        res.render('Pharmacie/medical_category',{
            pageTitle: 'PACE | DG-HEALTH',
            path: '/PH0014',
            isAuthenticated:req.session.isLoggedIn,
            user_session: req.session.user,
            institute_session: req.session.institutes,
            institute_category_session: req.session.institute_category,
            branch_type_session: req.session.branch_type,
            role_session: req.session.role,
            branch_session: req.session.branch,
            errorMessage: message,
            medi_category: medi_cate
        })
    })
}
/*=======  get data medical product info from Pharmacie ============*/
exports.getPharmaMedecine = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    var sql = `SELECT * FROM dg_medical_product INNER JOIN dg_medical_category
     ON dg_medical_product._kf_category = dg_medical_category.__kp_mede_category`;
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(medecine =>{
        Medi_category.findAll()
        .then(category =>{
            res.render('Pharmacie/medical_product',{
                pageTitle: 'PACE | DG-HEALTH',
                path: '/PH0013',
                isAuthenticated:req.session.isLoggedIn,
                user_session: req.session.user,
                institute_session: req.session.institutes,
                institute_category_session: req.session.institute_category,
                branch_type_session: req.session.branch_type,
                role_session: req.session.role,
                branch_session: req.session.branch,
                errorMessage: message,
                medical_data: medecine,
                category_data: category
            })
        })
    }).catch(err =>{console.log(err);})
    
}
/*=======  get data income info from Pharmacie ============*/
exports.getSystemIncome = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    Income.findAll({where:{_kf_institution:req.session.institutes.__kp_institution}})
    .then(income =>{
        res.render('Pharmacie/income',{
            pageTitle: 'PACE | DG-HEALTH',
            path: '/PH0015',
            isAuthenticated:req.session.isLoggedIn,
            user_session: req.session.user,
            institute_session: req.session.institutes,
            institute_category_session: req.session.institute_category,
            branch_type_session: req.session.branch_type,
            role_session: req.session.role,
            branch_session: req.session.branch,
            errorMessage: message,
            income_data: income
        })
    })
}
/*=======  get data expense info from Pharmacie ============*/
exports.getSystemExpense = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    Expense.findAll({where:{_kf_institution:req.session.institutes.__kp_institution}})
    .then(expense =>{
        res.render('Pharmacie/expense',{
            pageTitle: 'PACE | DG-HEALTH',
            path: '/PH0016',
            isAuthenticated:req.session.isLoggedIn,
            user_session: req.session.user,
            institute_session: req.session.institutes,
            institute_category_session: req.session.institute_category,
            branch_type_session: req.session.branch_type,
            role_session: req.session.role,
            branch_session: req.session.branch,
            errorMessage: message,
            expense_data: expense
        })
    })
}
/*=======  get data purchase medecine info from Pharmacie ============*/
exports.getPharmaPurchase = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    var sql = `SELECT * FROM dg_medical_purchase INNER JOIN dg_medical_product
     ON dg_medical_purchase._kf_product = dg_medical_product.__kp_product`;
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(purchase =>{
        Product.findAll()
        .then(prod =>{
            res.render('Pharmacie/purchase',{
                pageTitle: 'PACE | DG-HEALTH',
                path: '/PH0017',
                isAuthenticated:req.session.isLoggedIn,
                user_session: req.session.user,
                institute_session: req.session.institutes,
                institute_category_session: req.session.institute_category,
                branch_type_session: req.session.branch_type,
                role_session: req.session.role,
                branch_session: req.session.branch,
                errorMessage: message,
                product_data: prod,
                purchase_data: purchase
            })
        }).catch(err =>{console.log(err);})
    }).catch(err =>{console.log(err);})
    
}
/*=======  post data pharmacie info from Pharmacie ============*/
exports.postPharmaInfo = (req, res, next) =>{
    const {action} = req.body;
    if(req.session.branch_type.type_Name == 'UNIQUE'){
        var kp_branch = req.session.branch_type.__kp_branch_type;
    }else{
        //var kp_branch = req.session.branch.__kp_branch;
        if(req.session.role.Role_Name == 'ADMIN'){
            var kp_branch = req.session.user._kf_branch;
        }else{
            var kp_branch = req.session.branch.__kp_branch;
        }
        console.log(kp_branch);
    }
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
    let kp_prod  = data1+dot+data2+dot+data3+dot+data4+dot+data5;
    let kp_instit  = data+dot+data2+dot+data3+dot+data4+dot+data6;
    let kp_rol  = data0+dot+data21+dot+data3+dot+data4+dot+data7;
    let kp_cat  = data0+dot+data21+dot+data3+dot+data4+dot+data7;
    let kp_income  = data0+dot+data2+dot+data3+dot+data4+dot+data7;
    

    if(action == 'save_medecine_product_info'){
        const {medecine_name,medecine_category} = req.body;
        const product = {__kp_product:kp_prod,_kf_category:medecine_category,product_name:medecine_name,
            register_date:dateFormat,product_status:1};
        Product.create(product)
        .then(mede_product =>{
            req.flash('error', 'Record created successfully');
            res.redirect('/PH0013');
        }).catch(err =>{console.log(err);})
    }
    if(action == 'remove_medecine_product_info'){
        console.log('wellll');
    }
    if(action == 'save_income_info'){
        const {income_amount,income_desc} = req.body;
        const inome = {__kp_income:kp_income,_kf_institution:req.session.institutes.__kp_institution, Amount:income_amount,
             income_desc:income_desc,income_status:1,income_date:dateFormat,Done_By:req.session.user.__kp_user};
        Income.create(inome)
        .then(incomes =>{
            req.flash('error', 'Record created successfully');
            res.redirect('/PH0015');
        }).catch(err =>{console.log(err);})
    }
    if(action == 'save_expense_info'){
        const {expense_amount,expense_desc} = req.body;
        const expense = {__kp_expense:kp_income,_kf_institution:req.session.institutes.__kp_institution, Amount:expense_amount,
            expense_desc:expense_desc,expense_status:1,expense_date:dateFormat,Done_By:req.session.user.__kp_user};
        Expense.create(expense)
        .then(expenses =>{
            req.flash('error', 'Record created successfully');
            res.redirect('/PH0016');
        }).catch(err =>{console.log(err);})
    }
    if(action == 'save_purchased_info'){
        const {medecine_name,batch,purchase_price,selling_price,quantity,expired_date} = req.body;
        const purhase = {_kf_product:medecine_name,_kf_user:req.session.user.__kp_user,_kf_institution:req.session.institutes.__kp_institution,
            _kf_branch:kp_branch, purchase_price:purchase_price,selling_price:selling_price,medical_source:1,
            batch:batch,quantity:quantity,purchase_date:dateFormat,expired_date:expired_date,expired_qty:'',purchase_status:1};
        Purchase.create(purhase)
        .then(purchases =>{
            B_Purchase.create(purhase)
            .then(purchasesb =>{
                req.flash('error', 'Record created successfully');
                res.redirect('/PH0017');
            }).catch(err =>{console.log(err);})
        }).catch(err =>{console.log(err);})
    }
    if(action == 'serve_data_basket'){
        const {product,quantity,batch,selling_price,serve_quantity} = req.body;
        const backet = {_kf_product:product,_kf_institution:req.session.institutes.__kp_institution, _kf_branch:kp_branch,
           _kf_user:req.session.user.__kp_user,batch:batch,quantity:serve_quantity,price:selling_price,done_date:dateFormat,backet_status:1};
           Backet.create(backet)
           .then(backetes =>{
               req.flash('error', 'Record created successfully');
               res.redirect('/PH0018');
           }).catch(err =>{console.log(err);})
    }
    if(action == 'view_basket_data'){
        let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    const institute = req.session.institutes.__kp_institution;
    var sql = `SELECT * FROM dg_medical_backet INNER JOIN dg_medical_product
    ON dg_medical_backet._kf_product = dg_medical_product.__kp_product
    WHERE dg_medical_backet._kf_institution ='${institute}'`;
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(backet_prod =>{
        res.render('Pharmacie/basket',{
            pageTitle: 'PACE | DG-HEALTH',
            path: '/PH0018',
            isAuthenticated:req.session.isLoggedIn,
            user_session: req.session.user,
            institute_session: req.session.institutes,
            institute_category_session: req.session.institute_category,
            branch_type_session: req.session.branch_type,
            role_session: req.session.role,
            branch_session: req.session.branch,
            errorMessage: message,
            backet_data: backet_prod
        })
    }).catch(err =>{console.log(err);})
    }

}
/*=======  get data serve medecine info from Pharmacie ============*/
exports.getPharmaServe = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    var sql = `SELECT * FROM dg_medical_purchase INNER JOIN dg_medical_product
     ON dg_medical_purchase._kf_product = dg_medical_product.__kp_product`;
    sequelize.query(sql,{ type: Sequelize.QueryTypes.SELECT })
    .then(serve =>{
        Backet.findAndCountAll({where:{_kf_institution:req.session.institutes.__kp_institution}})
        .then(backet_prod =>{
            const { count,rows } = backet_prod;
            res.render('Pharmacie/serve_medecine',{
                pageTitle: 'PACE | DG-HEALTH',
                path: '/PH0018',
                isAuthenticated:req.session.isLoggedIn,
                user_session: req.session.user,
                institute_session: req.session.institutes,
                institute_category_session: req.session.institute_category,
                branch_type_session: req.session.branch_type,
                role_session: req.session.role,
                branch_session: req.session.branch,
                errorMessage: message,
                count_data: count,
                backet_data: rows,
                serve_data: serve
            })
        }).catch(err =>{console.log(err);})
    }).catch(err =>{console.log(err);})
    
}
/*=======  get data basket info from Pharmacie ============*/
exports.getPharmaBasket = (req, res, next) =>{
    
}
/*=======  post, get and save user for Healthcare ============*/
/*======= get index for Health ============*/
exports.getHealthHome = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    res.render('Healthcare/home',{
        pageTitle: 'PACE | DG-HEALTH',
        path: '/HLCA0011',
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
/*======= get insurance for Health ============*/
exports.getInsuranceData = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0) { message = message[0]; }
    else { message = null; }
    Insurance.findAll({where:{_kf_institution:req.session.institutes.__kp_institution}})
    .then(income =>{
        res.render('Healthcare/insurance',{
            pageTitle: 'PACE | DG-HEALTH',
            path: '/HLCA0012',
            isAuthenticated:req.session.isLoggedIn,
            user_session: req.session.user,
            institute_session: req.session.institutes,
            institute_category_session: req.session.institute_category,
            branch_type_session: req.session.branch_type,
            role_session: req.session.role,
            branch_session: req.session.branch,
            errorMessage: message,
            income_data: income
        })
    })
};