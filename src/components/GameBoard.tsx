import { Player } from '../types/game';

interface GameBoardProps {
  gridSize: number;
  players: Player[];
  currentPlayerId: string;
  onCellClick: (x: number, y: number) => void;
  hasMovedThisRound: boolean;
}

export function GameBoard({ gridSize, players, currentPlayerId, onCellClick, hasMovedThisRound }: GameBoardProps) {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  const getPlayerAtPosition = (x: number, y: number) => {
    return players.find(p => p.position?.x === x && p.position?.y === y && !p.isEliminated);
  };

  const isValidMove = (x: number, y: number) => {
    if (hasMovedThisRound) return false;
    if (!currentPlayer?.position) return false;
    
    const dx = Math.abs(x - currentPlayer.position.x);
    const dy = Math.abs(y - currentPlayer.position.y);
    
    // Can move to adjacent cells (including diagonally) or stay in place
    return dx <= 1 && dy <= 1;
  };

  const getCellClass = (x: number, y: number) => {
    const player = getPlayerAtPosition(x, y);
    const isCurrentPlayerCell = player?.id === currentPlayerId;
    const isValidMoveCell = isValidMove(x, y) && !player;
    
    let baseClass = "w-16 h-16 border-2 border-orange-300 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 ";
    
    if (isCurrentPlayerCell) {
      baseClass += "bg-orange-400 border-orange-600 ring-4 ring-orange-200 scale-110 ";
    } else if (player) {
      baseClass += "bg-orange-200 border-orange-400 ";
    } else if (isValidMoveCell) {
      baseClass += "bg-green-100 border-green-300 hover:bg-green-200 ";
    } else {
      baseClass += "bg-orange-50 hover:bg-orange-100 ";
    }
    
    return baseClass;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="grid gap-1 p-4 bg-orange-100 rounded-lg border-4 border-orange-300"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const player = getPlayerAtPosition(x, y);
          
          return (
            <div
              key={`${x}-${y}`}
              className={getCellClass(x, y)}
              onClick={() => onCellClick(x, y)}
              style={{ backgroundColor: player ? player.character.color + '40' : undefined }}
            >
              {player && (
                <span style={{ color: player.character.color }}>
                  {player.character.emoji}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {currentPlayer && (
        <div className="text-center">
          <p className="text-lg font-semibold text-orange-800">
            {currentPlayer.name}'s Turn ({currentPlayer.character.name})
          </p>
          {hasMovedThisRound ? (
            <p className="text-sm text-green-600">Move completed! Click "End Turn" to continue.</p>
          ) : (
            <p className="text-sm text-orange-600">
              Click on your character, then click on an adjacent cell to move.
            </p>
          )}
        </div>
      )}
    </div>
  );
}