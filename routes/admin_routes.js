const express = require('express');
const authMiddleware = require("../middlewares/auth_middleware");
const adminMiddleware = require('../middlewares/admin_middleware')


const router = express.Router();

//Authmiddleware => Is user authenticated or not
//Adminmiddleware => Is user role admin or not
router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {

    const { userId, username, role } = req.userInfo

    res.json({
        message: 'Welcome to the admin page',
        user: {
            userId, username, role
        }
    })
})

module.exports = router;