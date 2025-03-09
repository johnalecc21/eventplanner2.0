
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ServiceForm from './ServiceForm'; 
import '@testing-library/jest-dom';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ServiceForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const renderServiceForm = (service = null) => {
    return render(
      <ServiceForm service={service} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
  };

  test('renders the form with correct title for adding a new service', () => {
    renderServiceForm();
    expect(screen.getByTestId('form-title')).toHaveTextContent('Add New Service');
  });

  

  test('calls onClose when the close button is clicked', () => {
    renderServiceForm();
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('updates the name input when typing', () => {
    renderServiceForm();
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'New Service Name' } });
    expect(nameInput).toHaveValue('New Service Name');
  });

  test('updates the category select when a new option is selected', () => {
    renderServiceForm();
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Catering' } });
    expect(categorySelect).toHaveValue('Catering');
  });

  test('updates the description textarea when typing', () => {
    renderServiceForm();
    const descriptionTextarea = screen.getByTestId('description-textarea');
    fireEvent.change(descriptionTextarea, { target: { value: 'New Description' } });
    expect(descriptionTextarea).toHaveValue('New Description');
  });

  test('updates the price input when typing', () => {
    renderServiceForm();
    const priceInput = screen.getByTestId('price-input');
    fireEvent.change(priceInput, { target: { value: '200' } });
    expect(priceInput).toHaveValue(200);
  });

  test('updates the location input when typing', () => {
    renderServiceForm();
    const locationInput = screen.getByTestId('location-input');
    fireEvent.change(locationInput, { target: { value: 'New Location' } });
    expect(locationInput).toHaveValue('New Location');
  });

  test('adds a new image URL input when the add button is clicked', () => {
    renderServiceForm();
    const addImageUrlButton = screen.getByTestId('add-image-url-button');
    fireEvent.click(addImageUrlButton);
    expect(screen.getAllByTestId(/image-url-input-/)).toHaveLength(2); // Uno inicial + el nuevo
  });

  test('updates an image URL input when typing', () => {
    renderServiceForm();
    const imageUrlInput = screen.getByTestId('image-url-input-0');
    fireEvent.change(imageUrlInput, { target: { value: 'https://example.com/image.jpg' } });
    expect(imageUrlInput).toHaveValue('https://example.com/image.jpg');
  });

  test('calls onSubmit when the form is submitted', async () => {
    // Simula una respuesta exitosa de axios
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    renderServiceForm();

    // Completa los campos obligatorios del formulario
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Photography' } });
    fireEvent.change(screen.getByTestId('description-textarea'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Test Location' } });

    // Envía el formulario
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Espera a que se complete la llamada a axios y verifica que onSubmit se haya llamado
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });


});