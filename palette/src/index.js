const canvas = document.getElementsByTagName('canvas')[0];
const cnv = canvas.getContext('2d');
canvas.height = document.getElementsByTagName('main')[0].offsetHeight;
canvas.width = document.getElementsByTagName('main')[0].offsetWidth;
const height = Math.round(canvas.height * 0.8 / 3);
const width = height;

let figures = [];
const current = document.getElementById('curr');
const previous = document.getElementById('prev');
let currentColor = window.getComputedStyle(current, null).getPropertyValue('background-color');
let previousColor = window.getComputedStyle(previous, null).getPropertyValue('background-color');
const storage = window.localStorage;

if (storage.getItem('figures') && storage.getItem('figures').length) {
  previousColor = storage.getItem('previous');
  previousColor = previousColor.split('').splice(1, previousColor.length - 2).join('');
  currentColor = storage.getItem('current');
  currentColor = currentColor.split('').splice(1, currentColor.length - 2).join('');
  figures = JSON.parse(storage.getItem('figures'));
  current.style.backgroundColor = currentColor;
  previous.style.backgroundColor = previousColor;
}
const activeTool = {
  paintBucket: false,
  colorPicker: false,
  move: false,
  transform: false,
};

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
if (!figures.length) {
  for (let i = 0; i < 9; i += 1) {
    figures.push(new Figure(x, y, 'rgb(196, 196, 196)', 'rectangle'));
    x += width + 10;
    if (i % 3 === 2) {
      x = canvas.width - 3 * (width + 10) - 50;
      y += height + 10;
    }
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

const redColor = document.getElementById('red');
const blueColor = document.getElementById('blue');
const personal = document.getElementById('personal');
const input = document.getElementsByTagName('input')[0];
let personalColor = input.value;

const paintBucket = document.getElementById('paintBucket');
const colorPicker = document.getElementById('colorPicker');
const move = document.getElementById('move');
const transform = document.getElementById('transform');
paintBucket.addEventListener('click', () => {
  paintBucket.style.background = '#8f8f8f';
  colorPicker.style.background = 'white';
  move.style.background = 'white';
  transform.style.background = 'white';
  activeTool.paintBucket = true;
  activeTool.colorPicker = false;
  activeTool.move = false;
  activeTool.transform = false;
});

colorPicker.addEventListener('click', () => {
  paintBucket.style.background = 'white';
  colorPicker.style.background = '#8f8f8f';
  move.style.background = 'white';
  transform.style.background = 'white';
  activeTool.paintBucket = false;
  activeTool.colorPicker = true;
  activeTool.move = false;
  activeTool.transform = false;
});

move.addEventListener('click', () => {
  paintBucket.style.background = 'white';
  colorPicker.style.background = 'white';
  move.style.background = '#8f8f8f';
  transform.style.background = 'white';
  activeTool.paintBucket = false;
  activeTool.colorPicker = false;
  activeTool.move = true;
  activeTool.transform = false;
});

transform.addEventListener('click', () => {
  paintBucket.style.background = 'white';
  colorPicker.style.background = 'white';
  move.style.background = 'white';
  transform.style.background = '#8f8f8f';
  activeTool.paintBucket = false;
  activeTool.colorPicker = false;
  activeTool.move = false;
  activeTool.transform = true;
});

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('contextmenu', () => {
  paintBucket.style.background = 'white';
  colorPicker.style.background = 'white';
  move.style.background = 'white';
  transform.style.background = 'white';
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
      cnv.clearRect(figures[i].x - 1, figures[i].y - 1, width + 2, height + 2);
      cnv.fillStyle = figures[i].color;
      cnv.fillRect(figures[i].x - 1, figures[i].y - 1, width + 2, height + 2);
      return;
    }

    if (figures[i].shape === 'circle' && liesIn(event, figures[i])) {
      figures[i].color = currentColor;
      cnv.fillStyle = figures[i].color;
      cnv.beginPath();
      cnv.arc(figures[i].centerX, figures[i].centerY, width / 2 + 1, 0, Math.PI * 2, true);
      cnv.fill();
      return;
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
      cnv.clearRect(figures[i].x - 1, figures[i].y - 1, width + 2, height + 2);
    } else if (figures[i].shape === 'circle' && liesIn(event, figures[i])) {
      figures[i].shape = 'rectangle';
      cnv.clearRect(figures[i].x - 1, figures[i].y - 1, width + 2, height + 2);
    }

    figures.forEach((el) => {
      cnv.fillStyle = el.color;
      if (el.shape === 'rectangle') cnv.fillRect(el.x, el.y, width, height);
      if (el.shape === 'circle') {
        cnv.beginPath();
        cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI * 2, true);
        cnv.fill();
      }
    });
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

let j;

function movement(k) {
  canvas.onmousemove = (e) => {
    cnv.clearRect(figures[k].x - 1, figures[k].y - 1, width + 2, height + 2);
    figures[k].x += e.movementX;
    figures[k].y += e.movementY;
    figures[k].centerX += e.movementX;
    figures[k].centerY += e.movementY;


    figures.forEach((el) => {
      cnv.fillStyle = el.color;
      if (el.shape === 'rectangle') cnv.fillRect(el.x, el.y, width, height);
      if (el.shape === 'circle') {
        cnv.beginPath();
        cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI * 2, true);
        cnv.fill();
      }
    });
  };
}

canvas.addEventListener('click', (e) => {
  if (activeTool.paintBucket) changeColor(e);
  if (activeTool.transform) transformation(e);
  if (activeTool.colorPicker) chooseColor(e);
});

const posBefore = {};
canvas.addEventListener('mousedown', (e) => {
  if (activeTool.move) {
    for (let i = 8; i >= 0; i -= 1) {
      if (liesIn(e, figures[i])) {
        j = i;
        posBefore.x = figures[j].x;
        posBefore.y = figures[j].y;
        posBefore.centerX = figures[j].centerX;
        posBefore.centerY = figures[j].centerY;

        movement(i);
        return;
      }
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (activeTool.move) {
    const tmp = figures.find((elem, index) => liesIn(e, elem) && index !== j);
    if (tmp) {
      figures[j].x = tmp.x;
      figures[j].y = tmp.y;
      figures[j].centerX = tmp.centerX;
      figures[j].centerY = tmp.centerY;
      tmp.x = posBefore.x;
      tmp.y = posBefore.y;
      tmp.centerX = posBefore.centerX;
      tmp.centerY = posBefore.centerY;
    }

    cnv.clearRect(0, 0, canvas.width, canvas.height);
    figures.forEach((el) => {
      cnv.fillStyle = el.color;
      if (el.shape === 'rectangle') cnv.fillRect(el.x, el.y, width, height);
      if (el.shape === 'circle') {
        cnv.beginPath();
        cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI * 2, true);
        cnv.fill();
      }
    });
    canvas.onmousemove = null;
  }
});

document.addEventListener('keypress', (e) => {
  if (e.code === 'KeyP') {
    activeTool.paintBucket = true;
    activeTool.colorPicker = false;
    activeTool.move = false;
    activeTool.transform = false;
  }

  if (e.code === 'KeyC') {
    activeTool.paintBucket = false;
    activeTool.colorPicker = true;
    activeTool.move = false;
    activeTool.transform = false;
  }

  if (e.code === 'KeyM') {
    activeTool.paintBucket = false;
    activeTool.colorPicker = false;
    activeTool.move = true;
    activeTool.transform = false;
  }

  if (e.code === 'KeyT') {
    activeTool.paintBucket = false;
    activeTool.colorPicker = false;
    activeTool.move = false;
    activeTool.transform = true;
  }
});

window.onbeforeunload = () => {
  storage.setItem('figures', JSON.stringify(figures));
  storage.setItem('current', JSON.stringify(currentColor));
  storage.setItem('previous', JSON.stringify(previousColor));
  return 0;
};
