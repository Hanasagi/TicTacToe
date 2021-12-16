<template>
  <div id="game">
    <h1 ref="h1" class="blur">Tic Tac Toe</h1>
    <div ref="chooseSide" class="menu">
      <h2>Choose your side</h2>
      <span class="sideCard">
        <button @click="setSide">
          <svg ref="circle" data-text="o" class="placeholder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" />
          </svg>
        </button>
        <button @click="setSide">
          <svg ref="cross" data-text="x" class="placeholder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" />
          </svg>
        </button>
      </span>
    </div>
    <div ref="endGame" class="menu" style="display:none;">
      <span class="endCard">
        <h2 ref="placeholderText" class="placeholder-text">Placeholder</h2>
        <button class="replay" @click="replay">Replay</button>
      </span>
    </div>
    <div class="board blur" ref="board">
      <div class="board-cell" :id="boardIndex-1" v-for="boardIndex in 9" :key="boardIndex" @click="playerMove"></div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'TicTacToe',
  data(){
    return{
      playerSide:"",
      cpuSide:"",
      boardStateCopy:"",
      lastMoveCopy:""
    }
  },
  methods:{
    setSide(e) {
       let svg = e.target.children[0];
       if (svg.getAttribute("data-text") === "o") {
         this.playerSide = svg;
         this.cpuSide = this.$refs.cross;
       } else {
         this.playerSide = svg;
         this.cpuSide = this.$refs.circle;
       }
       this.$store.commit('updateMatchId', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
       this.boardStateCopy = Object.assign([], this.$store.state.boardState);
       this.lastMoveCopy = Object.assign({}, this.$store.state.lastMove);
       this.hideChooseSide();
     },
     hideChooseSide() {
       this.$refs.chooseSide.style.display = "none";
       this.$refs.h1.classList.remove("blur");
       this.$refs.board.classList.remove("blur");
       this.$refs.board.style.pointerEvents = "initial";
     },
     showChooseSide() {
       this.$refs.chooseSide.style.display = "initial";
       this.$refs.h1.classList.add("blur");
       this.$refs.board.classList.add("blur");
       this.$refs.board.style.pointerEvents = "none";
     },
     playerMove(e) {
       if (this.$store.state.boardState[e.target.id] !== "-") return;
       console.log("player plays");
       let svg = this.cloneSVG("player")
       e.target.append(svg);
       this.updateState(e, this.playerSide)
       this.cpuMove();
     },
     cloneSVG(side) {
       let checkSide = this.checkSide(side);
       let svg = checkSide[0];
       let path = checkSide[1];
       svg.style.display = "block";
       svg.append(path);
       return svg;
     },
     cpuMove() {
       this.$refs.board.style.pointerEvents = "none";
       setTimeout(() => {
         console.log("cpu plays");
         let bestMove = this.findBestMove(this.$store.state.boardState);
         console.log(bestMove)
         let svg = this.cloneSVG("cpu");
         if (bestMove.index !== undefined)
           this.$refs.board.children[bestMove.index].append(svg);
         if (this.$store.state.boardState.filter(e => e === "-") === 0 || this.evaluateScore(this.playerSide.getAttribute("data-text")) || this.evaluateScore(this.cpuSide.getAttribute("data-text"))) {
           if (bestMove.score === 1 || bestMove.score === -1 || bestMove.score === 0 && bestMove.index === undefined) {
             setTimeout(() => {
               this.stopGame(bestMove.score)
             }, 500);
             return;
           }
         }
         this.updateState(bestMove.index, this.cpuSide)
         this.$refs.board.style.pointerEvents = "initial";
       }, 1000)

     },
     async updateState(e, side) {
         let id;
         if (e.target !== undefined) {
           id = e.target.id
         } else if (e.id !== undefined) {
           id = e.id;
         } else {
           id = e;
         }
         await this.$store.commit("updateBoardState", [id, side.getAttribute("data-text")])
         await this.$store.commit("updateLastMove", [side.getAttribute("data-text"), id])
       },
       checkSide(side) {
         let svg;
         let path;
         if (side === "player") {
           svg = this.playerSide.cloneNode();
           path = this.playerSide.children[0].cloneNode()
         } else if (side === "cpu") {
           svg = this.cpuSide.cloneNode();
           path = this.cpuSide.children[0].cloneNode()
         }
         return [svg, path];
       },
       evaluateScore(board, currentPlayer) {
         //Check columns for wins
         if (board[0] === currentPlayer && board[3] === currentPlayer && board[6] === currentPlayer ||
           board[1] === currentPlayer && board[4] === currentPlayer && board[7] === currentPlayer ||
           board[2] === currentPlayer && board[5] === currentPlayer && board[8] === currentPlayer) {
           return true;
         }

         //Check rows for wins
         if (board[0] === currentPlayer && board[1] === currentPlayer && board[2] === currentPlayer ||
           board[3] === currentPlayer && board[4] === currentPlayer && board[5] === currentPlayer ||
           board[6] === currentPlayer && board[7] === currentPlayer && board[8] === currentPlayer) {
           return true;
         }
         //Check diagonals for wins
         if (board[0] === currentPlayer && board[4] === currentPlayer && board[8] === currentPlayer) {
           return true;
         }
         if (board[2] === currentPlayer && board[4] === currentPlayer && board[6] === currentPlayer) {
           return true;
         }
         return false;
       },

       minMax(board, isMax, currentPlayer) {
         let emptyCells = board.filter(e => typeof e === "number")
         let allTest = [];
         if (this.evaluateScore(board, this.playerSide.getAttribute("data-text"))) {
           return {
             score: -1
           };
         } else if (this.evaluateScore(board, this.cpuSide.getAttribute("data-text"))) {
           return {
             score: 1
           };
         } else if (emptyCells.length === 0) {
           return {
             score: 0
           };
         }
         for (let i = 0; i < emptyCells.length; i++) {
           let currentTest = {}
           currentTest.index = board[emptyCells[i]]
           board[emptyCells[i]] = currentPlayer;
           if (isMax) {
             let result = this.minMax(board, !isMax, this.cpuSide.getAttribute("data-text"))
             currentTest.score = result.score;
           } else if (!isMax) {
             let result = this.minMax(board, !isMax, this.playerSide.getAttribute("data-text"))
             currentTest.score = result.score;
           }

           board[emptyCells[i]] = currentTest.index;
           allTest.push(currentTest)
         }

         let bestTest;
         if (isMax) {
           let bestScore = Infinity;
           for (let i = 0; i < allTest.length; i++) {
             if (allTest[i].score < bestScore) {
               bestScore = allTest[i].score;
               bestTest = i;
             }
           }
         } else if (!isMax) {
           let bestScore = -Infinity;
           for (let i = 0; i < allTest.length; i++) {
             if (allTest[i].score > bestScore) {
               bestScore = allTest[i].score;
               bestTest = i;
             }
           }
         }
         return allTest[bestTest];
       },
       findBestMove(board) {
         //let bestVal = 1000;
         let moveBoard = Object.assign([], board);
         for (let i = 0; i < moveBoard.length; i++) {
           if (moveBoard[i] === "-") {
             moveBoard[i] = i;
           }
         }
         return this.minMax(moveBoard, false, this.cpuSide.getAttribute("data-text"));
       },
       stopGame(score) {
         let text;
         if (score === 1) {
           text = "You lost"
         } else if (score === -1) {
           text = "You won"
         } else {
           text = "Draw"
         }
         this.$refs.endGame.children[0].children[0].innerText = text;
         this.$refs.endGame.style.display = "initial";
         this.$refs.board.classList.add("blur");
         this.$refs.board.style.pointerEvents = "none";
       },
       replay() {
         let cells = document.querySelectorAll(".board-cell");
         console.log(cells)
         for (let i = 0; i < cells.length; i++) {
           if (cells[i].children[0] !== undefined)
             cells[i].children[0].remove();

         }
         this.$store.commit("resetBoardState", this.boardStateCopy)
         this.$store.commit("resetLastMove", this.lastMoveCopy)
         this.playerSide = "";
         this.cpuSide = "";
         this.$refs.endGame.style.display = "none";
         this.showChooseSide();
       }
    }
  }

