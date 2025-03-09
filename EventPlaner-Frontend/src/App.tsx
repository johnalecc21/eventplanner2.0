// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import ProviderLayout from './components/layouts/ProviderLayout';
import Home from './pages/home/Home';
import Marketplace from './pages/marketplace/Marketplace';
import ServiceDetails from './pages/serviceDetails/ServiceDetails';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {Community} from './pages/community/Community';
import Events from './pages/events/Events';
import ProviderDashboard from './pages/providerDashboard/ProviderDashboard';
import MyServices from './pages/providerDashboard/MyServices';
import Bookings from './pages/providerDashboard/Bookings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas que requieren Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<Events />} />
        </Route>

        {/* Rutas que requieren ProviderNavbar */}
        <Route element={<ProviderLayout />}>
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/dashboard/my-services" element={<MyServices />} />
          <Route path="/provider/dashboard/bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;