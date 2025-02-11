// components/organisms/navbar/ProviderNavbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Store, PartyPopper, Folder, ClipboardList } from 'lucide-react';

const ProviderNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  return (
    <nav className="glass-effect sticky top-10 z-50 py-4 w-[75%] mx-auto rounded-full shadow-xl backdrop-blur-lg bg-white/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/provider/dashboard/my-services" className="flex items-center space-x-2">
            <PartyPopper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EventPlanner</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/provider/dashboard/my-services" icon={<Folder />} text="My Services" />
            <NavLink to="/provider/dashboard/bookings" icon={<ClipboardList />} text="Bookings" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            >
              Logout
            </button>
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

export default ProviderNavbar;