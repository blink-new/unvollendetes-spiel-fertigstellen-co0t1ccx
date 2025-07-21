import { useState, useCallback } from 'react';
import { GameState, Player, Character, CHARACTERS } from '../types/game';

const INITIAL_GRID_SIZE = 5;
const MIN_GRID_SIZE = 3;
const ROUNDS_BETWEEN_SHRINK = 3;

export function useLocalGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    round: 1,
    gridSize: INITIAL_GRID_SIZE,
    gamePhase: 'setup',
    winner: null,
    hasMovedThisRound: false
  });

  const addPlayer = useCallback((name: string, character: Character) => {
    if (gameState.players.length >= 7) return false;
    if (gameState.players.some(p => p.character.id === character.id)) return false;

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name,
      character,
      position: null,
      isEliminated: false
    };

    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));

    return true;
  }, [gameState.players]);

  const removePlayer = useCallback((playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  }, []);

  const startGame = useCallback(() => {
    if (gameState.players.length < 2) return false;

    // Place players randomly on the grid
    const positions = new Set<string>();
    const updatedPlayers = gameState.players.map(player => {
      let position;
      do {
        position = {
          x: Math.floor(Math.random() * gameState.gridSize),
          y: Math.floor(Math.random() * gameState.gridSize)
        };
      } while (positions.has(`${position.x},${position.y}`));
      
      positions.add(`${position.x},${position.y}`);
      return { ...player, position };
    });

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      gamePhase: 'playing',
      currentPlayerIndex: 0,
      hasMovedThisRound: false
    }));

    return true;
  }, [gameState.players, gameState.gridSize]);

  const movePlayer = useCallback((playerId: string, newPosition: { x: number; y: number }) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId || gameState.hasMovedThisRound) return false;

    // Check if position is valid and not occupied
    if (newPosition.x < 0 || newPosition.x >= gameState.gridSize || 
        newPosition.y < 0 || newPosition.y >= gameState.gridSize) return false;

    const isOccupied = gameState.players.some(p => 
      p.id !== playerId && 
      p.position && 
      p.position.x === newPosition.x && 
      p.position.y === newPosition.y &&
      !p.isEliminated
    );

    if (isOccupied) return false;

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, position: newPosition } : p
      ),
      hasMovedThisRound: true
    }));

    return true;
  }, [gameState.players, gameState.currentPlayerIndex, gameState.hasMovedThisRound, gameState.gridSize]);

  const endTurn = useCallback(() => {
    if (!gameState.hasMovedThisRound) return;

    const activePlayers = gameState.players.filter(p => !p.isEliminated);
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % activePlayers.length;
    let newRound = gameState.round;
    let newGridSize = gameState.gridSize;

    // Check if we completed a full round
    if (nextPlayerIndex === 0) {
      newRound++;
      
      // Shrink grid every 3 rounds
      if (newRound % ROUNDS_BETWEEN_SHRINK === 1 && newGridSize > MIN_GRID_SIZE) {
        newGridSize--;
        
        // Eliminate players outside the new grid
        const updatedPlayers = gameState.players.map(player => {
          if (player.position && 
              (player.position.x >= newGridSize || player.position.y >= newGridSize)) {
            return { ...player, isEliminated: true };
          }
          return player;
        });

        const remainingPlayers = updatedPlayers.filter(p => !p.isEliminated);
        
        setGameState(prev => ({
          ...prev,
          players: updatedPlayers,
          currentPlayerIndex: 0,
          round: newRound,
          gridSize: newGridSize,
          hasMovedThisRound: false,
          gamePhase: remainingPlayers.length <= 1 ? 'finished' : 'playing',
          winner: remainingPlayers.length === 1 ? remainingPlayers[0] : null
        }));
        return;
      }
    }

    // Find next active player
    const activePlayerIds = activePlayers.map(p => p.id);
    const currentActiveIndex = activePlayerIds.indexOf(gameState.players[gameState.currentPlayerIndex].id);
    const nextActiveIndex = (currentActiveIndex + 1) % activePlayerIds.length;
    const nextPlayerId = activePlayerIds[nextActiveIndex];
    const nextPlayerGlobalIndex = gameState.players.findIndex(p => p.id === nextPlayerId);

    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextPlayerGlobalIndex,
      round: newRound,
      hasMovedThisRound: false
    }));
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      round: 1,
      gridSize: INITIAL_GRID_SIZE,
      gamePhase: 'setup',
      winner: null,
      hasMovedThisRound: false
    });
  }, []);

  const getAvailableCharacters = useCallback(() => {
    const usedCharacterIds = gameState.players.map(p => p.character.id);
    return CHARACTERS.filter(c => !usedCharacterIds.includes(c.id));
  }, [gameState.players]);

  return {
    gameState,
    addPlayer,
    removePlayer,
    startGame,
    movePlayer,
    endTurn,
    resetGame,
    getAvailableCharacters
  };
}