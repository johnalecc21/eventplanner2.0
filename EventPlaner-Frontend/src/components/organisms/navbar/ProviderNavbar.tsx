import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PartyPopper, Folder, ClipboardList } from 'lucide-react';

const ProviderNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ruta actual

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass-effect sticky top-10 z-50 py-4 w-[75%] mx-auto rounded-full shadow-xl backdrop-blur-lg bg-white/30" data-testid="provider-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/provider/dashboard/my-services" className="flex items-center space-x-2" data-testid="navbar-logo">
            <PartyPopper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EventPlanner</span>
          </Link>

          {/* Enlaces principales */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/provider/dashboard/my-services"
              icon={<Folder />}
              text="My Services"
              isActive={location.pathname === '/provider/dashboard/my-services'}
              data-testid="nav-my-services"
            />
            <NavLink
              to="/provider/dashboard/bookings"
              icon={<ClipboardList />}
              text="Bookings"
              isActive={location.pathname === '/provider/dashboard/bookings'}
              data-testid="nav-bookings"
            />
          </div>

          {/* Botón de logout */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              data-testid="logout-button"
            >
              Logout
            </button>
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
  isActive?: boolean; // Indica si el enlace está activo
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, isActive, ...rest }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
      isActive
        ? 'bg-primary text-white hover:bg-primary/90'
        : 'text-text-secondary hover:bg-primary/10'
    }`}
    {...rest}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default ProviderNavbar;
