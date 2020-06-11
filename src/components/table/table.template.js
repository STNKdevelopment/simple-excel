const CODES = {
  A: 65,
  Z: 90
};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px';
}

function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + 'px';
}

function toCell(state, row) {
  return function(_, column) {
    const id = `${row}:${column}`;
    const width = getWidth(state.columnState, column);
    const data = state.dataState[id];
    return `
      <div
        class="cell"
        contenteditable
        data-type="cell"
        data-column="${column}"
        data-id="${id}"
        style="width: ${width}"
       >${data || ''}</div>`;
  };
}

function toColumn({col, index, width}) {
  return `
    <div
      class="column"
      data-type="resizable"
      data-column="${index}"
      style="width: ${width}"
    >
      ${col}
      <div class="column-resize" data-resize="column"></div>
    </div>
  `;
}

function createRow(index, content, state) {
  const resize = index ?
      `<div class="row-resize" data-resize="row"></div>` :
      '';
  const height = getHeight(state, index);
  return `
    <div
      class="row"
      data-type="resizable"
      data-row="${index}"
      style="height: ${height}"
    >
      <div class="row-info none-user-selected">
        ${index ? index : ''}
        ${resize}
      </div>
      <div class="row-data ${index ? '' : 'none-user-selected'}">
        ${content}
      </div>
    </div>
  `.trim();
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}

function withWidthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidth(state.columnState, index)
    };
  };
}

export function createTable(rowsCount = 100, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(withWidthFrom(state))
      .map(toColumn)
      .join('');

  // Шапка
  rows.push(createRow(null, cols, {}));

  // Основные ячейки
  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(state, row))
        .join('');
    rows.push(createRow(row + 1, cells, state.rowState));
  }

  return rows.join('');
}
