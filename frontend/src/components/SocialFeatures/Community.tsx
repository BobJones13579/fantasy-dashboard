/**
 * Community Component
 * 
 * Displays community features including popular picks, recent activity,
 * bet sharing, and league discussions.
 * 
 * Features:
 * - Popular picks and trending bets
 * - Recent league activity feed
 * - Bet sharing and discussion
 * - League announcements and updates
 * - Member statistics and insights
 * - Community polls and voting
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  FireIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ThumbUpIcon,
  ShareIcon,
  BellIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/20/solid';

interface PopularPick {
  player: string;
  team: string;
  betType: string;
  confidence: number;
  betCount: number;
  odds: number;
  trend: 'up' | 'down' | 'stable';
}

interface ActivityItem {
  user: string;
  action: string;
  details: string;
  time: string;
  type: 'bet' | 'achievement' | 'competition' | 'announcement';
}

interface CommunityData {
  popularPicks: PopularPick[];
  recentActivity: ActivityItem[];
}

interface CommunityProps {
  data: CommunityData;
  leagueId: string;
}

export const Community: React.FC<CommunityProps> = ({ data, leagueId }) => {
  const [activeTab, setActiveTab] = useState<'picks' | 'activity' | 'announcements'>('picks');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <FireIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ChartBarIcon className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return <ChartBarIcon className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <TrophyIcon className="h-4 w-4 text-yellow-500" />;
      case 'competition':
        return <FireIcon className="h-4 w-4 text-orange-500" />;
      case 'announcement':
        return <BellIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderPopularPicks = () => (
    <div className="space-y-4">
      {data.popularPicks.map((pick, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-lg font-bold text-gray-600">#{index + 1}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{pick.player}</h3>
                <p className="text-sm text-gray-600">{pick.team} • {pick.betType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(pick.trend)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(pick.confidence)}`}>
                {pick.confidence}% confidence
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Bet Count</div>
              <div className="font-semibold text-gray-900">{pick.betCount} bets</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Odds</div>
              <div className="font-semibold text-gray-900">{pick.odds > 0 ? `+${pick.odds}` : pick.odds}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Trend</div>
              <div className="font-semibold text-gray-900 capitalize">{pick.trend}</div>
            </div>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Follow Pick
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecentActivity = () => (
    <div className="space-y-3">
      {data.recentActivity.map((activity, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{activity.user}</span>
                <span className="text-gray-600">{activity.action}</span>
                <span className="text-gray-900">{activity.details}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      {/* Mock announcements */}
      {[
        {
          id: 1,
          title: 'Weekly Competition Starting Soon',
          content: 'The Weekly High Roller competition begins tomorrow at 12:00 PM EST. Join now to compete for 500 tokens!',
          type: 'competition',
          date: '2 hours ago',
          priority: 'high'
        },
        {
          id: 2,
          title: 'New Achievement System Live',
          content: 'Check out the new achievement system! Unlock badges and earn rewards for your betting accomplishments.',
          type: 'feature',
          date: '1 day ago',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'League Rules Update',
          content: 'Updated betting rules and token distribution. Please review the changes in the league settings.',
          type: 'rules',
          date: '3 days ago',
          priority: 'low'
        }
      ].map((announcement) => (
        <div key={announcement.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {announcement.priority}
              </span>
            </div>
            <span className="text-sm text-gray-500">{announcement.date}</span>
          </div>
          <p className="text-gray-700 mb-3">{announcement.content}</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
              View Details
            </button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Community</h2>
          <p className="text-sm text-gray-600">Connect with your league members and stay updated</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'picks', name: 'Popular Picks', icon: FireIcon },
            { id: 'activity', name: 'Activity', icon: ChatBubbleLeftRightIcon },
            { id: 'announcements', name: 'Announcements', icon: BellIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium text-gray-900">Popular Picks</h4>
          </div>
          <div className="text-2xl font-bold text-orange-600">{data.popularPicks.length}</div>
          <div className="text-sm text-gray-600">trending bets</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UsersIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Active Members</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">league members</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium text-gray-900">Recent Activity</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">{data.recentActivity.length}</div>
          <div className="text-sm text-gray-600">activities today</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BellIcon className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium text-gray-900">Announcements</h4>
          </div>
          <div className="text-2xl font-bold text-purple-600">3</div>
          <div className="text-sm text-gray-600">unread</div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {activeTab === 'picks' && renderPopularPicks()}
          {activeTab === 'activity' && renderRecentActivity()}
          {activeTab === 'announcements' && renderAnnouncements()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ShareIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-700">Share Your Bet</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-700">Start Discussion</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BellIcon className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-gray-700">League Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
