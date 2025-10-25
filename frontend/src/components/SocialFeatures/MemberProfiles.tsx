/**
 * MemberProfiles Component
 * 
 * Displays league member profiles with statistics, achievements,
 * and performance metrics for social interaction and competition.
 * 
 * Features:
 * - Member profile cards with key statistics
 * - Performance metrics and betting history
 * - Achievement displays and badges
 * - Member comparison and rankings
 * - Profile customization and avatars
 * - Social interaction features
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  UserIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon
} from '@heroicons/react/20/solid';

interface MemberProfile {
  id: string;
  username: string;
  avatar?: string;
  title?: string;
  badges: string[];
  stats: {
    totalBets: number;
    winRate: number;
    totalTokens: number;
    weeklyChange: number;
    seasonChange: number;
    streak: number;
    achievements: number;
    rank: number;
  };
  recentActivity: string[];
  favoriteBets: string[];
  joinDate: string;
  lastActive: string;
}

interface MemberProfilesProps {
  leagueId: string;
  userId: string;
}

export const MemberProfiles: React.FC<MemberProfilesProps> = ({ leagueId, userId }) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rank' | 'tokens' | 'winRate' | 'name'>('rank');

  // Mock member data
  const mockMembers: MemberProfile[] = [
    {
      id: 'user-1',
      username: 'FantasyKing',
      title: 'League Champion',
      badges: ['🏆', '🔥', '⭐'],
      stats: {
        totalBets: 156,
        winRate: 68,
        totalTokens: 1250,
        weeklyChange: 150,
        seasonChange: 1200,
        streak: 5,
        achievements: 12,
        rank: 1
      },
      recentActivity: ['Won Josh Allen Over bet', 'Achieved Big Winner badge', 'Joined Weekly Competition'],
      favoriteBets: ['Player Props', 'Fantasy Points', 'Team Totals'],
      joinDate: '2023-08-01',
      lastActive: '2 minutes ago'
    },
    {
      id: 'user-2',
      username: 'BetMaster',
      title: 'Risk Taker',
      badges: ['🎯', '💎'],
      stats: {
        totalBets: 142,
        winRate: 62,
        totalTokens: 1180,
        weeklyChange: 120,
        seasonChange: 1100,
        streak: 3,
        achievements: 9,
        rank: 2
      },
      recentActivity: ['Placed McCaffrey Over bet', 'Won Custom Matchup', 'Shared betting strategy'],
      favoriteBets: ['Custom Matchups', 'Player Props', 'Advanced Markets'],
      joinDate: '2023-08-15',
      lastActive: '5 minutes ago'
    },
    {
      id: userId,
      username: 'You',
      title: 'Rising Star',
      badges: ['🌟', '📈'],
      stats: {
        totalBets: 98,
        winRate: 58,
        totalTokens: 1100,
        weeklyChange: 80,
        seasonChange: 800,
        streak: 2,
        achievements: 6,
        rank: 4
      },
      recentActivity: ['Placed first FAAB bet', 'Achieved First Bet badge', 'Joined league chat'],
      favoriteBets: ['Fantasy Markets', 'Player Props', 'Team vs Team'],
      joinDate: '2023-09-01',
      lastActive: '1 minute ago'
    },
    {
      id: 'user-3',
      username: 'OddsHunter',
      title: 'Analytics Expert',
      badges: ['📊', '🔍'],
      stats: {
        totalBets: 134,
        winRate: 65,
        totalTokens: 1150,
        weeklyChange: 100,
        seasonChange: 950,
        streak: 4,
        achievements: 11,
        rank: 3
      },
      recentActivity: ['Analyzed market trends', 'Won Fantasy Points bet', 'Helped new member'],
      favoriteBets: ['Fantasy Points', 'Player Props', 'Market Analysis'],
      joinDate: '2023-08-20',
      lastActive: '10 minutes ago'
    }
  ];

  const sortedMembers = [...mockMembers].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return a.stats.rank - b.stats.rank;
      case 'tokens':
        return b.stats.totalTokens - a.stats.totalTokens;
      case 'winRate':
        return b.stats.winRate - a.stats.winRate;
      case 'name':
        return a.username.localeCompare(b.username);
      default:
        return 0;
    }
  });

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <span>{isPositive ? '+' : ''}{change}</span>
      </span>
    );
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <StarIcon className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="h-5 w-5 text-gray-400" />;
      case 3:
        return <TrophyIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 65) return 'text-green-600 bg-green-100';
    if (winRate >= 55) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderMemberCard = (member: MemberProfile) => (
    <div
      key={member.id}
      className={`bg-white rounded-lg border p-6 hover:shadow-md transition-all cursor-pointer ${
        selectedMember === member.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'
      } ${member.id === userId ? 'bg-blue-50' : ''}`}
      onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {member.avatar || member.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{member.username}</h3>
              {member.id === userId && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
            {member.title && (
              <p className="text-sm text-gray-600">{member.title}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRankIcon(member.stats.rank)}
          <div className="text-right">
            <div className="text-sm text-gray-600">Rank</div>
            <div className="font-bold text-gray-900">#{member.stats.rank}</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center space-x-2 mb-4">
        {member.badges.map((badge, index) => (
          <span key={index} className="text-2xl">{badge}</span>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Tokens</div>
          <div className="text-lg font-bold text-gray-900">{member.stats.totalTokens.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            Weekly: {formatChange(member.stats.weeklyChange)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Win Rate</div>
          <div className={`text-lg font-bold px-2 py-1 rounded-full ${getWinRateColor(member.stats.winRate)}`}>
            {member.stats.winRate}%
          </div>
          <div className="text-xs text-gray-500">{member.stats.totalBets} bets</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Streak</div>
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center space-x-1">
            <FireIcon className="h-4 w-4 text-orange-500" />
            <span>{member.stats.streak}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Achievements</div>
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span>{member.stats.achievements}</span>
          </div>
        </div>
      </div>

      {/* Favorite Bets */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Favorite Bet Types</div>
        <div className="flex flex-wrap gap-2">
          {member.favoriteBets.map((bet, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {bet}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="text-sm text-gray-600">
        <div className="mb-2">Recent Activity</div>
        <div className="space-y-1">
          {member.recentActivity.slice(0, 2).map((activity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              <span className="text-xs">{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Active */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <ClockIcon className="h-3 w-3" />
          <span>Active {member.lastActive}</span>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">League Members</h2>
          <p className="text-sm text-gray-600">Connect with your league members and track performance</p>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="rank">Rank</option>
            <option value="tokens">Tokens</option>
            <option value="winRate">Win Rate</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* League Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UserIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Total Members</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">{mockMembers.length}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">League Leader</h4>
          </div>
          <div className="text-lg font-bold text-yellow-600">
            {mockMembers.find(m => m.stats.rank === 1)?.username}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium text-gray-900">Avg Win Rate</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(mockMembers.reduce((sum, m) => sum + m.stats.winRate, 0) / mockMembers.length)}%
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium text-gray-900">Total Achievements</h4>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {mockMembers.reduce((sum, m) => sum + m.stats.achievements, 0)}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedMembers.map(renderMemberCard)}
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Profile: {mockMembers.find(m => m.id === selectedMember)?.username}
          </h3>
          <div className="text-gray-600">
            <p>This would show detailed member statistics, betting history, and performance analytics.</p>
            <p className="mt-2">Features to implement: detailed charts, betting history, achievement timeline, and comparison tools.</p>
          </div>
        </div>
      )}
    </div>
  );
};
