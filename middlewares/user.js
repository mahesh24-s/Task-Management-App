// middlewares/auth.js
const Task = require("../models/Task");

// Check if user owns the task
const isTaskOwner = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }
        
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to modify this task' 
            });
        }
        
        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if user owns or is assigned to the task
const isTaskOwnerOrAssigned = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }
        
        const userId = req.user._id.toString();
        if (task.createdBy.toString() !== userId && 
            task.assignedTo.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to access this task' 
            });
        }
        
        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const isTaskOwnerOrAdmin = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        const userId = req.user.id.toString();

        if(task.createdBy.toString() !== userId && req.user.role !== 'admin'){
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to access this task' 
            });
        }
        // req.task = task;
        next();
    } catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    isTaskOwner,
    isTaskOwnerOrAssigned,
    isTaskOwnerOrAdmin
}
