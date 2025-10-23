/**
 * Competitions Component
 * 
 * Displays active and upcoming competitions with rankings,
 * prizes, and participation tracking.
 * 
 * Features:
 * - Active competitions with live rankings
 * - Upcoming competitions and registration
 * - Prize pools and token rewards
 * - Competition history and results
 * - Participation tracking and statistics
 * - Competition management and rules
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { 
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  GiftIcon,
  StarIcon,
  CalendarIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/20/solid';

interface Competition {
  id: string;
  name: string;
  type: 'weekly' | 'season' | 'special';
  description: string;
  prize: number;
  participants: number;
  maxParticipants?: number;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  rules: string[];
  leader?: {
    username: string;
    tokens: number;
  };
  yourRank?: number;
  yourTokens?: number;
}

interface CompetitionsProps {
  data: Competition[];
  userId: string;
}

export const Competitions: React.FC<CompetitionsProps> = ({ data, userId }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FireIcon className="h-4 w-4" />;
      case 'upcoming':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <TrophyIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case 'season':
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
      case 'special':
        return <StarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <TrophyIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const filteredCompetitions = data.filter(comp => {
    if (activeFilter === 'all') return true;
    return comp.status === activeFilter;
  });

  const renderCompetition = (competition: Competition) => (
    <div key={competition.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getTypeIcon(competition.type)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{competition.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{competition.type} competition</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(competition.status)}`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(competition.status)}
              <span className="capitalize">{competition.status}</span>
            </div>
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{competition.description}</p>

      {/* Competition Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <GiftIcon className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Prize Pool</span>
          </div>
          <div className="text-lg font-bold text-green-600">{competition.prize.toLocaleString()} tokens</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <UsersIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Participants</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {competition.participants}{competition.maxParticipants ? `/${competition.maxParticipants}` : ''}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <ClockIcon className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Time Left</span>
          </div>
          <div className="text-sm font-bold text-orange-600">{getTimeRemaining(competition.endDate)}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Leader</span>
          </div>
          <div className="text-sm font-bold text-yellow-600">
            {competition.leader ? competition.leader.username : 'N/A'}
          </div>
        </div>
      </div>

      {/* Your Performance */}
      {competition.yourRank && competition.yourTokens !== undefined && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Your Performance</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-sm text-blue-700">Rank: </span>
                <span className="font-bold text-blue-900">#{competition.yourRank}</span>
              </div>
              <div>
                <span className="text-sm text-blue-700">Tokens: </span>
                <span className="font-bold text-blue-900">{competition.yourTokens.toLocaleString()}</span>
              </div>
            </div>
            {competition.yourRank <= 3 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <TrophyIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Podium Position!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Competition Rules</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {competition.rules.map((rule, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <span className="font-medium">Starts:</span> {formatDate(competition.startDate)}
        </div>
        <div>
          <span className="font-medium">Ends:</span> {formatDate(competition.endDate)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-3">
        {competition.status === 'upcoming' && (
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Join Competition
          </button>
        )}
        {competition.status === 'active' && (
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            View Live Rankings
          </button>
        )}
        {competition.status === 'completed' && (
          <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            View Results
          </button>
        )}
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Competitions</h2>
          <p className="text-sm text-gray-600">Compete for prizes and glory in league competitions</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'active', 'upcoming', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeFilter === filter
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Competition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium text-gray-900">Active Competitions</h4>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {data.filter(comp => comp.status === 'active').length}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Total Prizes</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {data.reduce((sum, comp) => sum + comp.prize, 0).toLocaleString()} tokens
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UsersIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Total Participants</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, comp) => sum + comp.participants, 0)}
          </div>
        </div>
      </div>

      {/* Competitions List */}
      <div className="space-y-4">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map(renderCompetition)
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <TrophyIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions found</h3>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? 'No competitions are available at the moment.'
                : `No ${activeFilter} competitions found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
