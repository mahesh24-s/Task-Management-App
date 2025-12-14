// routes/admin.js
const express = require('express');
const router = express.Router();
const { isAdmin, isAdminOrOwner } = require('../middlewares/auth.js');
const {auth} = require('../middlewares/auth.js')

const {
    getAllUsers,
    changeUserRole,
    deleteUser,
    assignTaskToUser
} = require('../controllers/admin');

router.get('/users',auth, isAdmin, getAllUsers);
router.patch('/users/updateRole/:id',auth, isAdmin, changeUserRole);
router.delete('/users/:id',auth, isAdminOrOwner, deleteUser);
router.post('/tasks/assign',auth, isAdmin, assignTaskToUser);
// router.get('/tasks',auth, isAdmin, getAllTasks);

module.exports = router;