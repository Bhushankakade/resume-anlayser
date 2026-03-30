import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-text hover:text-primary transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-muted hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2 text-text hover:text-primary transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
