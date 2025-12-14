import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Layout as LayoutIcon, Users, Check, Search, Bell, Plus, MoreHorizontal, LayoutDashboard } from 'lucide-react';

const HomePage = () => {
  const { user, isAdmin } = useAuth();
  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex text-4xl items-center justify-center text-white font-bold">T</div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">TaskiFy</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solution" className="hover:text-primary transition-colors">Solution</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-primary transition-colors">FAQs</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to={isAdmin() ? '/admin' : '/dashboard'}>
                <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200 gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-primary hidden sm:block">Log in</Link>
                <Link to="/signup">
                  <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">Ranked #1</span>
            <span className="text-xs text-slate-300">Productivity App on Product Hunt</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-tight">
            Empower your team to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">work smarter.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Whether you're just starting out or growing fast, TaskiFy helps your team stay clear, connected, and focused on what matters most.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all hover:scale-105">
                Get Started - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Visual Decoration / Mockup */}
        <div className="max-w-6xl mx-auto relative perspective-1000">
          {/* Main Dashboard Mockup */}
          <div className="glass-card p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-1000 delay-200">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 h-8 w-64 bg-white/5 rounded-full flex items-center px-4">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">JD</div>
              </div>
            </div>

            {/* Mock Content */}
            <div className="flex gap-6">
              {/* Mock Sidebar */}
              <div className="hidden md:flex flex-col gap-4 w-16 items-center pt-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><LayoutIcon className="h-5 w-5" /></div>
                <div className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400"><Users className="h-5 w-5" /></div>
                <div className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400"><Bell className="h-5 w-5" /></div>
              </div>

              {/* Mock Board */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-slate-200 text-sm">To Do</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">3</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-xl shadow-sm border border-white/5">
                      <div className="w-12 h-1.5 bg-red-400 rounded-full mb-2"></div>
                      <div className="h-3 w-3/4 bg-slate-700 rounded mb-2"></div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-slate-800"></div>
                          <div className="w-6 h-6 rounded-full bg-purple-400 border-2 border-slate-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                      <div className="w-16 h-1.5 bg-blue-400 rounded-full mb-2"></div>
                      <div className="h-3 w-4/5 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-white/5 rounded-2xl p-4 hidden sm:block">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-slate-200 text-sm">In Progress</span>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 ring-2 ring-emerald-500/20">
                      <div className="w-12 h-1.5 bg-orange-200 rounded-full mb-2"></div>
                      <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="h-32 bg-emerald-500/5 rounded-lg flex items-center justify-center border border-dashed border-emerald-500/30 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-emerald-400 border-r-[4px] border-r-transparent ml-0.5"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-400 gap-1">
                          <Bell className="h-3 w-3" /> Sep 24
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-white/5 rounded-2xl p-4 hidden md:block">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-slate-200 text-sm">Review</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">1</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl shadow-sm border border-white/5 opacity-60">
                    <div className="w-20 h-1.5 bg-purple-400 rounded-full mb-2"></div>
                    <div className="h-3 w-2/3 bg-slate-700 rounded"></div>
                  </div>
                  <div className="mt-3 border-2 border-dashed border-slate-700 rounded-xl p-3 flex items-center justify-center text-slate-400 text-xs font-medium cursor-pointer hover:bg-white/5 hover:border-emerald-500/50 transition-colors">
                    <Plus className="h-4 w-4 mr-1" /> Add Card
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Overlay Card - to add depth */}
            <div className="absolute -right-4 md:-right-12 bottom-8 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl w-64 border border-white/20 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 hidden lg:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">EC</div>
                <div>
                  <div className="text-sm font-bold text-white">Emily Carter</div>
                  <div className="text-xs text-slate-400">Project Manager</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 bg-white/5 p-2 rounded-lg italic">
                "TaskiFy's analytics dashboard gives us insights we never had before."
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by innovative teams around the world</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold font-sans text-slate-300"><div className="w-6 h-6 bg-slate-300 rounded-sm"></div> Acme Corp</div>
            <div className="flex items-center gap-2 text-xl font-bold font-serif text-slate-300"><div className="w-6 h-6 bg-slate-300 rounded-full"></div> GlobalTech</div>
            <div className="flex items-center gap-2 text-xl font-bold font-mono text-slate-300"><div className="w-6 h-6 bg-slate-300 rotate-45"></div> NiteLite</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><div className="w-6 h-6 border-2 border-slate-300 rounded-sm"></div> CircleLines</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-10 flex flex-col items-start hover:shadow-2xl transition-all duration-300 group border border-white/10">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Stay On Track</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Plan projects, set deadlines, and monitor progress in real-time. Never miss a beat with our intuitive tracking system specific for agile teams.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-10 flex flex-col items-start hover:shadow-2xl transition-all duration-300 group border border-white/10">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Work Smarter</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Automate repetitive tasks and focus on what matters. Our smart workflows handle the busywork so you can focus on innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-600 rounded-md"></div>
            <span className="font-bold text-slate-200">TaskiFy</span>
          </div>
          <div className="text-sm text-slate-500">
            © 2024 TaskiFy Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-slate-300">LinkedIn</a>
            <a href="#" className="text-slate-500 hover:text-slate-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
