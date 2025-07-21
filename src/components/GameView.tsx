import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { GameBoard } from './GameBoard';
import { GameState } from '../types/game';

interface GameViewProps {
  gameState: GameState;
  onMovePlayer: (playerId: string, position: { x: number; y: number }) => boolean;
  onEndTurn: () => void;
  onResetGame: () => void;
}

export function GameView({ gameState, onMovePlayer, onEndTurn, onResetGame }: GameViewProps) {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  const eliminatedPlayers = gameState.players.filter(p => p.isEliminated);

  const handleCellClick = (x: number, y: number) => {
    if (!currentPlayer || gameState.hasMovedThisRound) return;
    
    // If clicking on current player's position, do nothing (they're already there)
    if (currentPlayer.position?.x === x && currentPlayer.position?.y === y) return;
    
    onMovePlayer(currentPlayer.id, { x, y });
  };

  if (gameState.gamePhase === 'finished') {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Card className="border-4 border-yellow-400 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-4xl text-yellow-600">🏆 Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState.winner && (
              <div className="space-y-4">
                <div className="text-6xl">{gameState.winner.character.emoji}</div>
                <h2 className="text-3xl font-bold text-yellow-700">
                  {gameState.winner.name} Wins!
                </h2>
                <p className="text-xl text-yellow-600">
                  Playing as {gameState.winner.character.name}
                </p>
                <Badge className="text-lg px-4 py-2 bg-yellow-500 text-white">
                  Champion of Fritanga!
                </Badge>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-lg text-yellow-700">Final Stats:</p>
              <p className="text-yellow-600">Rounds Survived: {gameState.round}</p>
              <p className="text-yellow-600">Final Grid Size: {gameState.gridSize}x{gameState.gridSize}</p>
            </div>

            <Button
              onClick={onResetGame}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            >
              🎮 Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">🍟 Fritanga Battle Royale</h1>
        <div className="flex justify-center space-x-4 text-lg">
          <Badge className="bg-orange-500 text-white">Round {gameState.round}</Badge>
          <Badge className="bg-blue-500 text-white">Grid: {gameState.gridSize}x{gameState.gridSize}</Badge>
          <Badge className="bg-green-500 text-white">{activePlayers.length} Players Left</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <GameBoard
                gridSize={gameState.gridSize}
                players={gameState.players}
                currentPlayerId={currentPlayer?.id || ''}
                onCellClick={handleCellClick}
                hasMovedThisRound={gameState.hasMovedThisRound}
              />
              
              <div className="mt-6 text-center space-y-3">
                <Button
                  onClick={onEndTurn}
                  disabled={!gameState.hasMovedThisRound}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                >
                  End Turn
                </Button>
                
                <div>
                  <Button
                    onClick={onResetGame}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Reset Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Panel */}
        <div className="space-y-4">
          {/* Active Players */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Active Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border-2 ${
                    player.id === currentPlayer?.id
                      ? 'border-orange-500 bg-orange-100'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{player.character.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-orange-800">{player.name}</div>
                      <div className="text-sm text-orange-600">{player.character.name}</div>
                      {player.position && (
                        <div className="text-xs text-orange-500">
                          Position: ({player.position.x}, {player.position.y})
                        </div>
                      )}
                    </div>
                    {player.id === currentPlayer?.id && (
                      <Badge className="bg-orange-500 text-white">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Eliminated Players */}
          {eliminatedPlayers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Eliminated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {eliminatedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-2 rounded-lg bg-red-50 border border-red-200 opacity-75"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg grayscale">{player.character.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-red-700">{player.name}</div>
                        <div className="text-xs text-red-500">{player.character.name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-blue-700">
                <strong>Round:</strong> {gameState.round}
              </p>
              <p className="text-blue-700">
                <strong>Grid Size:</strong> {gameState.gridSize}x{gameState.gridSize}
              </p>
              <p className="text-blue-700">
                <strong>Next Shrink:</strong> Round {Math.ceil(gameState.round / 3) * 3 + 1}
              </p>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-600">
                💡 The grid shrinks every 3 rounds. Players outside the grid are eliminated!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}