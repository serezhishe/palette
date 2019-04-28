let canvas = document.getElementsByTagName('canvas')[0]
let cnv = canvas.getContext('2d')
canvas.height = document.getElementsByTagName('main')[0].offsetHeight
canvas.width = document.getElementsByTagName('main')[0].offsetWidth
let height = Math.round(canvas.height*0.8 / 3)
let width = height

let figures = []
class Figure {
  constructor(x, y, color, form) {
    this.x = x,
    this.y = y,
    this.centerX = x + width / 2,
    this.centerY = y + height / 2,
    this.color = color,
    this.form = form
  }
}
let x = canvas.width - 3 * (width + 10) - 50
let y = canvas.height / 10
for (let i = 0; i < 9; i++) {
  figures.push(new Figure(x, y, 'CCCCCC', 'rectangle'))
  x += width + 10
  if (i % 3 == 2) {
    x = canvas.width - 3 * (width + 10) - 50
    y += height + 10
  }
}
figures[6].form = 'circle'
figures.forEach(el => {
  cnv.fillStyle = '#' + el.color
  if (el.form === 'rectangle') cnv.fillRect(el.x, el.y, width, height)
  if (el.form === 'circle') {
    cnv.beginPath()
    cnv.arc(el.centerX, el.centerY, width / 2, 0, Math.PI*2,true)
    cnv.fill()
  }
})