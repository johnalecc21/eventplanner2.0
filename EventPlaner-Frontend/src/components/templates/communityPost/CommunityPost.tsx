import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

interface CommunityPostProps {
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const CommunityPost = ({
  author,
  avatar,
  content,
  image,
  likes,
  comments,
  timeAgo,
}: CommunityPostProps) => {
  return (
    <div className="glass-effect rounded-lg p-6 space-y-4" data-testid="community-post">
      <div className="flex items-center space-x-3" data-testid="post-header">
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
          data-testid="post-avatar"
        />
        <div>
          <h4 className="font-medium" data-testid="post-author">{author}</h4>
          <p className="text-sm text-text-secondary" data-testid="post-time">{timeAgo}</p>
        </div>
      </div>

      <p className="text-text-secondary" data-testid="post-content">{content}</p>

      {image && (
        <img
          src={image}
          alt="Post content"
          className="rounded-lg w-full h-64 object-cover"
          data-testid="post-image"
        />
      )}

      <div className="flex items-center space-x-6 pt-4" data-testid="post-actions">
        <button
          className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors"
          data-testid="like-button"
        >
          <ThumbsUp className="h-5 w-5" />
          <span data-testid="like-count">{likes}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors"
          data-testid="comment-button"
        >
          <MessageSquare className="h-5 w-5" />
          <span data-testid="comment-count">{comments}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors"
          data-testid="share-button"
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPost;
