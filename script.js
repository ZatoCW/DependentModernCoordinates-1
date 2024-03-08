function displayBoard() {
  const board = document.querySelector('.board');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      board.appendChild(cell);
    }
  }
}

function displayShips() {
  const shipsContainer = document.querySelector('.ships-container')
  const ships = [
    {
      name: 'carrier',
      length: 5,
    },
    {
      name: 'battleship',
      length: 4,
    },
    {
      name: 'destroyer',
      length: 3,
    },
    {
      name: 'submarine',
      length: 2,
    },
    {
      name: 'patrol',
      length: 2,
    },
  ]

  ships.forEach(ship => {
    const newShip = document.createElement('div');
    newShip.classList.add('ship');
    newShip.setAttribute('id', ship.name);
    newShip.dataset.length = ship.length;
    newShip.dataset.direction = "row";
    for (let i = 0; i < ship.length; i++) {
      const part = document.createElement('div');
      part.classList.add('ship-part');
      newShip.append(part);
    }
    newShip.draggable = "true";
    shipsContainer.append(newShip);
  })
}

displayBoard()
displayShips()
shipListeners()

function shipListeners() {
  const allShips = document.querySelectorAll('.ship');
  allShips.forEach(ship => {
    ship.addEventListener('dragstart', dragStart)
    ship.addEventListener('dragend', dragEnd)
  })

  const allCells = document.querySelectorAll('.cell');
  allCells.forEach(cell => {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('dragenter', dragEnter);
    cell.addEventListener('dragleave', dragLeave);
    cell.addEventListener('drop', dragDrop);
  })
}

function dragStart(event) {
  event.dataTransfer.setData('text', event.target.closest('.ship').id);

  event.target.classList.toggle('ship-dragged');
}

function dragEnd(event) {
  event.preventDefault()

  event.target.classList.toggle('ship-dragged');
  event.target.style.position = "absolute"
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
  const cell = event.target;

  cell.classList.add('hovered');
}

function dragLeave(event) {
  const cell = event.target;
  cell.classList.remove('hovered');
}

function dragDrop(event) {
  const cell = event.target;
  cell.classList.remove('hovered');
  const coordinates = [parseInt(cell.dataset.row), parseInt(cell.dataset.col)];

  const data = event.dataTransfer.getData('text');
  const draggedShip = document.getElementById(data);

  try {
    cell.append(draggedShip);
    placeWater(draggedShip, coordinates)
  } catch {
    return;
  }
}

function shipTiles(ship, coordinates) {
  const length = parseInt(ship.dataset.length);
  const direction = ship.dataset.direction;
  const cells = [];
  const [row, col] = coordinates

  if (direction === "row") {
    for (let i = col; i < col + length; i++) cells.push([row, i]);
  } else if (direction === "col") {
    for (let i = row; i < row + length; i++) cells.push([i, col]);
  }
  
  return cells;
}

function placeWater(ship, coordinates) {
  const shipCells = shipTiles(ship, coordinates)
  const adjacentCells = []

  shipCells.forEach(cell => {
    const [row, col] = cell;
    console.log(row, col)
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; k <= col + 1; j++) {
        if ((i !== row || j !== col) && (i >= 0 && j >= 0 && i < 10 && j < 10)) adjacentCells.push([i, j]);
      }
    }
  })

  console.log(adjacentCells);
}

function rotateShips(event) {
  const ship = event.target.closest('.ship')
  if (ship.dataset.direction === "row") {
    ship.dataset.direction = "col";
    ship.style.display = "flex";
  } else {
    ship.dataset.direction = "col";
    ship.style.display = "block";
  }
}