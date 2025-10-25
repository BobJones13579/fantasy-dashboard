/**
 * SocialFeatures Component
 * 
 * Main social features interface including leaderboards, competitions,
 * achievements, and community features for the Fantasy Football Companion App.
 * 
 * Features:
 * - Weekly and season-long leaderboards
 * - Competition system with rankings
 * - Achievement system with badges
 * - League member profiles
 * - Popular picks and community insights
 * - Bet sharing and discussion
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon,
  UsersIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  FireIcon,
  GiftIcon
} from '@heroicons/react/20/solid';
import { Leaderboards } from './Leaderboards';
import { Competitions } from './Competitions';
import { Achievements } from './Achievements';
import { Community } from './Community';
import { MemberProfiles } from './MemberProfiles';

interface SocialFeaturesProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  seasonYear: number;
  isConnected: boolean;
}

interface TabOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
}

export const SocialFeatures: React.FC<SocialFeaturesProps> = ({
  leagueId,
  userId,
  currentWeek,
  seasonYear,
  isConnected
}) => {
  const [activeTab, setActiveTab] = useState<string>('leaderboards');
  const [socialData, setSocialData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const tabs: TabOption[] = [
    { id: 'leaderboards', name: 'Leaderboards', icon: TrophyIcon },
    { id: 'competitions', name: 'Competitions', icon: StarIcon },
    { id: 'achievements', name: 'Achievements', icon: TrophyIcon, count: 3 },
    { id: 'community', name: 'Community', icon: ChatBubbleLeftRightIcon },
    { id: 'profiles', name: 'Members', icon: UsersIcon }
  ];

  useEffect(() => {
    const fetchSocialData = async () => {
      setLoading(true);
      try {
        // Mock social data - in production, this would come from API
        const mockData = {
          leaderboards: {
            weekly: [
              { rank: 1, user_id: 'user-1', username: 'FantasyKing', tokens: 1250, change: '+150' },
              { rank: 2, user_id: 'user-2', username: 'BetMaster', tokens: 1180, change: '+120' },
              { rank: 3, user_id: 'user-3', username: 'OddsHunter', tokens: 1150, change: '+100' },
              { rank: 4, user_id: userId, username: 'You', tokens: 1100, change: '+80' },
              { rank: 5, user_id: 'user-5', username: 'RiskTaker', tokens: 1050, change: '+50' }
            ],
            season: [
              { rank: 1, user_id: 'user-1', username: 'FantasyKing', tokens: 8500, change: '+1200' },
              { rank: 2, user_id: 'user-2', username: 'BetMaster', tokens: 8200, change: '+1100' },
              { rank: 3, user_id: 'user-3', username: 'OddsHunter', tokens: 7950, change: '+950' },
              { rank: 4, user_id: userId, username: 'You', tokens: 7800, change: '+800' },
              { rank: 5, user_id: 'user-5', username: 'RiskTaker', tokens: 7600, change: '+600' }
            ]
          },
          competitions: [
            {
              id: 'comp-1',
              name: 'Weekly High Roller',
              type: 'weekly',
              prize: 500,
              participants: 12,
              status: 'active',
              endDate: '2024-01-21T23:59:59Z',
              leader: { username: 'FantasyKing', tokens: 1250 }
            },
            {
              id: 'comp-2',
              name: 'Season Champion',
              type: 'season',
              prize: 2000,
              participants: 12,
              status: 'active',
              endDate: '2024-02-11T23:59:59Z',
              leader: { username: 'BetMaster', tokens: 8200 }
            }
          ],
          achievements: [
            {
              id: 'ach-1',
              name: 'First Bet',
              description: 'Place your first bet',
              icon: '🎯',
              unlocked: true,
              unlockedAt: '2024-01-01T10:00:00Z'
            },
            {
              id: 'ach-2',
              name: 'Big Winner',
              description: 'Win a bet with 500+ tokens',
              icon: '💰',
              unlocked: true,
              unlockedAt: '2024-01-05T15:30:00Z'
            },
            {
              id: 'ach-3',
              name: 'Risk Taker',
              description: 'Place 10 risky bets',
              icon: '🎲',
              unlocked: false,
              progress: 7,
              target: 10
            }
          ],
          popularPicks: [
            { player: 'Josh Allen', team: 'BUF', betType: 'Fantasy Points Over', confidence: 85, betCount: 23 },
            { player: 'Christian McCaffrey', team: 'SF', betType: 'Rushing Yards Over', confidence: 78, betCount: 18 },
            { player: 'Tyreek Hill', team: 'MIA', betType: 'Receiving Yards Over', confidence: 72, betCount: 15 }
          ],
          recentActivity: [
            { user: 'FantasyKing', action: 'won a bet', details: 'Josh Allen Over 24.5 Fantasy Points', time: '2 minutes ago' },
            { user: 'BetMaster', action: 'placed a bet', details: 'McCaffrey Over 95.5 Rushing Yards', time: '5 minutes ago' },
            { user: 'OddsHunter', action: 'achieved', details: 'Risk Taker badge', time: '10 minutes ago' }
          ]
        };
        
        setSocialData(mockData);
      } catch (error) {
        console.error('Error fetching social data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, [leagueId, currentWeek, seasonYear]);

  const renderActiveTab = () => {
    if (!socialData) return <div>Loading...</div>;

    switch (activeTab) {
      case 'leaderboards':
        return <Leaderboards data={socialData.leaderboards} currentWeek={currentWeek} userId={userId} />;
      case 'competitions':
        return <Competitions data={socialData.competitions} userId={userId} />;
      case 'achievements':
        return <Achievements data={socialData.achievements} userId={userId} />;
      case 'community':
        return <Community data={{ popularPicks: socialData.popularPicks, recentActivity: socialData.recentActivity }} leagueId={leagueId} />;
      case 'profiles':
        return <MemberProfiles leagueId={leagueId} userId={userId} />;
      default:
        return <Leaderboards data={socialData.leaderboards} currentWeek={currentWeek} userId={userId} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Social Features</h1>
            <p className="text-blue-100">Compete, achieve, and connect with your league members</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Week {currentWeek}</div>
            <div className="text-lg font-semibold">Season {seasonYear}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.count && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderActiveTab()}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <FireIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">
              Real-time updates are disabled. Connect to see live leaderboards and community activity.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
