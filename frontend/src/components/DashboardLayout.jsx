import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="min-h-screen">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <main className="pl-64 min-h-screen transition-all duration-300">
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
