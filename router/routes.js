const express = require('express');
const contr = require('../controller/control');
const isOn = require('../middleware/isAth');
const router = express.Router();

router.get('/',contr.getUser);
router.post('/action_page',contr.getUserData);
router.get('/log097out', contr.getLogout);
//============= ADMINISTRATION ==========
router.get('/ADM011',isOn, contr.getHomeAdmin);
router.get('/ADM012', isOn, contr.getAdminUser);
router.get('/ADM013', isOn, contr.getAdminSetting);
router.get('/ADuserGET', isOn, contr.getUserAdmin);
router.post('/ADuserPOST', isOn, contr.postUserAdmin);
//============= HEALTHCARE ==============
//============= PHARMACIE  ==============
router.get('/PH0011', isOn, contr.getPharmaHome);
router.get('/PH0012', isOn, contr.getPharmaSetting);
router.get('/PH0013', isOn, contr.getPharmaMedecine);
router.get('/PH0014', isOn, contr.getPharmaMediCategory);
router.get('/PH0015', isOn, contr.getSystemIncome);
router.get('/PH0016', isOn, contr.getSystemExpense);
router.get('/PH0017', isOn, contr.getPharmaPurchase);
//router.get()

module.exports = router;