</script>

<style scoped lang="scss">
$background: #1b2021;
$border: #ed6a5a;
$border-width: 10px;
$text-main: #f4f1bb;
$text-second: #9bc1bc;

#game {
  background: $background;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  font-size: 3em;
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  font-weight: lighter;
  color: $text-main;
  transition: filter 0.3s ease;
}

.menu {
  background: $background;
  width: 50vw;
  position: absolute;
  margin: auto;
  color: $text-main;
  z-index: 10;
  box-shadow: 0 0 10px black;

  &>h2 {
    text-align: center;
    font-size: 2em;
  }

  &>.sideCard {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &>.sideCard>button {
    margin: 2em 2em;
    background: none;
    border: none;
    cursor: pointer;

    &:hover>svg {
      fill: $border;
    }
  }

  &>.endCard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &>.endCard>.replay {

    width: 10ch;
    cursor: pointer;
    background: $border;
    border: none;
    color: white;
    font-size: 3em;
    padding: 0.5em;
    margin: 1em;
  }

  &>.endCard>.placeholder-text {
    font-size: 3em;
    text-align: center;
  }
}

.blur {
  filter: blur(20px);
}

.board {
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: auto;
  width: 50em;
  height: 50em;
  transition: filter 0.3s ease;

  &>.board-cell {
    cursor: pointer;
    background: $background;
    width: auto;
    height: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  z-index: 5;
}

.board-cell:nth-child(4) {
  border-top: $border-width solid;
  border-bottom: $border-width solid;
  border-color: $border;
}

.board-cell:nth-child(5) {
  border: $border-width solid;
  border-color: $border;
}

.board-cell:nth-child(6) {
  border-top: $border-width solid;
  border-bottom: $border-width solid;
  border-color: $border;
}

.board-cell:nth-child(2) {
  border-left: $border-width solid;
  border-right: $border-width solid;
  border-color: $border;
}

.board-cell:nth-child(8) {
  border-left: $border-width solid;
  border-right: $border-width solid;
  border-color: $border;
}

.placeholder {
  pointer-events: none;
  width: 10em;
  height: 10em;
  fill: $text-second;
  transition: fill 0.3s ease-out;
}

@media screen and (max-width: 1300px) {
  #game {
    font-size: 10px;
  }
  .menu{
    width:90vw
  }
  .board{
    width:90vw;
    height:90vw;
  }
  .placeholder{
    width:23vw;
    height:23vw;
  }
}

</style>
