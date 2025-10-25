/**
 * TradeVisualization Component
 * 
 * Interactive trade tree visualization using D3.js or similar
 * to show the flow of trades and player values.
 * 
 * Features:
 * - Interactive trade tree with drag and zoom
 * - Player and pick flow visualization
 * - Trade value indicators
 * - Team connection lines
 * - Hover effects and detailed tooltips
 * 
 * @author Fantasy Football Companion App
 * @version 1.0.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowPathIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EyeIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/20/solid';

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

interface TradeVisualizationProps {
  tradeData: TradeData[];
  selectedTrade: TradeData | null;
  onSelectTrade: (trade: TradeData | null) => void;
}

export const TradeVisualization: React.FC<TradeVisualizationProps> = ({
  tradeData,
  selectedTrade,
  onSelectTrade
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Simple trade visualization without D3.js for now
  const renderTradeNode = (trade: TradeData, index: number) => {
    const isSelected = selectedTrade?.id === trade.id;
    const isWinner = trade.value.winner === 'team1' || trade.value.winner === 'team2';
    
    return (
      <div
        key={trade.id}
        className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
          isSelected 
            ? 'border-blue-500 shadow-lg' 
            : isWinner 
            ? 'border-green-300 hover:border-green-400' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => onSelectTrade(isSelected ? null : trade)}
        style={{
          transform: `translate(${index * 400 + pan.x}px, ${200 + pan.y}px) scale(${zoom})`,
          width: '350px'
        }}
      >
        {/* Trade Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ArrowPathIcon className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-gray-900">Trade #{index + 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isWinner && <TrophyIcon className="h-4 w-4 text-yellow-500" />}
            <span className={`text-xs px-2 py-1 rounded-full ${
              trade.status === 'completed' ? 'bg-green-100 text-green-800' :
              trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {trade.status}
            </span>
          </div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-4">
          {/* Team 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-sm text-gray-900">{trade.teams.team1.name}</span>
            </div>
            
            {/* Players */}
            {trade.teams.team1.players.map((player, playerIndex) => (
              <div key={playerIndex} className="text-xs text-gray-600 pl-5">
                <UserGroupIcon className="h-3 w-3 inline mr-1" />
                {player}
              </div>
            ))}
            
            {/* Picks */}
            {trade.teams.team1.picks.map((pick, pickIndex) => (
              <div key={pickIndex} className="text-xs text-gray-600 pl-5">
                <CurrencyDollarIcon className="h-3 w-3 inline mr-1" />
                {pick}
              </div>
            ))}
            
            {/* Value */}
            <div className="pl-5">
              <div className="text-xs font-medium text-gray-700">
                Value: {trade.value.team1_value}
              </div>
              {trade.roi && (
                <div className={`text-xs ${trade.roi.team1_roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ROI: {trade.roi.team1_roi > 0 ? '+' : ''}{trade.roi.team1_roi.toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="text-lg font-bold text-gray-400">VS</div>
          </div>

          {/* Team 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-sm text-gray-900">{trade.teams.team2.name}</span>
            </div>
            
            {/* Players */}
            {trade.teams.team2.players.map((player, playerIndex) => (
              <div key={playerIndex} className="text-xs text-gray-600 pl-5">
                <UserGroupIcon className="h-3 w-3 inline mr-1" />
                {player}
              </div>
            ))}
            
            {/* Picks */}
            {trade.teams.team2.picks.map((pick, pickIndex) => (
              <div key={pickIndex} className="text-xs text-gray-600 pl-5">
                <CurrencyDollarIcon className="h-3 w-3 inline mr-1" />
                {pick}
              </div>
            ))}
            
            {/* Value */}
            <div className="pl-5">
              <div className="text-xs font-medium text-gray-700">
                Value: {trade.value.team2_value}
              </div>
              {trade.roi && (
                <div className={`text-xs ${trade.roi.team2_roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ROI: {trade.roi.team2_roi > 0 ? '+' : ''}{trade.roi.team2_roi.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trade Details */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(trade.date).toLocaleDateString()}</span>
            <span>Fair Value: {trade.value.fair_value}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <MagnifyingGlassMinusIcon className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <MagnifyingGlassPlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {tradeData.length} trades • Click on a trade for details
        </div>
      </div>

      {/* Visualization Container */}
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="relative w-full h-full overflow-auto">
          {tradeData.length > 0 ? (
            <div className="relative" style={{ minWidth: '800px', minHeight: '500px' }}>
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {tradeData.map((trade, index) => {
                  if (index === 0) return null;
                  const startX = (index - 1) * 400 + 175;
                  const startY = 250;
                  const endX = index * 400 + 175;
                  const endY = 250;
                  
                  return (
                    <line
                      key={`line-${trade.id}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                })}
              </svg>
              
              {/* Trade Nodes */}
              {tradeData.map((trade, index) => renderTradeNode(trade, index))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ArrowPathIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
                <p className="text-gray-600">No trades have been recorded for this league yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Team 1</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Team 2</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-4 w-4 text-gray-500" />
            <span>Players</span>
          </div>
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
            <span>Draft Picks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
