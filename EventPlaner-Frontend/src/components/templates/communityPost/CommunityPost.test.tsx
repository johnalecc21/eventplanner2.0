// src/components/templates/communityPost/CommunityPost.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommunityPost from './CommunityPost';

// Mockear lucide-react
jest.mock('lucide-react', () => ({
  MessageSquare: () => <svg data-testid="message-square-icon" />,
  ThumbsUp: () => <svg data-testid="thumbs-up-icon" />,
  Share2: () => <svg data-testid="share2-icon" />,
}));

describe('CommunityPost Component', () => {
  const defaultProps = {
    author: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    content: 'This is a sample post content.',
    image: 'https://example.com/post-image.jpg',
    likes: 10,
    comments: 5,
    timeAgo: '2 hours ago',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the community post with all elements', () => {
    render(<CommunityPost {...defaultProps} />);

    // Verificar el encabezado del post
    expect(screen.getByTestId('post-header')).toBeInTheDocument();
    expect(screen.getByTestId('post-avatar')).toHaveAttribute('src', defaultProps.avatar);
    expect(screen.getByTestId('post-avatar')).toHaveAttribute('alt', defaultProps.author);
    expect(screen.getByTestId('post-author')).toHaveTextContent(defaultProps.author);
    expect(screen.getByTestId('post-time')).toHaveTextContent(defaultProps.timeAgo);

    // Verificar el contenido del post
    expect(screen.getByTestId('post-content')).toHaveTextContent(defaultProps.content);

    // Verificar la imagen del post
    expect(screen.getByTestId('post-image')).toHaveAttribute('src', defaultProps.image);
    expect(screen.getByTestId('post-image')).toHaveAttribute('alt', 'Post content');

    // Verificar las acciones del post
    expect(screen.getByTestId('post-actions')).toBeInTheDocument();
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
    expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument();
    expect(screen.getByTestId('like-count')).toHaveTextContent(String(defaultProps.likes));

    expect(screen.getByTestId('comment-button')).toBeInTheDocument();
    expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
    expect(screen.getByTestId('comment-count')).toHaveTextContent(String(defaultProps.comments));

    expect(screen.getByTestId('share-button')).toBeInTheDocument();
    expect(screen.getByTestId('share2-icon')).toBeInTheDocument();
    expect(screen.getByText(/Share/i)).toBeInTheDocument();
  });

  it('renders the community post without image', () => {
    const propsWithoutImage = {
      ...defaultProps,
      image: undefined,
    };

    render(<CommunityPost {...propsWithoutImage} />);

    // Verificar que no se renderice la imagen
    expect(screen.queryByTestId('post-image')).toBeNull();
  });

  it('renders the community post with zero likes and comments', () => {
    const propsWithZeroLikesComments = {
      ...defaultProps,
      likes: 0,
      comments: 0,
    };

    render(<CommunityPost {...propsWithZeroLikesComments} />);

    // Verificar que los conteos de likes y comentarios sean cero
    expect(screen.getByTestId('like-count')).toHaveTextContent('0');
    expect(screen.getByTestId('comment-count')).toHaveTextContent('0');
  });
});