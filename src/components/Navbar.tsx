import { Link } from 'react-router-dom';
import { Calendar, Users, Store, PartyPopper } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-effect sticky top-0 z-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <PartyPopper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EventPlanner</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/marketplace" icon={<Store />} text="Marketplace" />
            <NavLink to="/events" icon={<Calendar />} text="Events" />
            <NavLink to="/community" icon={<Users />} text="Community" />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;