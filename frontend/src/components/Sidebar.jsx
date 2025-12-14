import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { LayoutDashboard, Users, UserCircle, CheckSquare, LogOut } from 'lucide-react';
import { Button } from './ui/button';

const Sidebar = ({ activeTab, onTabChange }) => {
    const { user, logout, isAdmin } = useAuth();

    const menuItems = isAdmin() ? [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'tasks', label: 'All Tasks', icon: CheckSquare },
        { id: 'profile', label: 'Profile', icon: UserCircle },
    ] : [
        { id: 'tasks', label: 'My Tasks', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: UserCircle },
    ];

    return (
        <div className="h-screen w-64 bg-card border-r flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b">
                <Link to="/">
                    <h2 className="text-2xl font-bold text-primary cursor-pointer">TaskiFy</h2>
                </Link>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{user?.role} Dashboard</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                            activeTab === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive text-green-300 hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
