import "./App.css";
import { useState, useEffect } from "react";
import { startGame, playCard, switchPlayer, restartGame } from "./Game";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Card, ListGroup, ListGroupItem } from 'react-bootstrap';

function App() {
  const [game, setGame] = useState({});
  const [impossibleMove, setImpossibleMove] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const fetchedGame = await startGame();
      setGame(fetchedGame);
    }
    fetchData();
  }, []);

  const handlePlayCard = async (cardIndex) => {
    const fetchedGame = await playCard(cardIndex);

    if (fetchedGame.message) {
      setImpossibleMove(true)
      setTimeout(() => setImpossibleMove(false), 1500)
    } else {
      setGame(fetchedGame)
      setImpossibleMove(false)
    }
  };

  const handleChangePlayer = async () => {
    const fetchedGame = await switchPlayer();
    setGame(fetchedGame);
    setImpossibleMove(false)
  };

  const handleRestartGame = async () => {
    const fetchedGame = await restartGame();
    setGame(fetchedGame);
    setImpossibleMove(false)
  }

  if (game.winner) {
    return (
      <>
        <div>The winner is: {game.winner?.displayedName}</div>
        <button onClick={() => {handleRestartGame()}}>Restart game</button>
      </>
    )
  }

  return (
    <div className="App">
      {game.players && (
        <Card style={{ width: '18rem' }}>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Active player: {game.players?.active.displayedName}</ListGroupItem>
            <ListGroupItem>Health: {game.players?.active.health}</ListGroupItem>
            <ListGroupItem>Mana slot: {game.players?.active.manaSlot}</ListGroupItem>
            <ListGroupItem>Active mana: {game.players?.active.activeMana}</ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Button
              variant='secondary'
              className='m-2'
              onClick={() => handleChangePlayer()}
            >
              Change player
            </Button>
          </Card.Body>
        </Card>
      )}
      {game.players?.inactive && (
        <Card style={{ width: '18rem' }}>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Inactive player: {game.players.inactive.displayedName}</ListGroupItem>
            <ListGroupItem>Inactive players health: {game.players.inactive.health}</ListGroupItem>
          </ListGroup>
        </Card>
      )}
      <div className="active-player-info">
        {game.players && (
          <>
            <div>
              <h3>Cards in hand:</h3>
              {game.players?.active.cardsInHand.map((card, index) => {
                // return <button key={index} title="card">{card}</button>
                return (
                  < Button
                    className='m-1'
                    key={index}
                    value={index}
                    data-testid={`test${index}`}
                    onClick={(e) => handlePlayCard(e.target.value)}
                  >
                    {card}
                  </Button>
                );
              })}
              {impossibleMove &&
                <Alert className='m-2' variant='danger'>Impossible move!</Alert>
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
};

export default App;
/*
if (game.winner) {
  return (
    <>
      <div>The winner is: {game.winner?.displayedName}</div>
      <button onClick={() => {handleRestartGame()}}>Restart game</button>
    </>
  )
}

return (
  <div className="App">
    <div className="active-player-info">
      {game.players && (
        <>
          <h1>Active player: {game.players?.active.displayedName}</h1>
          <h3>Health: {game.players?.active.health}</h3>
          <h3>Mana slot: {game.players?.active.manaSlot}</h3>
          <h3>Active mana: {game.players?.active.activeMana}</h3>
          <h3>Cards in hand:</h3>
          <div>
            {game.players?.active.cardsInHand.map((card, index) => {
              // return <button key={index} title="card">{card}</button>
              return (
                < Button
                  className='m-1'
                  key={index}
                  value={index}
                  data-testid={`test${index}`}
                  onClick={(e) => handlePlayCard(e.target.value)}
                >
                  {card}
                </Button>
              );
            })}
            {impossibleMove &&
              <Alert className='m-2' variant='danger'>Impossible move!</Alert>
            }
          </div>
        </>
      )}
      <Button
        variant='secondary'
        className='m-2'
        onClick={() => handleChangePlayer()}
      >
        Change player
      </Button>
      {game.players?.inactive && (
        <>
          <h1>Inactive player: {game.players.inactive.displayedName}</h1>
          <h3>Inactive players health: {game.players.inactive.health}</h3>
        </>
      )}
    </div>
  </div>
)
};
*/
