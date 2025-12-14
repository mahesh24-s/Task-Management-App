import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { CheckSquare, LogOut, LayoutDashboard, Users } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <CheckSquare className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">TaskiFy</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to={isAdmin() ? '/admin' : '/dashboard'}>
                                    <Button variant="ghost" size="sm">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin/users">
                                        <Button variant="ghost" size="sm">
                                            <Users className="h-4 w-4 mr-2" />
                                            Users
                                        </Button>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">{user.name}</span>
                                    <Button variant="outline" size="sm" onClick={logout} className="text-red-400 border-red-500/50 hover:bg-red-500/10 hover:text-red-300">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
