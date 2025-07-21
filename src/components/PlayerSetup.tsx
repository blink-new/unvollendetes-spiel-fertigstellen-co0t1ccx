import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Character, Player } from '../types/game';

interface PlayerSetupProps {
  players: Player[];
  availableCharacters: Character[];
  onAddPlayer: (name: string, character: Character) => boolean;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => boolean;
}

export function PlayerSetup({ 
  players, 
  availableCharacters, 
  onAddPlayer, 
  onRemovePlayer, 
  onStartGame 
}: PlayerSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleAddPlayer = () => {
    if (!playerName.trim() || !selectedCharacter) return;
    
    const success = onAddPlayer(playerName.trim(), selectedCharacter);
    if (success) {
      setPlayerName('');
      setSelectedCharacter(null);
    }
  };

  const handleStartGame = () => {
    const success = onStartGame();
    if (!success) {
      alert('You need at least 2 players to start the game!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">🍟 Fritanga Battle Royale</h1>
        <p className="text-lg text-orange-700">Add players and start the ultimate food fight!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Add New Player</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Player Name
            </label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="border-orange-300 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Choose Character
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCharacters.map((character) => (
                <div
                  key={character.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCharacter?.id === character.id
                      ? 'border-orange-500 bg-orange-100'
                      : 'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{character.emoji}</div>
                    <div className="text-sm font-medium text-orange-800">{character.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAddPlayer}
            disabled={!playerName.trim() || !selectedCharacter || players.length >= 7}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Add Player ({players.length}/7)
          </Button>
        </CardContent>
      </Card>

      {players.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Players ({players.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{player.character.emoji}</span>
                    <div>
                      <div className="font-medium text-orange-800">{player.name}</div>
                      <div className="text-sm text-orange-600">{player.character.name}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemovePlayer(player.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {players.length >= 2 && (
        <div className="text-center">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
          >
            🎮 Start Game!
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-orange-600">
        <p>• Add 2-7 players to start the game</p>
        <p>• Each player chooses a unique character</p>
        <p>• Last player standing wins!</p>
      </div>
    </div>
  );
}