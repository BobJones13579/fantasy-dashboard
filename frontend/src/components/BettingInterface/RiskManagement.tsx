/**
 * RiskManagement Component
 * 
 * Provides comprehensive risk management tools and features to help users
 * make informed betting decisions and manage their betting bankroll.
 * 
 * Features:
 * - Bankroll management tools
 * - Bet sizing recommendations
 * - Risk assessment and warnings
 * - Loss limits and controls
 * - Betting strategy guidance
 * - Performance tracking
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/20/solid';

interface RiskManagementProps {
  leagueId: string;
  userId: string;
  tokenBalance: number;
  bettingHistory: any[];
}

interface RiskSettings {
  maxBetPercentage: number;
  dailyLossLimit: number;
  weeklyLossLimit: number;
  maxConsecutiveBets: number;
  coolingOffPeriod: number;
}

export const RiskManagement: React.FC<RiskManagementProps> = ({
  leagueId,
  userId,
  tokenBalance,
  bettingHistory
}) => {
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxBetPercentage: 5, // 5% of balance per bet
    dailyLossLimit: 100, // 100 tokens per day
    weeklyLossLimit: 500, // 500 tokens per week
    maxConsecutiveBets: 5, // Max 5 consecutive losing bets
    coolingOffPeriod: 60 // 60 minutes cooling off period
  });

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Daily losses
    const todayBets = bettingHistory.filter(bet => {
      const betDate = new Date(bet.date || bet.created_at);
      return betDate.toDateString() === today.toDateString();
    });
    const dailyLosses = todayBets
      .filter(bet => bet.status === 'lost')
      .reduce((sum, bet) => sum + (bet.amount || 0), 0);
    
    // Weekly losses
    const weeklyBets = bettingHistory.filter(bet => {
      const betDate = new Date(bet.date || bet.created_at);
      return betDate >= weekAgo;
    });
    const weeklyLosses = weeklyBets
      .filter(bet => bet.status === 'lost')
      .reduce((sum, bet) => sum + (bet.amount || 0), 0);
    
    // Consecutive losses
    let consecutiveLosses = 0;
    for (const bet of bettingHistory) {
      if (bet.status === 'lost') {
        consecutiveLosses++;
      } else {
        break;
      }
    }
    
    // Average bet size
    const totalBets = bettingHistory.length;
    const totalWagered = bettingHistory.reduce((sum, bet) => sum + (bet.amount || 0), 0);
    const avgBetSize = totalBets > 0 ? totalWagered / totalBets : 0;
    
    // Risk level calculation
    const riskScore = (() => {
      let score = 0;
      
      // Bet size relative to balance
      if (avgBetSize > tokenBalance * 0.1) score += 3;
      else if (avgBetSize > tokenBalance * 0.05) score += 2;
      else if (avgBetSize > tokenBalance * 0.02) score += 1;
      
      // Daily loss percentage
      const dailyLossPercentage = (dailyLosses / tokenBalance) * 100;
      if (dailyLossPercentage > 20) score += 3;
      else if (dailyLossPercentage > 10) score += 2;
      else if (dailyLossPercentage > 5) score += 1;
      
      // Consecutive losses
      if (consecutiveLosses >= 5) score += 3;
      else if (consecutiveLosses >= 3) score += 2;
      else if (consecutiveLosses >= 2) score += 1;
      
      return score;
    })();
    
    const riskLevel = riskScore >= 6 ? 'high' : riskScore >= 3 ? 'medium' : 'low';
    
    // Recommended bet size
    const recommendedBetSize = Math.max(1, Math.floor(tokenBalance * (riskSettings.maxBetPercentage / 100)));
    
    return {
      dailyLosses,
      weeklyLosses,
      consecutiveLosses,
      avgBetSize,
      riskScore,
      riskLevel,
      recommendedBetSize,
      dailyLossPercentage: (dailyLosses / tokenBalance) * 100,
      weeklyLossPercentage: (weeklyLosses / tokenBalance) * 100
    };
  }, [bettingHistory, tokenBalance, riskSettings]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <ShieldCheckIcon className="h-5 w-5 text-green-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleSettingChange = (setting: keyof RiskSettings, value: number) => {
    setRiskSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Risk Overview</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRiskColor(riskMetrics.riskLevel)}`}>
            {getRiskIcon(riskMetrics.riskLevel)}
            <span className="text-sm font-medium capitalize">{riskMetrics.riskLevel} Risk</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{riskMetrics.riskScore}</div>
            <div className="text-sm text-gray-600">Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{riskMetrics.consecutiveLosses}</div>
            <div className="text-sm text-gray-600">Consecutive Losses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{riskMetrics.recommendedBetSize}</div>
            <div className="text-sm text-gray-600">Recommended Bet Size</div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Daily Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today's Losses</span>
              <span className={`font-medium ${riskMetrics.dailyLosses > riskSettings.dailyLossLimit ? 'text-red-600' : 'text-gray-900'}`}>
                {riskMetrics.dailyLosses} tokens
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Limit</span>
              <span className="text-gray-900">{riskSettings.dailyLossLimit} tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Loss Percentage</span>
              <span className={`font-medium ${riskMetrics.dailyLossPercentage > 10 ? 'text-red-600' : 'text-gray-900'}`}>
                {riskMetrics.dailyLossPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Weekly Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Losses</span>
              <span className={`font-medium ${riskMetrics.weeklyLosses > riskSettings.weeklyLossLimit ? 'text-red-600' : 'text-gray-900'}`}>
                {riskMetrics.weeklyLosses} tokens
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Limit</span>
              <span className="text-gray-900">{riskSettings.weeklyLossLimit} tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Loss Percentage</span>
              <span className={`font-medium ${riskMetrics.weeklyLossPercentage > 20 ? 'text-red-600' : 'text-gray-900'}`}>
                {riskMetrics.weeklyLossPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Management Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Bet Percentage ({riskSettings.maxBetPercentage}%)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={riskSettings.maxBetPercentage}
                onChange={(e) => handleSettingChange('maxBetPercentage', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Loss Limit ({riskSettings.dailyLossLimit} tokens)
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={riskSettings.dailyLossLimit}
                onChange={(e) => handleSettingChange('dailyLossLimit', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Loss Limit ({riskSettings.weeklyLossLimit} tokens)
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={riskSettings.weeklyLossLimit}
                onChange={(e) => handleSettingChange('weeklyLossLimit', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50</span>
                <span>5000</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Consecutive Bets ({riskSettings.maxConsecutiveBets})
              </label>
              <input
                type="range"
                min="2"
                max="10"
                value={riskSettings.maxConsecutiveBets}
                onChange={(e) => handleSettingChange('maxConsecutiveBets', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cooling Off Period ({riskSettings.coolingOffPeriod} minutes)
              </label>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={riskSettings.coolingOffPeriod}
                onChange={(e) => handleSettingChange('coolingOffPeriod', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15min</span>
                <span>4hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings and Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Alerts</h3>
        <div className="space-y-3">
          {riskMetrics.dailyLosses > riskSettings.dailyLossLimit && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Daily Loss Limit Exceeded</h4>
                <p className="text-sm text-red-700">
                  You've exceeded your daily loss limit of {riskSettings.dailyLossLimit} tokens. 
                  Consider taking a break from betting.
                </p>
              </div>
            </div>
          )}

          {riskMetrics.weeklyLosses > riskSettings.weeklyLossLimit && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Weekly Loss Limit Exceeded</h4>
                <p className="text-sm text-red-700">
                  You've exceeded your weekly loss limit of {riskSettings.weeklyLossLimit} tokens. 
                  Consider reviewing your betting strategy.
                </p>
              </div>
            </div>
          )}

          {riskMetrics.consecutiveLosses >= riskSettings.maxConsecutiveBets && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Cooling Off Period Active</h4>
                <p className="text-sm text-yellow-700">
                  You've reached {riskMetrics.consecutiveLosses} consecutive losses. 
                  A {riskSettings.coolingOffPeriod}-minute cooling off period is recommended.
                </p>
              </div>
            </div>
          )}

          {riskMetrics.avgBetSize > tokenBalance * 0.1 && (
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <CurrencyDollarIcon className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">High Bet Sizes Detected</h4>
                <p className="text-sm text-orange-700">
                  Your average bet size is high relative to your balance. 
                  Consider reducing bet sizes to manage risk better.
                </p>
              </div>
            </div>
          )}

          {riskMetrics.riskLevel === 'low' && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Good Risk Management</h4>
                <p className="text-sm text-green-700">
                  You're maintaining good risk management practices. Keep up the responsible betting!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Betting Guidelines */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Betting Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recommended Practices</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Never bet more than {riskSettings.maxBetPercentage}% of your balance on a single bet</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Set and stick to daily and weekly loss limits</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Take breaks after consecutive losses</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Diversify your betting types and strategies</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Warning Signs</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Increasing bet sizes to chase losses</span>
              </li>
              <li className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Betting when emotional or stressed</span>
              </li>
              <li className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Exceeding set loss limits regularly</span>
              </li>
              <li className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Betting more than you can afford to lose</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
