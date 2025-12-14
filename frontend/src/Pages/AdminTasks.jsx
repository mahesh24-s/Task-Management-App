import { useState, useEffect } from 'react';
import { taskAPI, adminAPI } from '../utils/api';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    const fetchTasks = async () => {
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

    const handleEditTask = (task) => {
        // For simplicity, we'll just show an alert. In a full implementation,
        // you'd open a modal or navigate to an edit page
        alert('Edit functionality would open a modal or navigate to edit page');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Task Oversight</h1>
                    <p className="text-muted-foreground">View and manage all tasks across the organization</p>
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
                                    className="border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm"
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

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No tasks found</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                showAssignee={true}
                            />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminTasks;
