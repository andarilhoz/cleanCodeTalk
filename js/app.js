Manager = function(){
  let canvas = document.querySelector('#canvas') || {getContext: function () { return null }}
  let canvasContext = canvas.getContext('2d')
  let initialGameTime = new Date()
  let timeInSecondsSinceStart = 0
  let sleepTime = 20
  let jumping = false
  let maxJumpHeight = 250
  let personagemAltitude = 0
  let playerSpeed = 5
  let canJump = true
  let gameOver = false
  let highScore = localStorage.getItem('HighScore')
  let jumpSpeed = 50
  let firstCactus
  let secondCactus
  let floor

  return {
    canvas,
    canvasContext,
    initialGameTime,
    timeInSecondsSinceStart,
    sleepTime,
    jumping,
    maxJumpHeight,
    personagemAltitude,
    playerSpeed,
    canJump,
    gameOver,
    highScore,
    jumpSpeed,
    firstCactus,
    secondCactus,
    floor,
  }
}();

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace(loop) }
})

function onSpace (fn) {
  if (Manager.canJump && !Manager.gameOver) Manager.jumping = true
  if (Manager.gameOver) {
    Manager.jumping = false
    Manager.personagemAltitude = 0
    Manager.gameOver = false

    if (localStorage.getItem('HighScore') < Manager.timeInSecondsSinceStart) { localStorage.setItem('HighScore', Manager.timeInSecondsSinceStart) }

    Manager.highScore = localStorage.getItem('HighScore')
    Manager.initialGameTime = new Date()
    fn()
  }

  Manager.canJump = false
}

function random (seed) {
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function draw (ctx, personagem, firstCactus, secondCactus, seed) {
  seed = seed || Math.floor(Math.random() * 100)
  Manager.canvas.width = window.innerWidth
  Manager.canvas.height = window.innerHeight

  floor = Manager.canvas.height / 2 + 20

  ctx.fillStyle = 'Grey'
  ctx.fillRect(10, 10, Manager.canvas.width - 20, Manager.canvas.height - 20)
  ctx.stroke()

  ctx.lineWidth = 5
  ctx.strokeStyle = 'yellow'
  ctx.moveTo(30, Manager.canvas.height / 2 + 70)
  ctx.lineTo(Manager.canvas.width - 30, Manager.canvas.height / 2 + 70)
  ctx.stroke()
  if (firstCactus.getPos() <= 0) { firstCactus.updatePos(Math.floor(random(seed) * (Manager.canvas.width - secondCactus.getPos() + 200) + secondCactus.getPos() + 200)) }

  firstCactus.update(ctx)

  if (secondCactus.getPos() <= 0) { secondCactus.updatePos(Math.floor(random(seed) * (Manager.canvas.width - firstCactus.getPos() + 200) + firstCactus.getPos() + 200)) }

  secondCactus.update(ctx)

  ctx.lineWidth = 1
  ctx.fillStyle = 'black'
  ctx.font = '30px Arial'
  ctx.fillText('Time: ' + Manager.timeInSecondsSinceStart, Manager.canvas.width / 2 - 200, 100)

  ctx.fillText('HighScore: ' + Manager.highScore, Manager.canvas.width / 2, 100)

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
    this.floor = Manager.canvas.height / 2
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3

    if (this.pos <= 0) { this.pos = Math.floor(Math.random() * (800 - 400 + 1) + 400) }

    ctx.strokeRect(this.pos -= Manager.playerSpeed, this.floor, 30, 70)

    if (checkForCollision(this.pos, Manager.personagemAltitude, this.floor)) {
      Manager.gameOver = true
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
  let initialJumpSpeed = Manager.jumpSpeed
  if (Manager.personagemAltitude == 0) { Manager.personagemAltitude = floor }
  let relativePos = (floor - Manager.personagemAltitude)

  if (Manager.jumping && relativePos <= Manager.maxJumpHeight) { context.strokeRect(50, Manager.personagemAltitude -= Manager.jumpSpeed > 0 ? Manager.jumpSpeed -= 35 : 1, 50, 50) } else if (floor > Manager.personagemAltitude && !Manager.jumping) { context.strokeRect(50, Manager.personagemAltitude += Manager.jumpSpeed > 0 ? Manager.jumpSpeed -= 35 : 1, 50, 50) } else if (!Manager.jumping) {
    context.strokeRect(50, floor, 50, 50)
    Manager.personagemAltitude = floor

    Manager.canJump = true
    relativePos = (floor - Manager.personagemAltitude)
  }
  if (relativePos >= Manager.maxJumpHeight) { Manager.jumping = false }
  Manager.jumpSpeed = initialJumpSpeed
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop () {
  firstCactus = new CactusGenerator()
  secondCactus = new CactusGenerator()
  while (!Manager.gameOver) {
    var current = new Date()
    Manager.timeInSecondsSinceStart = Math.floor((current - Manager.initialGameTime) / 1000)

    draw(Manager.canvasContext, personagem, firstCactus, secondCactus)

    await sleep(sleepTime)
  }
}

loop()
