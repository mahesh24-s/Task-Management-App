const express = require('express');
const router = express.Router();
const User = require('../models/User.js');

const {
    isTaskOwner,
    isTaskOwnerOrAssigned,
    isTaskOwnerOrAdmin
} = require('../middlewares/user');

const {
    createUser,
    loginUser,
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,
    updatePassword
} = require('../controllers/user');

const {auth} = require("../middlewares/auth.js")

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/tasks',auth, getMyTasks);
router.post('/tasks',auth , createTask);
router.put('/tasks/:id',auth, isTaskOwnerOrAdmin, updateTask);
router.delete('/tasks/:id',auth,isTaskOwnerOrAdmin, deleteTask);
router.patch('/password',auth, updatePassword);

module.exports = router;

/*

// Task Management (Own tasks only)
router.put('/tasks/:id', authenticate, isTaskOwner, updateTask);
router.delete('/tasks/:id', authenticate, isTaskOwner, deleteTask);
router.patch('/tasks/:id/status', authenticate, isTaskOwnerOrAssigned, updateTaskStatus);

// Profile Management
router.get('/profile', authenticate, getMyProfile);
router.put('/profile', authenticate, updateMyProfile);
router.patch('/profile/password', authenticate, changePassword);

*/