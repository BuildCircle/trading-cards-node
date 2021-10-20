const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const Game = require("./index")

let game = new Game();
game.turnStart();

app.use(cors());

app.get("/", (req, res) => {
  res.json(game);
});

app.get("/playcard/:cardindex", (req, res) => {
  const oldState = game.player1.cardsInHand + game.player1.cards + game.player2.cardsInHand + game.player2.cards
  game.playCard(req.params.cardindex);
  const newState = game.player1.cardsInHand + game.player1.cards + game.player2.cardsInHand + game.player2.cards
  if(oldState !== newState) {
    res.json(game);
  } else {
    res.status(400).send({
      message: 'Move impossible!'
    })
  }
});

app.get("/changeplayer", (req, res) => {
  game.switchPlayer();
  res.json(game);
});

app.get("/restartgame", (req, res) => {
  game = new Game();
  game.turnStart();
  res.json(game);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;

// const cardIndex = req.params.cardindex;
// //GOOD VALUE = 3
// //BAD VALUE = 100
// const arrayMaxIndex = game.players.active.cardsInHand.length - 1;
// if (cardIndex <== arrayMaxIndex) {
//   game.playCard(cardIndex)
//   res.json(game)
// } else {
//   res.status.code(400).send("")
// }
