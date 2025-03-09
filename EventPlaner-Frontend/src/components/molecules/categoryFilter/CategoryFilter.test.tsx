// CategoryFilter.test.tsx
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter Component', () => {
  const categories = [
    'All Services',
    'Photography',
    'Catering',
    'Music & Entertainment',
    'Venue',
    'Decoration',
    'Planning',
  ];

  const WrapperComponent = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Services');
    return (
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    );
  };

  test('renders all category buttons', () => {
    render(<WrapperComponent />);
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('applies selected style to the active category', () => {
    render(<WrapperComponent />);
    const activeButton = screen.getByText('All Services');
    expect(activeButton).toHaveClass('bg-primary text-white shadow-md');
  });

  test('changes selected category on button click', () => {
    render(<WrapperComponent />);
    const cateringButton = screen.getByText('Catering');
    fireEvent.click(cateringButton);
    expect(cateringButton).toHaveClass('bg-primary text-white shadow-md');
  });

  test('applies hover style on button', () => {
    render(<WrapperComponent />);
    const musicButton = screen.getByText('Music & Entertainment');
    fireEvent.mouseOver(musicButton);
    expect(musicButton).toHaveClass('hover:bg-primary/10 hover:text-primary');
  });
});
