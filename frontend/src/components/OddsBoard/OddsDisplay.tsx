/**
 * Individual Odds Display Component
 * Shows odds for a single matchup with betting interface
 */

import React, { useState } from 'react';
import { Panel, Text, Button, FlexRow, FlexSpacer } from '@epam/uui';

export interface Matchup {
  id: string;
  team1: string;
  team2: string;
  team1Score?: number;
  team2Score?: number;
  team1Odds?: number;
  team2Odds?: number;
  spread?: number;
  total?: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  lastUpdated?: string;
}

export interface Bet {
  matchupId: string;
  selection: string;
  odds: number;
  amount: number;
  type: 'moneyline' | 'spread' | 'total';
}

export interface OddsDisplayProps {
  matchup: Matchup;
  isSelected?: boolean;
  onSelect?: () => void;
  onBetPlaced?: (bet: Bet) => void;
  isConnected?: boolean;
}

export const OddsDisplay: React.FC<OddsDisplayProps> = ({ 
  matchup, 
  isSelected = false,
  onSelect,
  onBetPlaced,
  isConnected = false
}) => {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [showBettingInterface, setShowBettingInterface] = useState(false);

  // Handle bet placement
  const handleBet = (selection: string, odds: number, type: 'moneyline' | 'spread' | 'total') => {
    const bet: Bet = {
      matchupId: matchup.id,
      selection,
      odds,
      amount: betAmount,
      type
    };
    
    setSelectedBet(bet);
    setShowBettingInterface(true);
  };

  // Confirm bet placement
  const confirmBet = () => {
    if (selectedBet && onBetPlaced) {
      onBetPlaced(selectedBet);
      setSelectedBet(null);
      setShowBettingInterface(false);
      setBetAmount(100); // Reset to default
    }
  };

  // Cancel bet placement
  const cancelBet = () => {
    setSelectedBet(null);
    setShowBettingInterface(false);
  };

  // Format odds display
  const formatOdds = (odds?: number) => {
    if (odds === undefined || odds === null) return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  // Format spread display
  const formatSpread = (spread?: number) => {
    if (spread === undefined || spread === null) return 'N/A';
    return spread > 0 ? `+${spread}` : `${spread}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'secondary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'in_progress': return 'Live';
      case 'completed': return 'Final';
      default: return 'Unknown';
    }
  };

  return (
    <Panel 
      shadow={true} 
      margin="24"
      style={{ 
        border: isSelected ? '2px solid #007bff' : '1px solid #e0e0e0',
        cursor: onSelect ? 'pointer' : 'default'
      }}
      onClick={onSelect}
    >
      {/* Matchup Header */}
      <FlexRow spacing="12" margin="24">
        <Text size="18">
          {matchup.team1} vs {matchup.team2}
        </Text>
        <FlexSpacer />
        <Text size="18" cx={getStatusColor(matchup.status)}>
          {getStatusText(matchup.status)}
        </Text>
      </FlexRow>

      {/* Scores (if available) */}
      {(matchup.team1Score !== undefined || matchup.team2Score !== undefined) && (
        <FlexRow spacing="12" margin="24">
          <Text size="24">
            {matchup.team1Score || 0} - {matchup.team2Score || 0}
          </Text>
        </FlexRow>
      )}

      {/* Moneyline Odds */}
      <Panel shadow={true} margin="24">
        <Text size="18">Moneyline</Text>
        <FlexRow spacing="12">
          <Button
            caption={`${matchup.team1} ${formatOdds(matchup.team1Odds)}`}
            onClick={(e) => {
              e.stopPropagation();
              if (matchup.team1Odds) {
                handleBet(matchup.team1, matchup.team1Odds, 'moneyline');
              }
            }}
            isDisabled={!isConnected || matchup.status === 'completed'}
            color="primary"
            size="18"
          />
          <Button
            caption={`${matchup.team2} ${formatOdds(matchup.team2Odds)}`}
            onClick={(e) => {
              e.stopPropagation();
              if (matchup.team2Odds) {
                handleBet(matchup.team2, matchup.team2Odds, 'moneyline');
              }
            }}
            isDisabled={!isConnected || matchup.status === 'completed'}
            color="primary"
            size="18"
          />
        </FlexRow>
      </Panel>

      {/* Spread Odds */}
      {matchup.spread !== undefined && (
        <Panel shadow={true} margin="24">
          <Text size="18">Spread</Text>
          <FlexRow spacing="12">
            <Button
              caption={`${matchup.team1} ${formatSpread(matchup.spread)}`}
              onClick={(e) => {
                e.stopPropagation();
                if (matchup.team1Odds) {
                  handleBet(matchup.team1, matchup.team1Odds, 'spread');
                }
              }}
              isDisabled={!isConnected || matchup.status === 'completed'}
              color="secondary"
              size="18"
            />
            <Button
              caption={`${matchup.team2} ${formatSpread(-matchup.spread)}`}
              onClick={(e) => {
                e.stopPropagation();
                if (matchup.team2Odds) {
                  handleBet(matchup.team2, matchup.team2Odds, 'spread');
                }
              }}
              isDisabled={!isConnected || matchup.status === 'completed'}
              color="secondary"
              size="18"
            />
          </FlexRow>
        </Panel>
      )}

      {/* Total Odds */}
      {matchup.total !== undefined && (
        <Panel shadow={true} margin="24">
          <Text size="18">Total</Text>
          <FlexRow spacing="12">
            <Button
              caption={`Over ${matchup.total}`}
              onClick={(e) => {
                e.stopPropagation();
                if (matchup.team1Odds) {
                  handleBet('over', matchup.team1Odds, 'total');
                }
              }}
              isDisabled={!isConnected || matchup.status === 'completed'}
              color="primary"
              size="18"
            />
            <Button
              caption={`Under ${matchup.total}`}
              onClick={(e) => {
                e.stopPropagation();
                if (matchup.team2Odds) {
                  handleBet('under', matchup.team2Odds, 'total');
                }
              }}
              isDisabled={!isConnected || matchup.status === 'completed'}
              color="critical"
              size="18"
            />
          </FlexRow>
        </Panel>
      )}

      {/* Last Updated */}
      {matchup.lastUpdated && (
        <Text size="18" color="secondary">
          Updated: {new Date(matchup.lastUpdated).toLocaleTimeString()}
        </Text>
      )}

      {/* Betting Interface Modal */}
      {showBettingInterface && selectedBet && (
        <Panel shadow={true} style={{ border: '2px solid #007bff' }}>
          <Text size="18">
            Place Bet: {selectedBet.selection}
          </Text>
          
          <Text size="18">
            Odds: {formatOdds(selectedBet.odds)}
          </Text>
          
          <Text size="18">
            Bet Amount: {betAmount} tokens
          </Text>
          
          <Text size="18">
            Potential Payout: {Math.round(betAmount * (selectedBet.odds > 0 ? selectedBet.odds / 100 + 1 : 100 / Math.abs(selectedBet.odds) + 1))} tokens
          </Text>
          
          <FlexRow spacing="12">
            <Button
              caption="Confirm Bet"
              onClick={(e) => {
                e.stopPropagation();
                confirmBet();
              }}
              color="primary"
              size="18"
            />
            <Button
              caption="Cancel"
              onClick={(e) => {
                e.stopPropagation();
                cancelBet();
              }}
              color="secondary"
              size="18"
            />
          </FlexRow>
        </Panel>
      )}

      {/* Connection Status Indicator */}
      {!isConnected && (
        <Panel shadow={true}>
          <Text size="18" color="warning">
            Offline - Odds may be outdated
          </Text>
        </Panel>
      )}
    </Panel>
  );
};

export default OddsDisplay;
