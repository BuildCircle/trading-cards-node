class Game {
  constructor() {
    const cards = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8];
    const player1Cards = [...cards].sort(() => Math.random() - 0.5);
    const player2Cards = [...cards].sort(() => Math.random() - 0.5);
    this.player1 = {
      displayedName: "player1",
      health: 30,
      manaSlot: 0,
      activeMana: 0,
      cards: player1Cards,
      cardsInHand: player1Cards.splice(0, 3),
    };
    this.player2 = {
      displayedName: "player2",
      health: 30,
      manaSlot: 0,
      activeMana: 0,
      cards: player2Cards,
      cardsInHand: player2Cards.splice(0, 3),
    };
    this.players = { active: this.player1, inactive: this.player2 };
    this.winner = null;
  }

  turnStart() {
    this.players.active.manaSlot += 1;
    this.players.active.activeMana = this.players.active.manaSlot;
    this.players.active.cardsInHand = [
      ...this.players.active.cardsInHand,
      this.players.active.cards.splice(0, 1)[0],
    ].sort();
    this.playPossible();
  }

  playPossible() {
    if (
      this.players.active.cardsInHand.length === 0 ||
      this.players.active.cardsInHand[0] > this.players.active.activeMana
    ) {
      this.switchPlayer();
    }
  }

  playCard(indexOfCard) {
    if (
      this.players.active.cardsInHand[indexOfCard] <=
      this.players.active.activeMana
    ) {
      this.players.inactive.health -=
        this.players.active.cardsInHand[indexOfCard];
      this.players.active.activeMana -=
        this.players.active.cardsInHand[indexOfCard];
      this.players.active.cardsInHand.splice(indexOfCard, 1);
      this.checkPlayerDead();
      this.playPossible();
    }
  }

  checkPlayerDead() {
    if (this.players.inactive.health <= 0) {
      this.winner = this.players.active;
    }
  }

  switchPlayer() {
    this.players = {
      active: this.players.inactive,
      inactive: this.players.active,
    };
    this.turnStart();
  }
}

module.exports = Game;
