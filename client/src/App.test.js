import App from "./App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { startGame, playCard, switchPlayer, restartGame } from "./Game";

jest.mock("./Game");

describe("Trading card game", () => {
  beforeEach(() => {
    startGame.mockImplementation(() => ({
      players: {
        active: {
          displayedName: "player1",
          health: 30,
          manaSlot: 1,
          activeMana: 1,
          cardsInHand: [0, 1, 2, 3],
        },
      },
    }));
  });

  describe("Initial game state", () => {
    it("it displays active player title", async () => {
      const { findByText } = render(<App />);
      const element = await findByText(/Active player: player1/i);
      expect(element).toBeInTheDocument();
    });

    it("it displays active player health as 30", async () => {
      const { findByText } = render(<App />);
      const element = await findByText(/Health: 30/i);
      expect(element).toBeInTheDocument();
    });

    it("it displays active player manaSlot as 1", async () => {
      const { findByText } = render(<App />);
      const element = await findByText(/Mana slot: 1/i);
      expect(element).toBeInTheDocument();
    });

    it("it displays active player activeMana as 1", async () => {
      const { findByText } = render(<App />);
      const element = await findByText(/Active mana: 1/i);
      expect(element).toBeInTheDocument();
    });

    // it("it displays active player cardsInHand", async () => {
    //   const {findByText} = render(<App/>);
    //   const element = await findByText(/Cards in hand: 1 2 3/i);
    //   expect(element).toBeInTheDocument();
    // });
  });

  describe("playing a 1 cost card", () => {
    beforeEach(() => {
      playCard.mockImplementation(() => ({
        players: {
          active: {
            displayedName: "player1",
            health: 30,
            manaSlot: 1,
            activeMana: 0,
            cardsInHand: [0, 2, 3],
          },
          inactive: {
            displayedName: "player2",
            health: 29,
            manaSlot: 1,
            activeMana: 1,
            cardsInHand: [0, 1, 2, 3],
          },
        },
      }));
    });

    it("the active players active mana decreases by 1", async () => {
      render(<App />);
      userEvent.click(await screen.findByTestId("test1"));
      const element = await screen.findByText(/Active mana: 0/i);
      expect(element).toBeInTheDocument();
    });

    it("the inactive players health decreases by 1", async () => {
      render(<App />);
      userEvent.click(await screen.findByTestId("test1"));
      const element = await screen.findByText(/Inactive players health: 29/i);
      expect(element).toBeInTheDocument();
    });
  });

  describe("switch player button functionality", () => {
    beforeEach(() => {
      switchPlayer.mockImplementation(() => ({
        players: {
          active: {
            displayedName: "player1",
            health: 30,
            manaSlot: 1,
            activeMana: 0,
            cardsInHand: [0, 2, 3],
          },
          inactive: {
            displayedName: "player2",
            health: 29,
            manaSlot: 1,
            activeMana: 1,
            cardsInHand: [0, 1, 2, 3],
          },
        },
      }));
    });

    it("displays switch active player as button", async () => {
      const { findByText } = render(<App />);
      const button = await findByText("Change player");
      expect(button).toBeVisible();
    });

    it("change active player", async () => {
      const { findByText } = render(<App />);
      userEvent.click(screen.getByText("Change player"));
      const element = await findByText(/Active player: player2/i);
      expect(element).toBeInTheDocument();
    })
  });

  describe("Player won the game", () => {
    beforeEach(() => {
      playCard.mockImplementation(() => ({
        players: {
          active: {
            displayedName: "player1",
            health: 30,
            manaSlot: 1,
            activeMana: 0,
            cardsInHand: [0, 2, 3],
          },
          inactive: {
            displayedName: "player2",
            health: 29,
            manaSlot: 1,
            activeMana: 1,
            cardsInHand: [0, 1, 2, 3],
          },
        },
        winner: {
          displayedName: "player1",
        },
      }));

      restartGame.mockImplementation(() => ({
        players: {
          active: {
            displayedName: "player1",
            health: 30,
            manaSlot: 0,
            activeMana: 0,
            cardsInHand: [1, 2, 3],
          },
        },
      }));
    })

    it("check does player win", async () => {
      const { findByText } = render(<App />);
      const button = await screen.findByTestId("test1");
      userEvent.click(button);
      const element = await findByText(/The winner is: player1/i);
      expect(element).toBeInTheDocument();
    });

    it("displays restart game button", async () => {
      const { findByText } = render(<App />);
      const button = await screen.findByTestId("test1");
      userEvent.click(button);
      const restartButton = await findByText("Restart game");
      expect(restartButton).toBeVisible();
    });

    it("restarting game", async () => {
      startGame.mockImplementation(() => ({
        players: {
          active: {
            displayedName: "player1",
            health: 30,
            manaSlot: 1,
            activeMana: 0,
            cardsInHand: [0, 2, 3],
          },
          inactive: {
            displayedName: "player2",
            health: 29,
            manaSlot: 1,
            activeMana: 1,
            cardsInHand: [0, 1, 2, 3],
          },
        },
        winner: {
          displayedName: "player1",
        },
      }));
      render(<App />);
      const restartButton = await screen.findByText(/Restart game/i);
      userEvent.click(restartButton);
      const element = await screen.findByText(/Active player: player1/i);
      expect(element).toBeInTheDocument();
    });
  })
});
