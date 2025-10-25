/**
 * CustomMatchups Component
 * 
 * Allows users to create custom head-to-head matchups between players,
 * teams, or fantasy scenarios for betting purposes.
 * 
 * Features:
 * - Custom matchup creation
 * - Player vs player betting
 * - Team vs team betting
 * - Fantasy scenario betting
 * - Custom odds setting
 * - Matchup history tracking
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  UserIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/20/solid';

interface CustomMatchupsProps {
  leagueId: string;
  userId: string;
  currentWeek: number;
  onPlaceBet: (betData: any) => void;
  tokenBalance: number;
  marketData: any;
  isConnected: boolean;
}

interface CustomMatchup {
  id: string;
  title: string;
  type: 'player_vs_player' | 'team_vs_team' | 'fantasy_scenario';
  participant1: {
    name: string;
    type: 'player' | 'team' | 'scenario';
    stats?: any;
  };
  participant2: {
    name: string;
    type: 'player' | 'team' | 'scenario';
    stats?: any;
  };
  odds: {
    participant1: number;
    participant2: number;
  };
  createdBy: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  totalBets: number;
  totalVolume: number;
}

export const CustomMatchups: React.FC<CustomMatchupsProps> = ({
  leagueId,
  userId,
  currentWeek,
  onPlaceBet,
  tokenBalance,
  marketData,
  isConnected
}) => {
  const [matchups, setMatchups] = useState<CustomMatchup[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchup, setSelectedMatchup] = useState<CustomMatchup | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betSelection, setBetSelection] = useState<'participant1' | 'participant2' | null>(null);

  // Mock custom matchups data
  const mockMatchups: CustomMatchup[] = [
    {
      id: 'matchup-1',
      title: 'Josh Allen vs Lamar Jackson',
      type: 'player_vs_player',
      participant1: {
        name: 'Josh Allen',
        type: 'player',
        stats: { passingYards: 285.2, rushingYards: 42.1, touchdowns: 2.8 }
      },
      participant2: {
        name: 'Lamar Jackson',
        type: 'player',
        stats: { passingYards: 245.8, rushingYards: 48.2, touchdowns: 2.6 }
      },
      odds: { participant1: -110, participant2: -110 },
      createdBy: 'user-123',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalBets: 15,
      totalVolume: 450
    },
    {
      id: 'matchup-2',
      title: 'Chiefs vs Bills Total Points',
      type: 'team_vs_team',
      participant1: {
        name: 'Over 52.5',
        type: 'scenario',
        stats: { averagePoints: 28.5 }
      },
      participant2: {
        name: 'Under 52.5',
        type: 'scenario',
        stats: { averagePoints: 24.2 }
      },
      odds: { participant1: -105, participant2: -115 },
      createdBy: 'user-456',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalBets: 8,
      totalVolume: 240
    },
    {
      id: 'matchup-3',
      title: 'Fantasy RB1 Battle',
      type: 'fantasy_scenario',
      participant1: {
        name: 'Christian McCaffrey',
        type: 'player',
        stats: { fantasyPoints: 25.8, touches: 22.3 }
      },
      participant2: {
        name: 'Austin Ekeler',
        type: 'player',
        stats: { fantasyPoints: 23.4, touches: 19.7 }
      },
      odds: { participant1: -120, participant2: +100 },
      createdBy: 'user-789',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalBets: 12,
      totalVolume: 360
    }
  ];

  useEffect(() => {
    setMatchups(mockMatchups);
  }, []);

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const calculatePayout = (odds: number, amount: number): number => {
    if (odds > 0) {
      return amount + (amount * odds / 100);
    } else {
      return amount + (amount * 100 / Math.abs(odds));
    }
  };

  const handleBetSelection = (matchup: CustomMatchup, selection: 'participant1' | 'participant2') => {
    setSelectedMatchup(matchup);
    setBetSelection(selection);
  };

  const handlePlaceBet = () => {
    if (selectedMatchup && betSelection && betAmount <= tokenBalance) {
      const betData = {
        gameId: `custom-${selectedMatchup.id}`,
        matchupTitle: selectedMatchup.title,
        matchupType: selectedMatchup.type,
        selection: betSelection,
        participant: betSelection === 'participant1' ? selectedMatchup.participant1.name : selectedMatchup.participant2.name,
        odds: betSelection === 'participant1' ? selectedMatchup.odds.participant1 : selectedMatchup.odds.participant2,
        amount: betAmount,
        potentialPayout: calculatePayout(
          betSelection === 'participant1' ? selectedMatchup.odds.participant1 : selectedMatchup.odds.participant2,
          betAmount
        ),
        betType: 'custom_matchup'
      };
      
      onPlaceBet(betData);
      setSelectedMatchup(null);
      setBetSelection(null);
      setBetAmount(10);
    } else {
      alert('Insufficient token balance or invalid bet selection');
    }
  };

  const getMatchupTypeIcon = (type: string) => {
    switch (type) {
      case 'player_vs_player':
        return <UserIcon className="h-5 w-5 text-blue-600" />;
      case 'team_vs_team':
        return <UserGroupIcon className="h-5 w-5 text-green-600" />;
      case 'fantasy_scenario':
        return <ChartBarIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMatchupTypeColor = (type: string) => {
    switch (type) {
      case 'player_vs_player':
        return 'bg-blue-50 border-blue-200';
      case 'team_vs_team':
        return 'bg-green-50 border-green-200';
      case 'fantasy_scenario':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Custom Matchups</h2>
          <p className="text-sm text-gray-600">Create and bet on custom head-to-head matchups</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Matchup
        </button>
      </div>

      {/* Betting Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Bet Amount:</label>
          <input
            type="number"
            min="1"
            max={tokenBalance}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
          <span className="text-sm text-gray-500">tokens</span>
          <span className="text-sm text-gray-600">
            Balance: {tokenBalance.toLocaleString()} tokens
          </span>
        </div>
      </div>

      {/* Matchups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matchups.map((matchup) => (
          <div key={matchup.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${getMatchupTypeColor(matchup.type)}`}>
            {/* Matchup Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getMatchupTypeIcon(matchup.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{matchup.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {matchup.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {matchup.totalBets} bets • {matchup.totalVolume} tokens
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    matchup.status === 'active' ? 'bg-green-100 text-green-800' :
                    matchup.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {matchup.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Matchup Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Participant 1 */}
                <div className="text-center">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900">{matchup.participant1.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{matchup.participant1.type}</p>
                  </div>
                  
                  {matchup.participant1.stats && (
                    <div className="mb-4 space-y-1 text-xs text-gray-600">
                      {Object.entries(matchup.participant1.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleBetSelection(matchup, 'participant1')}
                    disabled={matchup.status !== 'active'}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      matchup.status !== 'active'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedMatchup?.id === matchup.id && betSelection === 'participant1'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold">{formatOdds(matchup.odds.participant1)}</div>
                    <div className="text-xs">Bet</div>
                  </button>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center">
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                </div>

                {/* Participant 2 */}
                <div className="text-center">
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900">{matchup.participant2.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{matchup.participant2.type}</p>
                  </div>
                  
                  {matchup.participant2.stats && (
                    <div className="mb-4 space-y-1 text-xs text-gray-600">
                      {Object.entries(matchup.participant2.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleBetSelection(matchup, 'participant2')}
                    disabled={matchup.status !== 'active'}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      matchup.status !== 'active'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedMatchup?.id === matchup.id && betSelection === 'participant2'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold">{formatOdds(matchup.odds.participant2)}</div>
                    <div className="text-xs">Bet</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Matchup Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Created by {matchup.createdBy}</span>
                <span>{new Date(matchup.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bet Confirmation */}
      {selectedMatchup && betSelection && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3">Confirm Custom Matchup Bet</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Matchup:</span> {selectedMatchup.title}</div>
            <div><span className="font-medium">Selection:</span> {betSelection === 'participant1' ? selectedMatchup.participant1.name : selectedMatchup.participant2.name}</div>
            <div><span className="font-medium">Odds:</span> {formatOdds(betSelection === 'participant1' ? selectedMatchup.odds.participant1 : selectedMatchup.odds.participant2)}</div>
            <div><span className="font-medium">Amount:</span> {betAmount} tokens</div>
            <div><span className="font-medium">Potential Payout:</span> {calculatePayout(betSelection === 'participant1' ? selectedMatchup.odds.participant1 : selectedMatchup.odds.participant2, betAmount).toFixed(2)} tokens</div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handlePlaceBet}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Place Bet
            </button>
            <button
              onClick={() => {
                setSelectedMatchup(null);
                setBetSelection(null);
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Matchup Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Matchup</h3>
            <p className="text-gray-600 mb-4">This feature will be implemented in the next phase.</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
