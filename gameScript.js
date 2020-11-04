
let winner = "";
let  x = [];
let moves = 0;

const COMPUTER = 1;
const USER = 3;
let msgColor = "black";

// initial state
function initGame() {
  winner = "";
  moves = 0;
  msgColor = "black";
  x = [];
  x.length = 9;
  x.fill(0);
  start();
}

function restart() {
 initGame();
 renderBoard(x);
 document.getElementById("demo1").innerHTML = "Go go go !!!";
}

function firstMove() {
  // always pick corners or center cells
  const arr = [0, 2, 4, 6, 8];
  return arr[Math.floor(Math.random() * arr.length)];
}

function start() {
  // computer goes first
  playerOne(firstMove());
  checkScore(x);
}

function playerOneGo() {
  if (x.indexOf(0) !== -1 || winner.length === 0) {
    // check new move index
    const roll1 = rollDice();

    if (x[roll1] === 0) {
      playerOne(roll1);
      checkScore(x);
      moves++;
    }
  }
  if (moves > 9) {
    winner = "DRAW";
    renderResult();
    return;
  }
}

function playerTwoGo(id) {
  
  const cellId = id.slice(-1);
  
  if (x[cellId] !== 0) {
    return;
  } 

  if (x.indexOf(0) !== -1 || winner.length === 0) {
      playerTwo(cellId);
      checkScore(x);
      moves++;
  }

  if (moves < 9) {
    playerOneGo();
  } else {
    winner = "DRAW"
    renderResult();
    return;
  }
}

function nextMove(temp) {
  
  let p1=0, p2=0, idx=0, empty=3;
  for (let k=0; k<3; k++) {
        switch(x[temp[k]]) {
          case COMPUTER: p1++; empty--; break;
          case USER: p2++; empty--; break;
          case 0: idx=temp[k]; break;
        } 
      }

  if (empty <= 0) {
    return -1;
  }

  //game play
  if (p1 == 2) {
    const maxVal = idx + 2000;
    return maxVal;
  }

  //block user
  if (p2 == 2) {
    const maxVal = idx + 1000;
    return maxVal;
  }

  return idx;
  
}

// make the next optimal move for the Computer/playerOne
function rollDice() {
  let possibleMoves = [];

  const flag1 = checkAllPlayed(x[0],x[4],x[8]);
  if (!flag1) {
    const temp = [0,4,6];
    const val = nextMove(temp);
    if (val !== -1) {
      possibleMoves.push(val);
    }
  }

  const flag2 = checkAllPlayed(x[2],x[4],x[6]);
  if (!flag2) {
    const temp = [2,3,6];
    const val = nextMove(temp);
    if (val !== -1) {
      possibleMoves.push(val);
    }
  }

  for (let i = 0; i<=6; i+=3) {
    const flag = checkAllPlayed(x[i],x[i+1],x[i+2]);
    if (!flag) {
      const val = nextMove([i,i+1,i+2]);
      if (val !== -1) {
        possibleMoves.push(val);
      }
    }
  }

  for (let j = 0; j<=3; j++) {
    const flag = checkAllPlayed(x[j],x[j+3],x[j+6]);
    if (!flag) {
      const val = nextMove([j,j+3,j+6]);
      if (val !== -1) {
        possibleMoves.push(val);
      }
    }
  }

  // choose game play or block user
  let cellIndex = Math.max( ...possibleMoves );
  
  if ( cellIndex >= 2000) {
    cellIndex = cellIndex - 2000;
  } else if ( cellIndex >= 1000) {
    cellIndex = cellIndex - 1000;
  } else {
    cellIndex = possibleMoves[0]; // diagonal choice
  }

  return cellIndex;

}

// put down score values for the players
function playerOne(idx) {
  x[idx] = COMPUTER;
}
function playerTwo(idx) {
  x[idx] = USER;
}


function checkScore(x) {
  // check for the row or column with two filled spaces
  // rows start index with 0, 3, 6,  +1 to get next index in the row
  // columns start index with 0, 1, 2,  +3 to get next index in the column
  // diagonal start index with 0, 2  +4/+2 to get next index in the diagonal

  let score = [];
  score.length = 8;
  score.fill(0);
  let k = 0;

  score[6] = x[0] + x[4] + x[8];
  const win2 = findWinner(score[6], x[0], x[4], x[8]);
  if (win2) {
      renderResult();
      return;
    }
  
  score[7] = x[2] + x[4] + x[6];
  const win3 = findWinner(score[7], x[2], x[4], x[6]);
  if (win3) {
      renderResult();
      return;
    }

  for (let i = 0; i<=6; i+=3, k++) {
    score[k] = x[i]+x[i+1]+x[i+2];
    const win = findWinner(score[k], x[i], x[i+1], x[i+2]);
    if (win) {
      renderResult();
      return;
    }
  }
  for (let j = 0; j<=3; j++, k++) {
    score[k] = x[j]+x[j+3]+x[j+6];
    const win1 = findWinner(score[k], x[j], x[j+3], x[j+6]);
    if (win1) {
      renderResult();
      return;
    }
  }
}

function findWinner(value, x1, x2, x3) {
  const flag = checkAllPlayed(x1, x2, x3);
    if (flag && (value === 3)) {
      winner = "COMPUTER";
      msgColor = "crimson";
    } else if (flag && (value === 9)){
      winner = "YOU";
      msgColor = "turquoise";
    } else {
      renderBoard(x);
    }
  return winner;
}

function checkAllPlayed(x1,x2,x3) {
  if (x1 === 0 || x2 === 0 || x3 === 0) {
      return false;
    }
    return true;
}

function renderResult() {
  document.getElementById("demo1").innerHTML = winner + " wins !!";
  document.getElementById("demo1").style.color = msgColor;
  setTimeout(restart, 1800);
}

function renderBoard(x) {
  for (i=0; i<9; i++) {
    const idValue = "cell-"+i;
    let color = "";
    let val = " ";
    if (x[i] === COMPUTER) {
      val = "X";
      color = "crimson";
    } else if (x[i] === USER) {
      val = "O";
      color = "turquoise";
    }
    document.getElementById(idValue).innerHTML = val;
    document.getElementById(idValue).style.color = color;
  }
}
