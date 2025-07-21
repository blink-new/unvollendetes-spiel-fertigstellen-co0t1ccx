import { useLocalGame } from './hooks/useLocalGame';
import { PlayerSetup } from './components/PlayerSetup';
import { GameView } from './components/GameView';
import './App.css';

function App() {
  const {
    gameState,
    addPlayer,
    removePlayer,
    startGame,
    movePlayer,
    endTurn,
    resetGame,
    getAvailableCharacters
  } = useLocalGame();

  if (gameState.gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <PlayerSetup
          players={gameState.players}
          availableCharacters={getAvailableCharacters()}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onStartGame={startGame}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
      <GameView
        gameState={gameState}
        onMovePlayer={movePlayer}
        onEndTurn={endTurn}
        onResetGame={resetGame}
      />
    </div>
  );
}

export default App;