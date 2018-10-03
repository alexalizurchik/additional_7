const getPrevElIndexes = (i, j, limit) => {
  j--;
 
  if (j < 0) {
    j = limit;
    i--;
 
    if (i < 0) {
      i = limit;
    }
  }
 
  return {
    i,
    j,
  }
};
 
const getNextElIndexes = (i, j, limit) => {
  j++;
 
  if (j > limit) {
    j = 0;
    i++;
 
    if (i > limit) {
      i = 0;
    }
  }
 
  return {
    i,
    j,
  }
};
 
const copyMatrix = matrix => {
  const copy = [];
 
  matrix.forEach((row, rowIndex) => {
    copy[rowIndex] = [];
 
    row.forEach(el => {
      copy[rowIndex].push(el);
    });
  });
 
  return copy;
};
 
const isInRow = (matrix, i, el) => {
  return matrix[i].indexOf(el) !== -1;
};
 
const isInColumn = (matrix, j, el) => {
  return matrix.some((row, rowIndex) => matrix[rowIndex][j] === el);
};
 
const isInBox = (matrix, ii, jj, el) => {
  const startI = ii - (ii % 3);
  const endI = startI + 3;
  const startJ = jj - (jj % 3);
  const endJ = startJ + 3;
 
  for (let i = startI; i < endI; i++) {
    for (let j = startJ; j < endJ; j++) {
      if (matrix[i][j] === el) {
        return true;
      }
    }
  }
 
  return false;
};
 
const solveSudoku = matrix => {
  const solved = copyMatrix(matrix);
  let checkNum = 1;
 
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      const el = matrix[i][j];
 
      if (el === 0) {
        for (let n = checkNum; n <= 9; n++) {
          if (!isInRow(solved, i, n) && !isInColumn(solved, j, n) && !isInBox(solved, i, j, n)) {
            solved[i][j] = n;
 
            break;
          }
        }
 
        // Не удалось подобрать цифру
        if (!solved[i][j]) {
          let prevI = i;
          let prevJ = j;
 
          // Идем назад пока не упремся в начало, либо пока не найдем ячейку с нулем
          do {
            const prevIndexes = getPrevElIndexes(prevI, prevJ, matrix.length - 1);
 
            prevI = prevIndexes.i;
            prevJ = prevIndexes.j;
 
            // Дошли до самого начала
            if (prevI === 0 && prevJ === 0) {
              break;
            }
          } while (matrix[prevI][prevJ] !== 0);
 
          // Если предыдущий элемент не неизвестное число (судя по всему мы уперлись в начало, где первое число известно),
          // то невозможно найти решение
          if (matrix[prevI][prevJ] !== 0) {
            throw new Error('Решений нет');
          }
 
          const invalidEl = solved[prevI][prevJ];
 
          // Если предыдущее число было последним возможным вариантом, то решений больше нет
          // if (invalidEl === 9) {
          //   throw new Error('Решений нет');
          // }
 
          // Удаляем предыдущее найденное значение, которое как оказалось дало невалидную цепочку
          delete solved[prevI][prevJ];
 
          checkNum = invalidEl + 1;
 
          i = prevI;
          j = prevJ - 1;
 
          continue;
        }
      }
 
      checkNum = 1;
    }
  }
 
  return solved;
};

module.exports = solveSudoku;
