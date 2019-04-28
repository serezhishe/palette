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
  figures.push(new Figure(x, y, '#C4C4C4', 'rectangle'));
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


function liesIn(event, fig) {
  if (fig.shape === 'rectangle') {
    if (event.offsetX >= fig.x && event.offsetX <= fig.x + width) {
      if (event.offsetY >= fig.y && event.offsetY <= fig.y + height) return true;
    }
    return false;
  }
  if (((((event.offsetX - fig.centerX) ** 2) + ((event.offsetY - fig.centerY) ** 2)) ** 0.5) < width) return true;
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
      cnv.beginPath();
      cnv.fillStyle = 'white';
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2, 0, Math.PI * 2, true);
      cnv.fill();
      cnv.fillStyle = figures[i].color;
      cnv.beginPath();
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2, 0, Math.PI * 2, true);
      cnv.fill();
    }
  }
}

canvas.addEventListener('click', (e) => {
  if (activeTool.paintBucket) changeColor(e);
});


document.getElementById('previous').addEventListener('click', () => {
  current.style.backgroundColor = previousColor;
  previous.style.backgroundColor = currentColor;
  const tmp = previousColor;
  previousColor = currentColor;
  currentColor = tmp;
});
