const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    tasks:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task",
        }],
    phone: String,
    token: String,
    lastLogin: Date,
    profile: {
        avatar: String,
        phone: String,
        dateOfBirth: Date
    }
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema);

module.exports = User;

/*
3. Admin-Specific Features
A. User Management Dashboard
    List all users with filters (role, status, department)
    Create new users with role assignment
    Edit user profiles (name, email, role, department)
    Bulk operations (import/export users)
B. Task Oversight & Management
    View all tasks across the organization
    Create tasks on behalf of any user
    Edit/Delete any task regardless of owner
    Reassign tasks between users
    Set task priorities and due dates
    Bulk update task statuses
*/

/*
     User vs Admin Comparison
     
    Feature	             User	                    Admin

    Create Tasks	    Self only	                Any user
    View Tasks	        Own + Assigned	            All tasks
    Edit Tasks	        Own only	                Any task
    Delete Tasks	    Own only	                Any task
    User Management	    None	                    Full access
*/

/*
    admin dashboard layout

    {
        navigation: [
            { name: 'Dashboard', icon: 'Home', path: '/admin' },
            { name: 'Users', icon: 'Users', path: '/admin/users' },
            { name: 'Tasks', icon: 'CheckSquare', path: '/admin/tasks' }
        ],
        widgets: [
            'Total Users',
            'Active Tasks',
            'Completed Tasks (This Week)',
            'System Status'
        ]
    }
*/

/*

*/