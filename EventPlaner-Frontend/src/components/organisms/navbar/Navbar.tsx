import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Store, PartyPopper } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMyEventsClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav
      className="glass-effect sticky top-10 z-50 py-4 w-[75%] mx-auto rounded-full shadow-xl backdrop-blur-lg bg-white/30"
      data-testid="navbar"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <PartyPopper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EventPlanner</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/marketplace"
              icon={<Store />}
              text="Marketplace"
              isActive={location.pathname === '/marketplace'}
              data-testid="link-marketplace"
            />
            <NavLink
              to="/events"
              icon={<Calendar />}
              text="My Events"
              onClick={handleMyEventsClick}
              isActive={location.pathname === '/events'}
              data-testid="link-my-events"
            />
            <NavLink
              to="/community"
              icon={<Users />}
              text="Community"
              isActive={location.pathname === '/community'}
              data-testid="link-community"
            />
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-primary bg-gray-50 hover:bg-primary/10 transition-all duration-300 ease-in-out"
                  data-testid="button-login"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/80 hover:shadow-lg transition-all duration-300 ease-in-out"
                  data-testid="button-register"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                data-testid="button-logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, onClick, isActive, ...rest }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
      isActive
        ? 'bg-primary text-white hover:bg-primary/90'
        : 'text-text hover:bg-primary/10'
    }`}
    {...rest}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
