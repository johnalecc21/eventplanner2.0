import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import {Community} from './pages/Community';
import Events from './pages/Events';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container  mx-auto px-4 py-8 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/community" element={<Community />} />
            <Route path="/events" element={<Events />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;