/**
 * Leaderboards Component
 * 
 * Displays weekly and season-long leaderboards with rankings,
 * token balances, and performance metrics.
 * 
 * Features:
 * - Weekly leaderboards with current week performance
 * - Season-long leaderboards with cumulative performance
 * - User rankings and position changes
 * - Token balance tracking
 * - Performance metrics and statistics
 * - Real-time updates via WebSocket
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  ChartBarIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/20/solid';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  tokens: number;
  change: string;
  weeklyWins?: number;
  weeklyLosses?: number;
  seasonWins?: number;
  seasonLosses?: number;
  winRate?: number;
  streak?: number;
}

interface LeaderboardsData {
  weekly: LeaderboardEntry[];
  season: LeaderboardEntry[];
}

interface LeaderboardsProps {
  data: LeaderboardsData;
  currentWeek: number;
  userId: string;
}

export const Leaderboards: React.FC<LeaderboardsProps> = ({ data, currentWeek, userId }) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'season'>('weekly');

  const formatChange = (change: string) => {
    const value = parseInt(change.replace('+', '').replace('-', ''));
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    
    if (isPositive) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpIcon className="h-4 w-4 mr-1" />
          <span>+{value}</span>
        </div>
      );
    } else if (isNegative) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownIcon className="h-4 w-4 mr-1" />
          <span>-{value}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <MinusIcon className="h-4 w-4 mr-1" />
          <span>0</span>
        </div>
      );
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="h-5 w-5 text-gray-400" />;
      case 3:
        return <TrophyIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 3) {
      return <FireIcon className="h-4 w-4 text-orange-500" />;
    }
    return null;
  };

  const renderLeaderboard = (entries: LeaderboardEntry[], isWeekly: boolean) => (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.user_id}
          className={`flex items-center p-4 rounded-lg border transition-colors ${
            entry.user_id === userId
              ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          {/* Rank */}
          <div className="flex-shrink-0 w-12 flex items-center justify-center">
            {getRankIcon(entry.rank)}
          </div>

          {/* User Info */}
          <div className="flex-1 ml-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{entry.username}</h3>
              {entry.user_id === userId && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  You
                </span>
              )}
              {entry.streak && entry.streak >= 3 && (
                <div className="flex items-center space-x-1">
                  {getStreakIcon(entry.streak)}
                  <span className="text-sm text-orange-600 font-medium">{entry.streak} streak</span>
                </div>
              )}
            </div>
            
            {/* Performance Stats */}
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              {isWeekly ? (
                <>
                  <span>{entry.weeklyWins || 0}W - {entry.weeklyLosses || 0}L</span>
                  <span>Win Rate: {entry.winRate || 0}%</span>
                </>
              ) : (
                <>
                  <span>{entry.seasonWins || 0}W - {entry.seasonLosses || 0}L</span>
                  <span>Win Rate: {entry.winRate || 0}%</span>
                </>
              )}
            </div>
          </div>

          {/* Tokens and Change */}
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {entry.tokens.toLocaleString()} tokens
            </div>
            <div className="text-sm">
              {formatChange(entry.change)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getCurrentUserRank = (entries: LeaderboardEntry[]) => {
    const userEntry = entries.find(entry => entry.user_id === userId);
    return userEntry ? userEntry.rank : null;
  };

  const getCurrentUserStats = (entries: LeaderboardEntry[]) => {
    const userEntry = entries.find(entry => entry.user_id === userId);
    return userEntry || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Leaderboards</h2>
          <p className="text-sm text-gray-600">See how you stack up against your league members</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week {currentWeek}
          </button>
          <button
            onClick={() => setActiveTab('season')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'season'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Season
          </button>
        </div>
      </div>

      {/* User Stats Summary */}
      {(() => {
        const currentStats = getCurrentUserStats(data[activeTab]);
        const userRank = getCurrentUserRank(data[activeTab]);
        
        if (currentStats) {
          return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(userRank!)}
                      <span className="font-medium text-gray-700">Rank #{userRank}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-700">{currentStats.tokens.toLocaleString()} tokens</span>
                    </div>
                    {currentStats.streak && currentStats.streak >= 3 && (
                      <div className="flex items-center space-x-2">
                        {getStreakIcon(currentStats.streak)}
                        <span className="font-medium text-gray-700">{currentStats.streak} win streak</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">This {activeTab === 'weekly' ? 'Week' : 'Season'}</div>
                  <div className="text-lg font-bold text-gray-900">{formatChange(currentStats.change)}</div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Leaderboard */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === 'weekly' ? `Week ${currentWeek} Rankings` : 'Season Rankings'}
          </h3>
        </div>
        
        <div className="p-6">
          {data[activeTab] && data[activeTab].length > 0 ? (
            renderLeaderboard(data[activeTab], activeTab === 'weekly')
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No {activeTab} data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Top Performer</h4>
          </div>
          <p className="text-sm text-gray-600">
            {data[activeTab] && data[activeTab][0] ? (
              <>
                <span className="font-medium">{data[activeTab][0].username}</span> leads with{' '}
                <span className="font-medium">{data[activeTab][0].tokens.toLocaleString()} tokens</span>
              </>
            ) : (
              'No data available'
            )}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium text-gray-900">Hot Streak</h4>
          </div>
          <p className="text-sm text-gray-600">
            {(() => {
              const hotStreakUser = data[activeTab]?.find(user => user.streak && user.streak >= 3);
              return hotStreakUser ? (
                <>
                  <span className="font-medium">{hotStreakUser.username}</span> is on a{' '}
                  <span className="font-medium">{hotStreakUser.streak} win streak</span>
                </>
              ) : (
                'No active streaks'
              );
            })()}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">League Average</h4>
          </div>
          <p className="text-sm text-gray-600">
            {data[activeTab] && data[activeTab].length > 0 ? (
              <>
                <span className="font-medium">
                  {Math.round(data[activeTab].reduce((sum, user) => sum + user.tokens, 0) / data[activeTab].length).toLocaleString()} tokens
                </span>{' '}
                average {activeTab === 'weekly' ? 'this week' : 'this season'}
              </>
            ) : (
              'No data available'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
