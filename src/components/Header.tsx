import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bus, LogOut, User, History } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="gradient-header shadow-header sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-header-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Bus className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TRAVERSE</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 text-header-foreground/80 sm:flex">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium uppercase text-primary">
                    {user?.role}
                  </span>
                </div>
                <Link to="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-header-foreground hover:bg-header-foreground/10"
                  >
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden text-header-foreground hover:bg-header-foreground/10 sm:inline-flex"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-header-foreground hover:bg-header-foreground/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-foreground/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
