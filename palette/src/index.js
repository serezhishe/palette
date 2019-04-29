const canvas = document.getElementsByTagName('canvas')[0];
const cnv = canvas.getContext('2d');
canvas.height = document.getElementsByTagName('main')[0].offsetHeight;
canvas.width = document.getElementsByTagName('main')[0].offsetWidth;
const height = Math.round(canvas.height * 0.8 / 3);
const width = height;

const activeTool = {
  paintBucket: false,
  colorPicker: false,
  move: false,
  transform: false,
};

const figures = [];
class Figure {
  constructor(x, y, color, shape) {
    this.x = x;
    this.y = y;
    this.centerX = x + width / 2;
    this.centerY = y + height / 2;
    this.color = color;
    this.shape = shape;
  }
}

let x = canvas.width - 3 * (width + 10) - 50;
let y = canvas.height / 10;
for (let i = 0; i < 9; i += 1) {
  figures.push(new Figure(x, y, 'rgb(196, 196, 196)', 'rectangle'));
  x += width + 10;
  if (i % 3 === 2) {
    x = canvas.width - 3 * (width + 10) - 50;
    y += height + 10;
  }
}
figures[6].shape = 'circle';
figures.forEach((el) => {
  cnv.fillStyle = el.color;
  if (el.shape === 'rectangle') cnv.fillRect(el.x, el.y, width, height);
  if (el.shape === 'circle') {
    cnv.beginPath();
    cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI * 2, true);
    cnv.fill();
  }
});

const current = document.getElementById('curr');
const previous = document.getElementById('prev');
const redColor = document.getElementById('red');
const blueColor = document.getElementById('blue');
const personal = document.getElementById('personal');
const input = document.getElementsByTagName('input')[0];
let personalColor = input.value;
let currentColor = window.getComputedStyle(current, null).getPropertyValue('background-color');
let previousColor = window.getComputedStyle(previous, null).getPropertyValue('background-color');

const paintBucket = document.getElementById('paintBucket');
paintBucket.addEventListener('click', () => {
  activeTool.paintBucket = true;
  activeTool.colorPicker = false;
  activeTool.move = false;
  activeTool.transform = false;
});

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('click', () => {
  activeTool.paintBucket = false;
  activeTool.colorPicker = true;
  activeTool.move = false;
  activeTool.transform = false;
});

const move = document.getElementById('move');
move.addEventListener('click', () => {
  activeTool.paintBucket = false;
  activeTool.colorPicker = false;
  activeTool.move = true;
  activeTool.transform = false;
});

const transform = document.getElementById('transform');
transform.addEventListener('click', () => {
  activeTool.paintBucket = false;
  activeTool.colorPicker = false;
  activeTool.move = false;
  activeTool.transform = true;
});

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('contextmenu', () => {
  activeTool.paintBucket = false;
  activeTool.colorPicker = false;
  activeTool.move = false;
  activeTool.transform = false;
});


function liesIn(e, fig) {
  if (fig.shape === 'rectangle') {
    if (e.offsetX >= fig.x && e.offsetX <= fig.x + width) {
      if (e.offsetY >= fig.y && e.offsetY <= fig.y + height) return true;
    }
    return false;
  }
  if (((((e.offsetX - fig.centerX) ** 2) + ((e.offsetY - fig.centerY) ** 2)) ** 0.5) < width / 2) {
    return true;
  }
  return false;
}

function changeColor(event) {
  for (let i = 0; i < 9; i += 1) {
    if (figures[i].shape === 'rectangle' && liesIn(event, figures[i])) {
      figures[i].color = currentColor;
      cnv.clearRect(figures[i].x, figures[i].y, width, height);
      cnv.fillStyle = figures[i].color;
      cnv.fillRect(figures[i].x, figures[i].y, width, height);
    }

    if (figures[i].shape === 'circle' && liesIn(event, figures[i])) {
      figures[i].color = currentColor;
      cnv.fillStyle = figures[i].color;
      cnv.beginPath();
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2, 0, Math.PI * 2, true);
      cnv.fill();
    }
  }
}


