
var canvas = document.querySelector('#canvas') || {getContext: function () { return null }}
var ctx = canvas.getContext('2d')
var date = new Date()
var difference = 0
var fps = 20
var jumping = false
var maxJumpHeight = 250
var actualPos = 0
var cactusSpeed = 5
var podePula = true
var relativePos = 0
var gameOver = false
var HighScore = localStorage.getItem('HighScore')
var jumpSpeed = 50
var firstCactus
var secondCactus
var floor

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace(loop) }
})

function onSpace (fn) {
  if (podePula && !gameOver) jumping = true
  if (gameOver) {
    jumping = false
    actualPos = 0
    gameOver = false

    if (localStorage.getItem('HighScore') < difference) { localStorage.setItem('HighScore', difference) }

    HighScore = localStorage.getItem('HighScore')
    date = new Date()
    fn()
  }

  podePula = false
}

function random (seed) {
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function draw (ctx, personagem, firstCactus, secondCactus, seed) {
  seed = seed || Math.floor(Math.random() * 100)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  floor = canvas.height / 2 + 20

  ctx.fillStyle = 'Grey'
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)
  ctx.stroke()

  ctx.lineWidth = 5
  ctx.strokeStyle = 'yellow'
  ctx.moveTo(30, canvas.height / 2 + 70)
  ctx.lineTo(canvas.width - 30, canvas.height / 2 + 70)
  ctx.stroke()
  if (firstCactus.getPos() <= 0) { firstCactus.updatePos(Math.floor(random(seed) * (canvas.width - secondCactus.getPos() + 200) + secondCactus.getPos() + 200)) }

  firstCactus.update(ctx)

  if (secondCactus.getPos() <= 0) { secondCactus.updatePos(Math.floor(random(seed) * (canvas.width - firstCactus.getPos() + 200) + firstCactus.getPos() + 200)) }

  secondCactus.update(ctx)

  ctx.lineWidth = 1
  ctx.fillStyle = 'black'
  ctx.font = '30px Arial'
  ctx.fillText('Time: ' + difference, canvas.width / 2 - 200, 100)

  ctx.fillText('HighScore: ' + HighScore, canvas.width / 2, 100)

  personagem(floor, ctx)
}

function CactusGenerator () {
  this.pos = 0
  this.updatePos = function (val) {
    this.pos = val
  }
  this.getPos = function () {
    return this.pos
  }
  this.update = function (ctx) {
    this.floor = canvas.height / 2
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3

    if (this.pos <= 0) { this.pos = Math.floor(Math.random() * (800 - 400 + 1) + 400) }

    ctx.strokeRect(this.pos -= cactusSpeed, this.floor, 30, 70)

    if (checkForCollision(this.pos, actualPos, this.floor)) {
      gameOver = true
    }
  }
}

function checkForCollision (objectPosW, pos, floor) {
  if (pos + 50 > floor - 20) {
    if ((objectPosW + 32 >= 50 - 2 && objectPosW + 2 <= 50 + 48) ||
    objectPosW + 2 >= 50 + 48 && objectPosW + 32 <= 50 - 2) { return true }
  }

  return false
}

function personagem (floor, context) {
  context.strokeStyle = 'red'
  context.lineWidth = 5
  let initialJumpSpeed = jumpSpeed
  if (actualPos == 0) { actualPos = floor }
  relativePos = (floor - actualPos)

  if (jumping && relativePos <= maxJumpHeight) { context.strokeRect(50, actualPos -= jumpSpeed > 0 ? jumpSpeed -= 35 : 1, 50, 50) } else if (floor > actualPos && !jumping) { context.strokeRect(50, actualPos += jumpSpeed > 0 ? jumpSpeed -= 35 : 1, 50, 50) } else if (!jumping) {
    context.strokeRect(50, floor, 50, 50)
    actualPos = floor

    podePula = true
    relativePos = (floor - actualPos)
  }
  if (relativePos >= maxJumpHeight) { jumping = false }
  jumpSpeed = initialJumpSpeed
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop () {
  firstCactus = new CactusGenerator()
  secondCactus = new CactusGenerator()
  while (!gameOver) {
    var current = new Date()
    difference = Math.floor((current - date) / 1000)

    draw(ctx, personagem, firstCactus, secondCactus)

    await sleep(fps)
  }
}

loop()
