import { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import CommunityPost from '../components/CommunityPost';

export const Community = () => {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1 space-y-6">
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'trending' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('trending')}
              >
                Trending
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'latest' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('latest')}
              >
                Latest
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <CommunityPost
              author="Sarah Johnson"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              content="Just wrapped up an amazing wedding at the botanical gardens! Check out these stunning photos 📸"
              image="https://images.unsplash.com/photo-1519225421980-715cb0215aed"
              likes={42}
              comments={12}
              timeAgo="2 hours ago"
            />
            <CommunityPost
              author="Mike Chen"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              content="Looking for recommendations on the best catering services in LA for a corporate event of 200 people. Any suggestions?"
              likes={28}
              comments={15}
              timeAgo="5 hours ago"
            />
          </div>
        </div>

        <div className="w-full md:w-80 glass-effect p-6 rounded-lg space-y-6">
          <h3 className="font-semibold">Trending Topics</h3>
          <div className="space-y-4">
            <div className="text-sm text-text-secondary hover:text-text cursor-pointer">
              #WeddingPlanning
            </div>
            <div className="text-sm text-text-secondary hover:text-text cursor-pointer">
              #CorporateEvents
            </div>
            <div className="text-sm text-text-secondary hover:text-text cursor-pointer">
              #VenueIdeas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
