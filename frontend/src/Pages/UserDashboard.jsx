import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import Profile from '../components/Profile';
import TaskCard from '../components/TaskCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Search, Filter } from 'lucide-react';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        } else {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        filterTasks();
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await taskAPI.getUserTasks();
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (priorityFilter !== 'all') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await taskAPI.createTask({
                title,
                description,
                priority,
                dueDate: dueDate || undefined,
            });

            if (response.data.success) {
                fetchTasks();
                resetForm();
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await taskAPI.updateTask(editingTask._id, {
                title,
                description,
                priority,
                dueDate: dueDate || undefined,
                status: editingTask.status,
            });

            if (response.data.success) {
                fetchTasks();
                resetForm();
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setShowCreateModal(true);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
    };

    const getTaskStats = () => {
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            completed: tasks.filter(t => t.status === 'completed').length,
        };
    };

    const stats = getTaskStats();

    const renderTaskDashboard = () => (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Tasks</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-3xl text-gray-600">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>In Progress</CardDescription>
                        <CardTitle className="text-3xl text-yellow-600">{stats.inProgress}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Completed</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                            <Button onClick={() => setShowCreateModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Task
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Task Form */}
            {(showCreateModal || editingTask) && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-slate-900 border-white/10 text-slate-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full border border-white/10 rounded-md px-3 py-2 text-sm bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-white/10 rounded-md px-3 py-2 text-sm min-h-[100px] bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-slate-200"
                                />
                            </div>
                            {editingTask && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={editingTask.status}
                                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                                        className="w-full border border-white/10 rounded-md px-3 py-2 text-sm bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button type="submit">{editingTask ? 'Update Task' : 'Create Task'}</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingTask(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteTask}
                        />
                    ))
                )}
            </div>
        </div>
    );

    return (
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'profile' ? <Profile /> : renderTaskDashboard()}
        </DashboardLayout>
    );
};

export default UserDashboard;
