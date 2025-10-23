/**
 * TradeTree Component
 * 
 * Interactive trade tree visualization showing the flow of trades
 * and player values throughout the league's history.
 * 
 * Features:
 * - Interactive trade tree visualization
 * - Historical trade data parsing
 * - Trade value calculation and tracking
 * - Trade ROI analysis and portfolio performance
 * - Real-time trade value updates
 * - Trade pattern analysis and insights
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowPathIcon,
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/20/solid';
import { TradeVisualization } from './TradeVisualization';
import { TradeAnalysis } from './TradeAnalysis';
import { TradeHistory } from './TradeHistory';
import { TradeInsights } from './TradeInsights';

interface TradeData {
  id: string;
  date: string;
  teams: {
    team1: {
      id: string;
      name: string;
      players: string[];
      picks: string[];
    };
    team2: {
      id: string;
      name: string;
      players: string[];
      picks: string[];
    };
  };
  value: {
    team1_value: number;
    team2_value: number;
    fair_value: number;
    winner: 'team1' | 'team2' | 'fair';
  };
  roi?: {
    team1_roi: number;
    team2_roi: number;
  };
  status: 'completed' | 'pending' | 'cancelled';
}

interface TradeTreeProps {
  leagueId: string;
  userId: string;
  seasonYear: number;
  isConnected: boolean;
}

export const TradeTree: React.FC<TradeTreeProps> = ({
  leagueId,
  userId,
  seasonYear,
  isConnected
}) => {
  const [activeTab, setActiveTab] = useState<'visualization' | 'analysis' | 'history' | 'insights'>('visualization');
  const [tradeData, setTradeData] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeData | null>(null);

  // Mock trade data - in production, this would come from ESPN API
  const mockTradeData: TradeData[] = [
    {
      id: 'trade-1',
      date: '2024-01-15T10:30:00Z',
      teams: {
        team1: {
          id: 'team-1',
          name: 'Fantasy Kings',
          players: ['Josh Allen', 'Christian McCaffrey'],
          picks: ['2024 1st Round Pick']
        },
        team2: {
          id: 'team-2', 
          name: 'Bet Masters',
          players: ['Patrick Mahomes', 'Austin Ekeler', '2024 2nd Round Pick'],
          picks: []
        }
      },
      value: {
        team1_value: 85,
        team2_value: 78,
        fair_value: 82,
        winner: 'team1'
      },
      roi: {
        team1_roi: 12.5,
        team2_roi: -4.2
      },
      status: 'completed'
    },
    {
      id: 'trade-2',
      date: '2024-01-10T14:20:00Z',
      teams: {
        team1: {
          id: 'team-3',
          name: 'Odds Hunters',
          players: ['Tyreek Hill'],
          picks: ['2024 3rd Round Pick']
        },
        team2: {
          id: 'team-4',
          name: 'Risk Takers',
          players: ['Davante Adams', '2024 4th Round Pick'],
          picks: []
        }
      },
      value: {
        team1_value: 45,
        team2_value: 52,
        fair_value: 48,
        winner: 'team2'
      },
      roi: {
        team1_roi: -6.7,
        team2_roi: 8.3
      },
      status: 'completed'
    },
    {
      id: 'trade-3',
      date: '2024-01-05T16:45:00Z',
      teams: {
        team1: {
          id: 'team-1',
          name: 'Fantasy Kings',
          players: ['Travis Kelce'],
          picks: []
        },
        team2: {
          id: 'team-5',
          name: 'Value Seekers',
          players: ['Mark Andrews', '2024 2nd Round Pick'],
          picks: []
        }
      },
      value: {
        team1_value: 38,
        team2_value: 42,
        fair_value: 40,
        winner: 'team2'
      },
      roi: {
        team1_roi: -5.2,
        team2_roi: 5.0
      },
      status: 'completed'
    }
  ];

  useEffect(() => {
    const fetchTradeData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from the API
        setTradeData(mockTradeData);
      } catch (error) {
        console.error('Error fetching trade data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeData();
  }, [leagueId, seasonYear]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTrades = () => tradeData.length;
  const getTotalValue = () => tradeData.reduce((sum, trade) => sum + trade.value.team1_value + trade.value.team2_value, 0);
  const getActiveTrades = () => tradeData.filter(trade => trade.status === 'completed').length;

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'visualization':
        return <TradeVisualization tradeData={tradeData} selectedTrade={selectedTrade} onSelectTrade={setSelectedTrade} />;
      case 'analysis':
        return <TradeAnalysis tradeData={tradeData} selectedTrade={selectedTrade} />;
      case 'history':
        return <TradeHistory tradeData={tradeData} onSelectTrade={setSelectedTrade} />;
      case 'insights':
        return <TradeInsights tradeData={tradeData} leagueId={leagueId} />;
      default:
        return <TradeVisualization tradeData={tradeData} selectedTrade={selectedTrade} onSelectTrade={setSelectedTrade} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Trade Tree & Value Flow Tracker</h1>
            <p className="text-green-100">Track trade history, analyze value flow, and discover trade patterns</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-200">Season {seasonYear}</div>
            <div className="text-lg font-semibold">League TB12</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowPathIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Total Trades</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">{getTotalTrades()}</div>
          <div className="text-sm text-gray-600">This season</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium text-gray-900">Total Value</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">{getTotalValue()}</div>
          <div className="text-sm text-gray-600">Trade points</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Completed</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{getActiveTrades()}</div>
          <div className="text-sm text-gray-600">Successful trades</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium text-gray-900">Avg Value</h4>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {getTotalTrades() > 0 ? Math.round(getTotalValue() / (getTotalTrades() * 2)) : 0}
          </div>
          <div className="text-sm text-gray-600">Per trade</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'visualization', name: 'Trade Tree', icon: ChartBarIcon },
              { id: 'analysis', name: 'Analysis', icon: TrophyIcon },
              { id: 'history', name: 'History', icon: ClockIcon },
              { id: 'insights', name: 'Insights', icon: EyeIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
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
            <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">
              Real-time trade updates are disabled. Connect to see live trade data and analysis.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
