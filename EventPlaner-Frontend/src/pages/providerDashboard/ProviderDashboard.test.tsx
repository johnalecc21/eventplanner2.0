// ProviderDashboard.test.tsx
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ProviderDashboard from './ProviderDashboard';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('ProviderDashboard', () => {
  let mockNavigate: jest.Mock<any, any, any>;

  beforeEach(() => {
    // Limpiamos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Creamos un mock para la función navigate
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('debe renderizar sin errores', () => {
    const { container } = render(<ProviderDashboard />);
    expect(container).toBeTruthy();
  });

  it('debe navegar a /provider/dashboard/my-services al montarse', () => {
    render(<ProviderDashboard />);
    
    // Verificamos que navigate fue llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/provider/dashboard/my-services');
  });

  it('debe devolver null como contenido renderizado', () => {
    const { container } = render(<ProviderDashboard />);
    expect(container.firstChild).toBeNull();
  });

  it('debe llamar a useNavigate durante el render', () => {
    render(<ProviderDashboard />);
    expect(useNavigate).toHaveBeenCalled();
  });
});