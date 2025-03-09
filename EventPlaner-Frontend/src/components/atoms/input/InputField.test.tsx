// InputField.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';
import { Search } from 'lucide-react';

describe('InputField Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    type: 'text',
    label: 'Test Label',
    value: '',
    onChange: mockOnChange,
    icon: <Search data-testid="icon" />,
    placeholder: 'Enter text...',
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders label, input, and icon correctly', () => {
    render(<InputField {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('calls onChange function when input value changes', () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter text...');

    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('New Value');
  });

  test('renders input with correct type', () => {
    render(<InputField {...defaultProps} type="password" />);
    const input = screen.getByPlaceholderText('Enter text...');

    expect(input).toHaveAttribute('type', 'password');
  });

  test('displays the correct initial value', () => {
    render(<InputField {...defaultProps} value="Initial Value" />);
    const input = screen.getByDisplayValue('Initial Value');

    expect(input).toBeInTheDocument();
  });

  test('applies focus styles correctly', () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter text...');

    input.focus();
    expect(input).toHaveFocus();
  });
});
