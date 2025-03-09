// EventCard.test.tsx
import { render, screen } from '@testing-library/react';
import EventCard from './EventCard';

describe('EventCard Component', () => {
  const mockProps = {
    title: 'Music Festival',
    image: 'https://via.placeholder.com/150',
    date: 'July 25, 2024',
    location: 'New York City',
    category: 'Concert',
  };

  test('renders the EventCard component', () => {
    render(<EventCard {...mockProps} />);
    expect(screen.getByTestId('event-card')).toBeInTheDocument();
  });

  test('displays the event title', () => {
    render(<EventCard {...mockProps} />);
    expect(screen.getByTestId('event-title')).toHaveTextContent(mockProps.title);
  });

  test('displays the event image', () => {
    render(<EventCard {...mockProps} />);
    const imageElement = screen.getByTestId('event-image');
    expect(imageElement).toHaveAttribute('src', mockProps.image);
    expect(imageElement).toHaveAttribute('alt', mockProps.title);
  });

  test('displays the event category', () => {
    render(<EventCard {...mockProps} />);
    expect(screen.getByTestId('event-category')).toHaveTextContent(mockProps.category);
  });

  test('displays the event date', () => {
    render(<EventCard {...mockProps} />);
    expect(screen.getByTestId('event-date')).toHaveTextContent(mockProps.date);
  });

  test('displays the event location', () => {
    render(<EventCard {...mockProps} />);
    expect(screen.getByTestId('event-location')).toHaveTextContent(mockProps.location);
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<EventCard {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
