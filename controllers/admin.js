// controllers/admin.js
const User = require('../models/User');
const Task = require('../models/Task');

// Get all users with pagination and filters
async function getAllUsers(req, res) {
    try {
        const AllUsers = await User.find({}).populate('tasks');
        console.log(AllUsers);

        res.status(200).json({
            success: true,
            data: AllUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }   
}

// Change user role
const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (role !== 'user' && role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findOne({ _id: id });

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = role;
        const updatedEntry = await user.save();

        res.json({
            success: true,
            data: updatedEntry,
            message: `User role updated to ${role}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        // prevent admin from deleting themselves
        if(req.user.id.toString() === id){
            return res.status(400).json({
                success: false,
                message: 'Admin cannot delete themselves'
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // first delete all tasks created by or assigned to this user
        await Task.deleteMany({ $or: [ { createdBy: id }, { assignedTo: id } ] });

        await User.deleteOne({ _id: id });

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const assignTaskToUser = async (req, res) => {
    try{
        const { taskId, userId } = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            }); 
        }

        task.assignedTo = userId;
        const updatedTask = await task.save();
        res.status(200).json({
            success: true,
            data: updatedTask,
            message: `Task assigned to user ${user.name}`
        });
    } catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getAllUsers,
    changeUserRole,
    deleteUser,
    assignTaskToUser
}

/*
    Testing Strategy

    Unit tests for admin middleware
    Integration tests for admin routes
    Authorization tests for role-based access
    Edge cases: Admin trying to delete themselves, etc.

*/