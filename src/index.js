module.exports = function solveSudoku(matrix) {
  let unsolvedArray = setUnsolved(matrix);
  solve.currUnsolvedIndex = 0;
  solve(matrix, unsolvedArray);
  return matrix;
};

function setUnsolved(matrix) {
  let unsolvedArr = [];
  for (let currRow = 0; currRow < 9; currRow++) {
      for (let currCol = 0; currCol < 9; currCol++) {
          if (matrix[currRow][currCol] == 0) {
              unsolvedArr.push(new Unsolved(currRow, currCol));
          }
      }
  }
  return unsolvedArr;
}

class Unsolved {
  constructor(row, column) {
      this.row = row;
      this.col = column;
  }

  eraseCandidate(candidate) {
      if (candidate == 0)
          return false;
      if (this.candidates[candidate - 1] != -1) {
          this.candidates[candidate - 1] = -1;
          return true;
      }
      return false;
  }

  createCandidates() {
      this.candidates = [];
      for (let i = 1; i < 10; i++) {
          this.candidates.push(i);
      }
  }
}

function solve(matrix, unsolvedArr) {
  if (solve.currUnsolvedIndex == unsolvedArr.length) 
      return true;
  let currElem = unsolvedArr[solve.currUnsolvedIndex];
  setCandidates(currElem, matrix);
  for (let i = 0; i < 9; i++) {
      let currCandidate = currElem.candidates[i];
      if (currCandidate == -1) 
          continue;
      matrix[currElem.row][currElem.col] = currCandidate;
      solve.currUnsolvedIndex++;
      if (solve(matrix, unsolvedArr))
          return true;
      matrix[currElem.row][currElem.col] = 0;
  }
  solve.currUnsolvedIndex--;
  return false;
}

function setCandidates(currElem, matrix) {
  currElem.createCandidates();
  searchInBlock(currElem, matrix);
  searchInRow(currElem, matrix);
  searchInCol(currElem, matrix);
}

function searchInBlock(unsolved, matrix) {
  let colBound = Math.floor(unsolved.col / 3) * 3,
      rowBound = Math.floor(unsolved.row / 3) * 3;
  for (let i = rowBound; i <= rowBound + 2; i++) {
      for (let j = colBound; j <= colBound + 2; j++) {
          deleteCandidate(unsolved, i, j, matrix);
      }
  }
}

function searchInRow(unsolved, matrix) {
  let currRow = unsolved.row;
  for (let i = 0; i < 9; i++) {
      deleteCandidate(unsolved, currRow, i, matrix);
  }
}

function searchInCol(unsolved, matrix) {
  let currCol = unsolved.col;
  for (let i = 0; i < 9; i++) {
      deleteCandidate(unsolved, i, currCol, matrix);
  }
}

function deleteCandidate(currElem, currRow, currCol, matrix) {
  let num = matrix[currRow][currCol];
  if (num == 0)
      return;
  if (currElem.candidates[num - 1] != -1) {
      currElem.eraseCandidate(num);
  }
}