const Game = require("../index")

describe("trading cards", () => {
    describe("initialise a game with two players", () => {
        let game;
        beforeEach(() => {
            game = new Game();
        });

        it("each with 30 health", () => {
            expect(game.player1.health).toBe(30)
            expect(game.player2.health).toBe(30)
        });

        it("each with 0 mana slots", () => {
            expect(game.player1.manaSlot).toBe(0)
            expect(game.player2.manaSlot).toBe(0)
        });

        it("each with 0 active mana", () => {
            expect(game.player1.activeMana).toBe(0)
            expect(game.player2.activeMana).toBe(0)
        });

        it("each having the expected 20 mana cards", () => {
            const expectedCards = [0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8]
            expect([...game.player1.cards, ...game.player1.cardsInHand].sort()).toEqual(expectedCards)
            expect([...game.player2.cards, ...game.player2.cardsInHand].sort()).toEqual(expectedCards)
        });

        it("each having 3 cards in hand", () => {
            expect(game.player1.cardsInHand.length).toBe(3)
            expect(game.player2.cardsInHand.length).toBe(3)
        });

        it("activePlayer is player1", () => {
            expect(game.players.active).toBe(game.player1)
        });        
    });

    describe("on game start", () => {
        let game;
        beforeEach(() => {
            game = new Game();
            game.player1.cardsInHand = [0,4,6]
            game.turnStart();
        });

        it("the active player's mana slot has increased by 1", () => {
            expect(game.player1.manaSlot).toBe(1)
        });

        it("the active player's active mana is refilled", () => {
            expect(game.player1.activeMana).toBe(1)
        });

        it("the active player's receives 1 more card", () => {
            expect(game.player1.cardsInHand.length).toBe(4)
        });

        it("the active player's cards are sorted", () => {
            expect(game.player1.cardsInHand).toBe(game.player1.cardsInHand.sort())
        });

        it("the active player's deck size is reduced by 1", () => {
            expect(game.player1.cards.length).toBe(16)
        });
    });

    describe("on main part of turn", () => {
        let game;
        beforeEach(() => {
            game = new Game();
            game.player1.manaSlot = 1
            game.player1.activeMana = 1
        });

        it("switches player if you don't have sufficient mana to play any cards", () => {
            game.player1.cardsInHand = [3,4,6]
            game.player2.cardsInHand = [0,4,6]
            game.playPossible();
            expect(game.players.active).toBe(game.player2)
        });

        it("switches player if you have no cards left in hand", () => {
            game.player1.cardsInHand = []
            game.player2.cardsInHand = [0]
            game.playPossible();
            expect(game.players.active).toBe(game.player2)
        })

        it("doesn't switch player if cards can be played", () => {
            game.player1.cardsInHand = [0,4,6]
            game.playPossible();
            expect(game.players.active).toBe(game.player1)
        });

        it("doesn't play a card if the player tries to play a card without sufficient mana", () => {
            game.player1.cardsInHand = [0,3,4,6]
            const numberOfCards = game.player1.cardsInHand.length
            game.playCard(1);
            expect(game.player1.cardsInHand.length).toBe(numberOfCards)
        });

        it("if a player decides to skip their turn, the active player switches", () => {
            game.player1.cardsInHand = [0]
            game.player2.cardsInHand = [0]
            game.switchPlayer();
            expect(game.players.active).toBe(game.player2)
        })

        describe("successfully played a card", () => {
            it("player2 health is reduced", () => {
                game.player1.cardsInHand = [0,1,4,6]
                const healthBefore = game.player2.health;
                const cardValue = game.player1.cardsInHand[1]
                game.playCard(1);
                expect(game.player2.health).toBe(healthBefore - cardValue)
            });

            it("player1 activeMana is reduced", () => {
                game.player1.cardsInHand = [0,1,4,6]
                const activeManaBefore = game.player1.activeMana;
                const cardValue = game.player1.cardsInHand[1]
                game.playCard(1);
                expect(game.player1.activeMana).toBe(activeManaBefore - cardValue)
            });

            it("chosen card is removed from cardInHand", () => {
                game.player1.cardsInHand = [0,1,4,6]
                game.playCard(1);
                expect(game.player1.cardsInHand).toMatchObject([0,4,6])
            });

            it("other played died", () => {
                game.player1.cardsInHand = [1,4,6]
                game.player2.health = 1
                game.playCard(0);
                expect(game.winner).toBe(game.player1)
            });
        })
    });
});
