import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search, Trash2, Shield, User } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getAllUsers();
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (searchTerm) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Change user role to ${newRole}?`)) {
            try {
                await adminAPI.changeUserRole(userId, newRole);
                fetchUsers();
            } catch (error) {
                console.error('Error changing role:', error);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their tasks.')) {
            try {
                await adminAPI.deleteUser(userId);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
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
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage user accounts and permissions</p>
                </div>

                {/* Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Name</th>
                                        <th className="text-left py-3 px-4">Email</th>
                                        <th className="text-left py-3 px-4">Role</th>
                                        <th className="text-left py-3 px-4">Joined</th>
                                        <th className="text-right py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{user.name}</td>
                                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                                    {user.role === 'admin' ? (
                                                        <><Shield className="h-3 w-3 mr-1 inline" />Admin</>
                                                    ) : (
                                                        <><User className="h-3 w-3 mr-1 inline" />User</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleChangeRole(user._id, user.role)}
                                                    >
                                                        Change Role
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No users found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default AdminUsers;
