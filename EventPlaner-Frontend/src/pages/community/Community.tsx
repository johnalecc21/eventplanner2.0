import { useState } from 'react';
import CommunityPost from '../../components/templates/communityPost/CommunityPost';

export const Community = () => {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <div className="space-y-8" data-testid="community-container">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1 space-y-6">
          <div className="glass-effect p-4 rounded-lg" data-testid="tab-container">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'trending' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('trending')}
                data-testid="trending-tab-button"
              >
                Trending
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'latest' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('latest')}
                data-testid="latest-tab-button"
              >
                Latest
              </button>
            </div>
          </div>

          <div className="space-y-6" data-testid="posts-container">
            <CommunityPost
              author="Sarah Johnson"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              content="Just wrapped up an amazing wedding at the botanical gardens! Check out these stunning photos 📸"
              image="https://images.unsplash.com/photo-1519225421980-715cb0215aed"
              likes={42}
              comments={12}
              timeAgo="2 hours ago"
              data-testid="community-post-1"
            />
            <CommunityPost
              author="Mike Chen"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              content="Looking for recommendations on the best catering services in LA for a corporate event of 200 people. Any suggestions?"
              likes={28}
              comments={15}
              timeAgo="5 hours ago"
              data-testid="community-post-2"
            />
          </div>
        </div>

        <div className="w-full md:w-80 glass-effect p-6 rounded-lg space-y-6" data-testid="trending-topics-container">
          <h3 className="font-semibold" data-testid="trending-topics-title">
            Trending Topics
          </h3>
          <div className="space-y-4" data-testid="trending-topics-list">
            <div
              className="text-sm text-text-secondary hover:text-text cursor-pointer"
              data-testid="trending-topic-1"
            >
              #WeddingPlanning
            </div>
            <div
              className="text-sm text-text-secondary hover:text-text cursor-pointer"
              data-testid="trending-topic-2"
            >
              #CorporateEvents
            </div>
            <div
              className="text-sm text-text-secondary hover:text-text cursor-pointer"
              data-testid="trending-topic-3"
            >
              #VenueIdeas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};