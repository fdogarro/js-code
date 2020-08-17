(() => {
  /*** ui btn elements */
  const startGameBTN = document.querySelector("#start-game-btn");
  const hitBTN = document.querySelector("#hit-btn");
  const stayBTN = document.querySelector("#stay-btn");

  /*** player elements */
  const playerScore = document.querySelector("#player-score");
  const playerStatus = document.querySelector("#player-status");

  /*** computer elements */
  const computerScore = document.querySelector("#computer-score");
  const computerStatus = document.querySelector("#computer-status");

  /*** game over elements */
  const gameOverText = document.querySelector("#game-over");

  /*** game state */
  const game = {
    players: [],
    deck: [],
    status: ""
  };

  /**
   * initialize and reset game
   */

  const startGame = () => {
    resetGameValues();

    const dealersDeck = buildDeck();
    const shuffledDeck = shuffleDeck(dealersDeck);
    const players = createPlayers(2);
    deal(players, shuffledDeck, 2);

    game.players = players;
    game.deck = shuffledDeck;

    checkScores();

    hitBTN.removeAttribute("disabled", "");
    stayBTN.removeAttribute("disabled", "");
  };

 /**
  * When a player takes a hit a card is also dealt to the computer and scores are checked
  */
  const hit = () => {
    deal(game.players, game.deck, 1);
    checkScores();
  };

  /**
   * When a player clicks stay scores are checked and displayed, and the game is over.
   */
  const stay = () => {
    game.status = "Stay";
    checkScores();
  };

  /**
   * create deck
   */
  const buildDeck = () => {
    const deck = [];
    const suits = ["Clubs", "Hearts", "Diamonds", "Spades"];
    const values = [2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K", "A"];
    let faceValue = null;

    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        if (values[i] === "J" || values[i] === "Q" || values[i] === "K") {
          faceValue = 10;
        } else if (values[i] === "A") {
          faceValue = 11;
        } else {
          faceValue = values[i];
        }
        const card = { value: values[i], suit: suits[j], faceVal: faceValue };
        deck.push(card);
      }
    }
    return deck;
  };

  /**
   *
   * @param {*} deck
   * shuffle deck
   */
  const shuffleDeck = deck => {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
    return deck;
  };

  /**
   *
   * @param {*} count
   * create new players
   */
  const createPlayers = count => {
    const players = [];

    for (let i = 1; i <= count; i++) {
      const hand = [];
      const player = {
        name: `Player ${i}`,
        score: 0,
        hand,
        status: ""
      };
      players.push(player);
    }

    return players;
  };

  /**
   *
   * @param {*} players
   * @param {*} deck
   * @param {*} cardCount
   * Deal cards
   */
  const deal = (players, deck, cardCount) => {
    for (let i = 0; i < cardCount; i++) {
      for (let j = 0; j < players.length; j++) {
        const card = deck.pop();
        players[j].hand.push(card);
        players[j].score = players[j].score + card.faceVal;
      }
    }
    return players;
  };

  /**
   * reset game values and ui
   */
  const resetGameValues = () => {
    game.players = [];
    game.deck = [];
    game.status = "";
    gameOverText.innerText = "";
    playerScore.innerText = "";
    playerStatus.innerText = "";
    computerScore.innerText = "";
    computerStatus.innerText = "";
  };

  /**
   * Check whether a person is Busted or a Winner
   */

  const checkScores = () => {
    const players = game.players;
    for (let i = 0; i < players.length; i++) {
      if (players[i].score > 21) {
        // players[i].status = "Busted";
        aceCheck(players[i])
      }

      if (players[i].score === 21) {
        players[i].status = "Winner";
      }
    }

    statusUpdate();
  };

  /**
   * Change value of ace if person is busted
   * @param {*} player 
   */
  const aceCheck = player => {
      for (let i = 0; i < player.hand.length; i++){
          if(player.hand[i].value === 'A'){
              player.hand[i].faceVal = 1;
              player.score -= 10;
              player.status = '';
              console.log("Ace Check", player.score, player)
          }
          
      }

      if(player.score > 21){
          player.status = 'Busted';
      }
  };

/**
 * Update the status for the game
 */
  const statusUpdate = () => {
    const player = game.players[0];
    computerScore.innerText = "(Hidden)";

    gameStatus();
    stayGameStatus();

    playerScore.innerText = player.score;
    playerStatus.innerText = player.status;
  };

  /**
   * Game status if a person has not clicked Stay
   */

  const gameStatus = () => {
    const player = game.players[0];
    const computer = game.players[1];
    if (
      (game.status !== "Stay" && player.status !== "") ||
      (game.status !== "Stay" && computer.status !== "")
    ) {
      computerScore.innerText = computer.score;
      computerStatus.innerText = computer.status;
      gameOver();
    }
  };

  /**
   * Game status if a player clicks stay
   */

  const stayGameStatus = () => {
    const player = game.players[0];
    const computer = game.players[1];
    if (game.status === "Stay") {
      if (player.score > computer.score) {
        player.status = "Winner";
        computer.status = "";
      } else if (computer.score > player.score) {
        computer.status = "Winner";
        player.status = "";
      } else {
        player.status = "Winner";
        computer.status = "Winner";
      }

      computerScore.innerText = computer.score;
      computerStatus.innerText = computer.status;

      gameOver();
    }
  };

  /**
   * status update when the game is over
   */

  const gameOver = () => {
    gameOverText.innerText = "Game Over";
    hitBTN.setAttribute("disabled", "");
    stayBTN.setAttribute("disabled", "");
  };

  /** 
   * Event Listeners for UI Buttons
   */
  startGameBTN.addEventListener("click", startGame);
  hitBTN.addEventListener("click", hit);
  stayBTN.addEventListener("click", stay);
})();
