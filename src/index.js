import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // For each row, for each column, output a square.
    return (
      <div>
        {[...Array(3)].map((v, j) =>
          <div key={`row-${j}`} className="board-row">
            {[...Array(3)].map((v, i) => this.renderSquare(i + (j * 3)))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const winner = calculateWinner(current.squares);

    // Exit early if game over, or if someone already clicked on this square.
    if (winner !== null || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{ squares, changedSquare: i }]),
      // It's correct that we're using the length of the history array before
      // concatenating the current move on, because this is an index into the
      // history array, and the array is zero-indexed.
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
     });
  }

  jumpTo(moveIdx) {
    // Slice is end exclusive, so +1 to include the move we're jumping to.
    const history = this.state.history.slice(0, moveIdx + 1);
    const stepNumber = history.length - 1;

    this.setState({
      history,
      stepNumber,
      xIsNext: (stepNumber % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, idx) => {
      const coords = getSquareCoordinates(step.changedSquare);
      const label = idx ? `Go to move #${idx}: (${coords[0]}, ${coords[1]})` : 'Go to game start';
      return (
        <li key={idx}>
          <button onClick={() => this.jumpTo(idx)}>{label}</button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = `Winner: ${winner}`;
    } else if (winner === false) {
      status = `Tie!`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * Returns the winner of the game, `false` if game ended in a tie, or `null`
 * if game isn't over yet.
 *
 * @param {Array} squares - Board squares.
 * @returns {string|boolean|null} - Winner of the game ("X" or "O"), `false`
 * if game is a tie, or `null` if game isn't over yet.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // See if there are any winning lines on the board.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // If we got here, it means we saw no winning lines. See if there's a tie.
  for (let i = 0; i < squares.length; i++) {
    // If we find an empty square, exit early; the game isn't over yet!
    if (!squares[i]) return null;
  }

  // If we got here, it means we found no winning lines and no empty squares.
  // It's a tie!
  return false;
}

/**
 * Returns the x- and y-coordinates of the specified Board square.
 *
 * Board squares are indexed like so, with the 0th indexed square at the
 * top-left being the origin (0, 0):
 *
 *  0 1 2
 *  3 4 5
 *  6 7 8
 *
 * @param {number} i - Board square index.
 * @returns {Array} - Coordinates of the Board square, as an array of two
 * numbers `[x, y]`.
 */
function getSquareCoordinates(i) {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return [row, col];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