document.getElementById('previous').addEventListener('click', () => {
  current.style.backgroundColor = previousColor;
  previous.style.backgroundColor = currentColor;
  const tmp = previousColor;
  previousColor = currentColor;
  currentColor = tmp;
});

document.getElementById('first').addEventListener('click', () => {
  if (currentColor !== window.getComputedStyle(redColor, null).getPropertyValue('background-color')) {
    previous.style.backgroundColor = currentColor;
    previousColor = currentColor;
    currentColor = window.getComputedStyle(redColor, null).getPropertyValue('background-color');
    current.style.backgroundColor = currentColor;
  }
});

document.getElementById('second').addEventListener('click', () => {
  if (currentColor !== window.getComputedStyle(blueColor, null).getPropertyValue('background-color')) {
    previous.style.backgroundColor = currentColor;
    previousColor = currentColor;
    currentColor = window.getComputedStyle(blueColor, null).getPropertyValue('background-color');
    current.style.backgroundColor = currentColor;
  }
});

document.getElementById('personal').addEventListener('click', () => {
  if (currentColor !== personalColor) {
    previous.style.backgroundColor = currentColor;
    previousColor = currentColor;
    currentColor = personalColor;
    current.style.backgroundColor = currentColor;
  }
});

personal.addEventListener('click', () => {
  input.addEventListener('change', (event) => {
    personalColor = event.target.value;
  });
  input.select();
});


function transformation(event) {
  for (let i = 0; i < 9; i += 1) {
    if (figures[i].shape === 'rectangle' && liesIn(event, figures[i])) {
      figures[i].shape = 'circle';
      cnv.clearRect(figures[i].x, figures[i].y, width, height);
      cnv.fillStyle = figures[i].color;
      cnv.beginPath();
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2, 0, Math.PI * 2, true);
      cnv.fill();
      return;
    }

    if (figures[i].shape === 'circle' && liesIn(event, figures[i])) {
      figures[i].shape = 'rectangle';
      cnv.beginPath();
      cnv.fillStyle = 'white';
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2, 0, Math.PI * 2, true);
      cnv.fill();
      cnv.fillStyle = figures[i].color;
      cnv.fillRect(figures[i].x, figures[i].y, width, height);
    }
  }
}

function chooseColor(e) {
  const piks = cnv.getImageData(e.offsetX, e.offsetY, 1, 1).data;
  const piksColor = `rgba(${piks[0]}, ${piks[1]}, ${piks[2]}, ${piks[3]})`;
  if (currentColor !== piksColor) {
    previous.style.backgroundColor = currentColor;
    previousColor = currentColor;
    currentColor = piksColor;
    current.style.backgroundColor = currentColor;
  }
}


function movement(e, figure) {
  canvas.onmousemove = (e) => {
    cnv.clearRect(figure.x - 2, figure.y - 2, width + 4, height + 4);
    figure.x += e.movementX;
    figure.y += e.movementY;
    figure.centerX += e.movementX;
    figure.centerY += e.movementY;

    figures.forEach((el) => {
      cnv.fillStyle = el.color;
      if (el.shape === 'rectangle') cnv.fillRect(el.x, el.y, width, height);
      if (el.shape === 'circle') {
        cnv.beginPath();
        debugger
        cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI * 2, true);
        cnv.fill();
      }
    });
  }
}

canvas.addEventListener('click', (e) => {
  if (activeTool.paintBucket) changeColor(e);
  if (activeTool.transform) transformation(e);
  if (activeTool.colorPicker) chooseColor(e);
});

canvas.addEventListener('mousedown', (e) => {
  if (activeTool.move) {
    for (let i = 8; i >= 0; i -= 1) {
      if (liesIn(e, figures[i])) {
        movement(e, figures[i]);
        return;
      }
    }
  }
});

canvas.addEventListener('mouseup', () => {
  if (activeTool.move) canvas.onmousemove = null;
})