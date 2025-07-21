export interface Character {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export interface Player {
  id: string;
  name: string;
  character: Character;
  position: { x: number; y: number } | null;
  isEliminated: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  gridSize: number;
  gamePhase: 'setup' | 'playing' | 'finished';
  winner: Player | null;
  hasMovedThisRound: boolean;
}

export const CHARACTERS: Character[] = [
  { id: 'fries', name: 'Fritanga Fries', color: '#FFD700', emoji: '🍟' },
  { id: 'burger', name: 'Burger Boss', color: '#FF6B35', emoji: '🍔' },
  { id: 'hotdog', name: 'Hot Dog Hero', color: '#FF4757', emoji: '🌭' },
  { id: 'pizza', name: 'Pizza Power', color: '#FF6348', emoji: '🍕' },
  { id: 'taco', name: 'Taco Thunder', color: '#FFA502', emoji: '🌮' },
  { id: 'chicken', name: 'Chicken Champion', color: '#FF7675', emoji: '🍗' }
];