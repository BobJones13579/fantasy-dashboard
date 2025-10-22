import React, { useState, useEffect } from 'react';

interface TokenBalanceProps {
  teamId: string;
  week?: number;
}

interface TokenBalanceData {
  current_balance: number;
  weekly_used: number;
  starting_balance: number;
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({ teamId, week = 1 }) => {
  const [balance, setBalance] = useState<TokenBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/tokens/balance/${teamId}/${week}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // No balance found, allocate tokens
            const allocateResponse = await fetch(`http://localhost:8000/api/v1/tokens/allocate/${teamId}/${week}`, {
              method: 'POST'
            });
            
            if (allocateResponse.ok) {
              const newBalance = await allocateResponse.json();
              setBalance(newBalance);
            } else {
              throw new Error('Failed to allocate tokens');
            }
          } else {
            throw new Error('Failed to fetch token balance');
          }
        } else {
          const balanceData = await response.json();
          setBalance(balanceData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTokenBalance();
    }
  }, [teamId, week]);

  if (loading) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-green-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="font-semibold text-red-800">Token Balance Error</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800">Token Balance</h3>
        <p className="text-gray-600 text-sm">No balance data available</p>
      </div>
    );
  }

  const usagePercentage = (balance.weekly_used / balance.starting_balance) * 100;

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-green-800">Token Balance</h3>
        <span className="text-xs text-green-600">Week {week}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-700">
            {balance.current_balance.toLocaleString()}
          </span>
          <span className="text-sm text-green-600">tokens</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Used this week:</span>
            <span className="text-green-700">{balance.weekly_used.toLocaleString()}</span>
          </div>
          
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-green-600">
            <span>0</span>
            <span>{balance.starting_balance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
