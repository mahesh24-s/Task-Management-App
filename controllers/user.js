const User = require('../models/User');
const Task = require('../models/Task')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req,res) {
    try {
        const {name,email,password,role} = req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:'Name, Email and Password are required'
            })
        }

        const existingUser = await User.findOne({email:email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User with this email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            role,
        })
        res.status(201).json({
            success:true,
            data:newUser
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:'Internal Server Error'
        });
    }
}

async function loginUser (req, res) {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email });

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const payload={ email: user.email, id: user._id, role: user.role };
            console.log(payload);
			const token = jwt.sign( payload, process.env.JWT_SECRET,{ expiresIn: "2h"} );

			user.token = token;
            // user.save();
			
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} 
		else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} 
	catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
            token:token,
			message: `Login Failure Please Try Again`,
			error:error.message,
		});
	}
};

const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        // const { status, priority, page = 1, limit = 10 } = req.query;
        
        const filter = {
            $or: [
                { createdBy: userId },
                { assignedTo: userId }
            ]
        };
        
        // if (status) filter.status = status;
        // if (priority) filter.priority = priority;
        
        const tasks = await Task.find(filter)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Task (Self-assigned only)
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const userId = req.user.id ;

        console.log(title,description,priority,userId);

        // Users can only create tasks for themselves
        const task = await Task.create({
            title,
            description,
            priority: priority || 'medium',
            dueDate: dueDate || new Date(Date.now() + 10 * 24  * 60 * 60),
            assignedTo: userId, // Always assigned to self
            createdBy: userId
        });
        
        await User.findByIdAndUpdate(
            {_id:userId},
            { $push:{
                tasks:task._id
            }
        })


        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTask = async (req, res) => {
    try{
        console.log("inside updateTask controller");
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        console.log("just before db call in updatetask controller");
        const task = await Task.findOne({ _id: id});
        console.log("just after db call in updatetask controller");

        if(!task){
            return res.status(404).json({
                success: false,
                message: 'Task not found or not owned by user'
            });
        }

        Object.keys(updates).forEach(key => {
            task[key] = updates[key];
        });

        const updatedTask = await task.save();
        return res.status(200).json({
            success: true,
            data: updatedTask
        });
    } catch(error){
        return res.status(500).json({ success: false, message: `internal error, ${error.message }`});
    }
}

const deleteTask = async (req, res) => {
    try{
        await Task.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updatePassword = async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }   
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createUser,
    loginUser,
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,
    updatePassword
}

/*
     User Dashboard Features
    A. Task View
    My Tasks - Tasks created by the user
    Assigned to Me - Tasks assigned to the user
    Filter options: Status, Priority, Due Date
    Sort options: Created Date, Due Date, Priority

    Task Actions
    Add New Task button
    Edit own tasks
    Delete own tasks
    Mark Complete/In Progress
    View Task Details

    Profile Section
    Personal information display
    Edit profile button
    Change password option
    Last login display
*/


/*
    User(Not Admin) Task Operations Allowed

    A. Create Tasks
    Create tasks assigned to themselves only
    Set title, description, priority, due date
    Cannot assign tasks to other users

    B. Manage Own Tasks
    Full CRUD operations on tasks they created
    Update status: pending → in-progress → completed
    Edit title, description, priority, due date
    Delete tasks they own

    C. View Permissions
    View tasks they created (createdBy = userId)
    View tasks assigned to them (assignedTo = userId)
    Cannot view other users' tasks
    Cannot see system-wide task lists

    View own profile information
    Update personal details (name, phone, position)
    Change profile picture/avatar
    Update email address
    Change password
    View last login timestamp

    Cannot change own role
    Cannot view other users' profiles
    Cannot access admin dashboard
*/

/*
    User Dashboard Layout
    
    {
    navigation: [
        { name: 'My Tasks', icon: 'List', path: '/tasks' },
        { name: 'Create Task', icon: 'Plus', path: '/tasks/create' },
        { name: 'Profile', icon: 'User', path: '/profile' }
    ],
    views: [
        'Task List (created + assigned)',
        'Task Detail View',
        'Create Task Form',
        'Profile Edit Form'
    ]
}

*/