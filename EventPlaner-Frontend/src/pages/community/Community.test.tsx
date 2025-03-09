
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Community } from './Community';
import CommunityPost from '../../components/templates/communityPost/CommunityPost';

// Mock del componente CommunityPost
jest.mock('../../components/templates/communityPost/CommunityPost', () => {
  return jest.fn(props => (
    <div data-testid={props['data-testid'] || 'mocked-community-post'}>
      <div>Author: {props.author}</div>
      <div>Content: {props.content}</div>
      <div>Likes: {props.likes}</div>
      <div>Comments: {props.comments}</div>
      <div>TimeAgo: {props.timeAgo}</div>
    </div>
  ));
});

describe('Community Component', () => {
  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  test('renders correctly with initial state', () => {
    render(<Community />);
    
    // Verificar contenedor principal
    expect(screen.getByTestId('community-container')).toBeInTheDocument();
    
    // Verificar contenedor de tabs
    expect(screen.getByTestId('tab-container')).toBeInTheDocument();
    
    // Verificar que 'trending' es el tab activo por defecto
    const trendingButton = screen.getByTestId('trending-tab-button');
    const latestButton = screen.getByTestId('latest-tab-button');
    expect(trendingButton).toHaveClass('bg-white/10');
    expect(latestButton).not.toHaveClass('bg-white/10');
    
    // Verificar contenedor de posts
    expect(screen.getByTestId('posts-container')).toBeInTheDocument();
    
    // Verificar trending topics
    expect(screen.getByTestId('trending-topics-container')).toBeInTheDocument();
    expect(screen.getByTestId('trending-topics-title')).toHaveTextContent('Trending Topics');
    expect(screen.getByTestId('trending-topic-1')).toBeInTheDocument();
    expect(screen.getByTestId('trending-topic-2')).toBeInTheDocument();
    expect(screen.getByTestId('trending-topic-3')).toBeInTheDocument();
  });

  test('changes tab when Latest is clicked', () => {
    render(<Community />);
    
    // Obtener los botones de tabs
    const trendingButton = screen.getByTestId('trending-tab-button');
    const latestButton = screen.getByTestId('latest-tab-button');
    
    // Verificar estado inicial
    expect(trendingButton).toHaveClass('bg-white/10');
    expect(latestButton).not.toHaveClass('bg-white/10');
    
    // Hacer clic en el tab Latest
    fireEvent.click(latestButton);
    
    // Verificar cambio de estado
    expect(trendingButton).not.toHaveClass('bg-white/10');
    expect(latestButton).toHaveClass('bg-white/10');
  });

  test('changes tab when Trending is clicked after Latest', () => {
    render(<Community />);
    
    // Obtener los botones de tabs
    const trendingButton = screen.getByTestId('trending-tab-button');
    const latestButton = screen.getByTestId('latest-tab-button');
    
    // Hacer clic en el tab Latest
    fireEvent.click(latestButton);
    
    // Verificar cambio de estado
    expect(latestButton).toHaveClass('bg-white/10');
    
    // Hacer clic en el tab Trending
    fireEvent.click(trendingButton);
    
    // Verificar que volvemos al estado inicial
    expect(trendingButton).toHaveClass('bg-white/10');
    expect(latestButton).not.toHaveClass('bg-white/10');
  });

  test('renders community posts correctly', () => {
    render(<Community />);
    
    // Verificar que el componente CommunityPost es llamado con las props correctas
    expect(CommunityPost).toHaveBeenCalledTimes(2);
    
    // Verificar la primera llamada a CommunityPost
    expect(CommunityPost).toHaveBeenNthCalledWith(1, expect.objectContaining({
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      content: "Just wrapped up an amazing wedding at the botanical gardens! Check out these stunning photos 📸",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      likes: 42,
      comments: 12,
      timeAgo: "2 hours ago",
      "data-testid": "community-post-1"
    }), {});
    
    // Verificar la segunda llamada a CommunityPost
    expect(CommunityPost).toHaveBeenNthCalledWith(2, expect.objectContaining({
      author: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      content: "Looking for recommendations on the best catering services in LA for a corporate event of 200 people. Any suggestions?",
      likes: 28,
      comments: 15,
      timeAgo: "5 hours ago",
      "data-testid": "community-post-2"
    }), {});
  });

  test('trending topics are clickable', () => {
    render(<Community />);
    
    // Obtener los trending topics
    const topic1 = screen.getByTestId('trending-topic-1');
    const topic2 = screen.getByTestId('trending-topic-2');
    const topic3 = screen.getByTestId('trending-topic-3');
    
    // Verificar que son clickables (tienen la clase cursor-pointer)
    expect(topic1).toHaveClass('cursor-pointer');
    expect(topic2).toHaveClass('cursor-pointer');
    expect(topic3).toHaveClass('cursor-pointer');
    
    // Verificar contenido de los topics
    expect(topic1).toHaveTextContent('#WeddingPlanning');
    expect(topic2).toHaveTextContent('#CorporateEvents');
    expect(topic3).toHaveTextContent('#VenueIdeas');
  });

  test('responsive design classes are applied correctly', () => {
    render(<Community />);
    
    // Verificar clases de diseño responsive
    const mainContainer = screen.getByTestId('community-container');
    expect(mainContainer).toHaveClass('space-y-8');
    
    const flexContainer = mainContainer.firstChild;
    expect(flexContainer).toHaveClass('flex', 'flex-col', 'md:flex-row', 'gap-4');
    
    const trendingTopicsContainer = screen.getByTestId('trending-topics-container');
    expect(trendingTopicsContainer).toHaveClass('w-full', 'md:w-80');
  });
});