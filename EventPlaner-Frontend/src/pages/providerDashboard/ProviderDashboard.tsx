// pages/providerDashboard/ProviderDashboard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/provider/dashboard/my-services');
  }, [navigate]);

  return null;
};

export default ProviderDashboard;