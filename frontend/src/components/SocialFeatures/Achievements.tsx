/**
 * Achievements Component
 * 
 * Displays user achievements, badges, and progress tracking
 * with unlockable rewards and milestone celebrations.
 * 
 * Features:
 * - Achievement badges with unlock conditions
 * - Progress tracking for incomplete achievements
 * - Achievement categories and rarity levels
 * - Unlock notifications and celebrations
 * - Achievement statistics and analytics
 * - Social sharing of achievements
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  StarIcon,
  TrophyIcon,
  FireIcon,
  GiftIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon
} from '@heroicons/react/20/solid';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'betting' | 'social' | 'performance' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  points: number;
  reward?: {
    tokens?: number;
    badge?: string;
    title?: string;
  };
}

interface AchievementsProps {
  data: Achievement[];
  userId: string;
}

export const Achievements: React.FC<AchievementsProps> = ({ data, userId }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'betting' | 'social' | 'performance' | 'special'>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <StarIcon className="h-4 w-4 text-gray-500" />;
      case 'rare':
        return <StarIcon className="h-4 w-4 text-blue-500" />;
      case 'epic':
        return <StarIcon className="h-4 w-4 text-purple-500" />;
      case 'legendary':
        return <TrophyIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <StarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'betting':
        return <ChartBarIcon className="h-5 w-5 text-green-500" />;
      case 'social':
        return <FireIcon className="h-5 w-5 text-orange-500" />;
      case 'performance':
        return <TrophyIcon className="h-5 w-5 text-blue-500" />;
      case 'special':
        return <GiftIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <StarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getProgressPercentage = (progress?: number, target?: number) => {
    if (!progress || !target) return 0;
    return Math.min((progress / target) * 100, 100);
  };

  const formatUnlockDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredAchievements = data.filter(achievement => {
    if (showUnlockedOnly && !achievement.unlocked) return false;
    if (activeCategory !== 'all' && achievement.category !== activeCategory) return false;
    return true;
  });

  const unlockedCount = data.filter(achievement => achievement.unlocked).length;
  const totalPoints = data.filter(achievement => achievement.unlocked).reduce((sum, achievement) => sum + achievement.points, 0);

  const renderAchievement = (achievement: Achievement) => (
    <div
      key={achievement.id}
      className={`rounded-lg border p-6 transition-all hover:shadow-md ${
        achievement.unlocked 
          ? getRarityColor(achievement.rarity)
          : 'border-gray-200 bg-gray-50 opacity-75'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{achievement.name}</h3>
            <div className="flex items-center space-x-2">
              {getRarityIcon(achievement.rarity)}
              <span className="text-sm text-gray-600 capitalize">{achievement.rarity}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600 capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {achievement.unlocked ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : (
            <LockClosedIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-600">{achievement.points} pts</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{achievement.description}</p>

      {/* Progress Bar */}
      {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{achievement.progress} / {achievement.target}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(achievement.progress, achievement.target)}%` }}
            />
          </div>
        </div>
      )}

      {/* Reward */}
      {achievement.reward && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Reward</h4>
          <div className="flex items-center space-x-4">
            {achievement.reward.tokens && (
              <div className="flex items-center space-x-1">
                <GiftIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">{achievement.reward.tokens} tokens</span>
              </div>
            )}
            {achievement.reward.badge && (
              <div className="flex items-center space-x-1">
                <TrophyIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">{achievement.reward.badge} badge</span>
              </div>
            )}
            {achievement.reward.title && (
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-700">{achievement.reward.title} title</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unlock Date */}
      {achievement.unlocked && achievement.unlockedAt && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4" />
          <span>Unlocked on {formatUnlockDate(achievement.unlockedAt)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
          <p className="text-sm text-gray-600">Unlock badges and earn rewards for your accomplishments</p>
        </div>
        
        {/* Achievement Stats */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{unlockedCount} / {data.length}</div>
          <div className="text-sm text-gray-600">Achievements Unlocked</div>
          <div className="text-lg font-semibold text-blue-600">{totalPoints} points</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Unlocked</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{unlockedCount}</div>
          <div className="text-sm text-gray-600">achievements</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Total Points</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
          <div className="text-sm text-gray-600">points earned</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium text-gray-900">Completion</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round((unlockedCount / data.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">complete</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <LockClosedIcon className="h-5 w-5 text-gray-500" />
            <h4 className="font-medium text-gray-900">Remaining</h4>
          </div>
          <div className="text-2xl font-bold text-gray-600">{data.length - unlockedCount}</div>
          <div className="text-sm text-gray-600">to unlock</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'betting', 'social', 'performance', 'special'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as any)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            showUnlockedOnly
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(renderAchievement)
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-lg border border-gray-200">
            <StarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">
              {showUnlockedOnly 
                ? 'You haven\'t unlocked any achievements yet.'
                : 'No achievements match your current filters.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Achievement Progress Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Progress</h3>
        <div className="space-y-3">
          {['betting', 'social', 'performance', 'special'].map((category) => {
            const categoryAchievements = data.filter(achievement => achievement.category === category);
            const unlockedInCategory = categoryAchievements.filter(achievement => achievement.unlocked).length;
            const categoryPoints = categoryAchievements.filter(achievement => achievement.unlocked).reduce((sum, achievement) => sum + achievement.points, 0);
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <span className="font-medium text-gray-900 capitalize">{category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {unlockedInCategory} / {categoryAchievements.length}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {categoryPoints} points
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(unlockedInCategory / categoryAchievements.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
