import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminAPI, taskAPI } from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import Profile from '../components/Profile';
import TaskCard from '../components/TaskCard';
import { Accordion, SimpleAccordionItem } from '../components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Users, CheckSquare, Clock, CheckCircle2, Search, Trash2, Shield, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
    });
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Task Filter State
    const [taskSearchTerm, setTaskSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const response = await adminAPI.getAllUsers();

            if (response.data.success) {
                const fetchedUsers = response.data.data;
                console.log('Fetched Users:', fetchedUsers);
                setUsers(fetchedUsers);

                // Extract tasks from users and flatten them into a single array
                const allTasks = fetchedUsers.flatMap(user =>
                    (user.tasks || []).map(task => ({
                        ...task,
                        // Handle potential field name differences based on user description
                        _id: task.taskId || task._id,
                        title: task.taskname || task.title,
                        description: task.description || task.description,
                        assignedTo: user
                    }))
                );

                setTasks(allTasks);
                updateStats(fetchedUsers, allTasks);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (currentUsers, currentTasks) => {
        setStats({
            totalUsers: currentUsers?.length || 0,
            totalTasks: currentTasks?.length || 0,
            pendingTasks: currentTasks?.filter(t => t.status === 'pending').length || 0,
            completedTasks: currentTasks?.filter(t => t.status === 'completed').length || 0,
        });
    }

    // Handlers
    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their tasks.')) {
            try {
                await adminAPI.deleteUser(userId);
                fetchAllData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleChangeRole = async (userId, currentRole, e) => {
        e.stopPropagation();
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Change user role to ${newRole}?`)) {
            try {
                await adminAPI.changeUserRole(userId, newRole);
                fetchAllData();
            } catch (error) {
                console.error('Error changing role:', error);
            }
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                fetchAllData();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    // Filter Logic
    const getFilteredTasks = () => {
        let filtered = [...tasks];
        if (taskSearchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(taskSearchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }
        return filtered;
    };

    // Render Functions
    const renderUsers = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage users and view their assigned tasks</p>
            </div>

            <Accordion className="w-full space-y-4">
                {users.map((user) => {
                    const userTasks = (user.tasks || []).map(task => ({
                        ...task,
                        _id: task.taskId || task._id,
                        title: task.taskname || task.title
                        // Add other mappings if necessary, but preserving original object for other props
                    }));
                    return (
                        <SimpleAccordionItem
                            key={user._id}
                            className="border rounded-lg px-4 bg-card"
                            title={
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold text-lg">{user.name}</span>
                                            <span className="text-sm text-muted-foreground">{user.email}</span>
                                        </div>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">{userTasks.length} Tasks</Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleChangeRole(user._id, user.role, e)}
                                        >
                                            Switch Role
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={(e) => handleDeleteUser(user._id, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            }
                        >
                            <div className="pt-4 pb-2">
                                <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Assigned Tasks</h4>
                                {userTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {userTasks.map(task => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                onDelete={handleDeleteTask}
                                            // Admin usually cannot edit user tasks directly in this view unless requested, 
                                            // strictly strictly requested "show users... and their tasks"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No tasks assigned to this user.</p>
                                )}
                            </div>
                        </SimpleAccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );

    const renderTaskOversight = () => {
        const filtered = getFilteredTasks();
        return (
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Task Oversight</h1>
                    <p className="text-muted-foreground">Global view of all tasks</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Users</CardDescription>
                            <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Tasks</CardDescription>
                            <CardTitle className="text-3xl">{stats.totalTasks}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-3xl text-yellow-600">{stats.pendingTasks}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Completed</CardDescription>
                            <CardTitle className="text-3xl text-green-600">{stats.completedTasks}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search all tasks..."
                                        value={taskSearchTerm}
                                        onChange={(e) => setTaskSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-white/10 rounded-md px-3 py-2 text-sm bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="border border-white/10 rounded-md px-3 py-2 text-sm bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="all">All Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onDelete={handleDeleteTask}
                            showAssignee={true}
                        />
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-lg">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'tasks' && renderTaskOversight()}
            {activeTab === 'profile' && <Profile />}
        </DashboardLayout>
    );
};

export default AdminDashboard;
