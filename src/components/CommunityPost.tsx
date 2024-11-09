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
    <div className="glass-effect rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-text-secondary">{timeAgo}</p>
        </div>
      </div>

      <p className="text-text-secondary">{content}</p>

      {image && (
        <img
          src={image}
          alt="Post content"
          className="rounded-lg w-full h-64 object-cover"
        />
      )}

      <div className="flex items-center space-x-6 pt-4">
        <button className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors">
          <ThumbsUp className="h-5 w-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors">
          <MessageSquare className="h-5 w-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPost;