/**
 * TokenBalance Component
 * 
 * Displays the user's current token balance with visual indicators
 * and quick access to token management features.
 * 
 * Features:
 * - Real-time balance display
 * - Visual balance indicators (low, medium, high)
 * - Token history access
 * - Mobile-responsive design
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React from 'react';
import { CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

interface TokenBalanceProps {
  balance: number;
  showDetails?: boolean;
  onShowDetails?: () => void;
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({ 
  balance, 
  showDetails = false,
  onShowDetails 
}) => {
  const getBalanceStatus = (balance: number): 'low' | 'medium' | 'high' => {
    if (balance < 100) return 'low';
    if (balance < 500) return 'medium';
    return 'high';
  };

  const getBalanceColor = (status: 'low' | 'medium' | 'high'): string => {
    switch (status) {
      case 'low':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBalanceBgColor = (status: 'low' | 'medium' | 'high'): string => {
    switch (status) {
      case 'low':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'high':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const status = getBalanceStatus(balance);
  const colorClass = getBalanceColor(status);
  const bgClass = getBalanceBgColor(status);

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${bgClass}`}>
      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-500" />
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Balance:</span>
        <span className={`text-lg font-bold ${colorClass}`}>
          {balance.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">tokens</span>
      </div>

      {status === 'low' && (
        <ExclamationTriangleIcon className="h-4 w-4 ml-2 text-red-500" />
      )}

      {showDetails && onShowDetails && (
        <button
          onClick={onShowDetails}
          className="ml-3 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Details
        </button>
      )}
    </div>
  );
};
