Manager = function () {
  let canvas = document.querySelector('#canvas') || { getContext: function () { return null } }
  let canvasContext = canvas.getContext('2d')
  let initialGameTime = new Date()
  let timeInSecondsSinceStart = 0
  let sleepTime = 20
  let gameOver = false
  let highScore = localStorage.getItem('HighScore')
  let firstCactus
  let secondCactus
  let floor = canvas.height / 2

  return {
    canvas,
    canvasContext,
    initialGameTime,
    timeInSecondsSinceStart,
    sleepTime,
    gameOver,
    highScore,
    firstCactus,
    secondCactus,
    floor,
  }
}();

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace(loop) }
})

function onSpace(fn) {
  if (Manager.player.canJump && !Manager.gameOver)
    Manager.player.jumping = true
  if (Manager.gameOver) {
    Manager.player.jumping = false
    Manager.player.personagemAltitude = 0
    Manager.gameOver = false

    if (localStorage.getItem('HighScore') < Manager.timeInSecondsSinceStart) { localStorage.setItem('HighScore', Manager.timeInSecondsSinceStart) }

    Manager.highScore = localStorage.getItem('HighScore')
    Manager.initialGameTime = new Date()
    fn()
  }

  Manager.player.canJump = false
}

function draw(ctx) {
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
  if (Manager.firstCactus.getPos() <= 0) {
    Manager.firstCactus.updatePos(Manager.firstCactus.getRandomSpawn())
  }

  Manager.firstCactus.update(ctx)

  if (Manager.secondCactus.getPos() <= 0) {
    Manager.secondCactus.updatePos(Manager.secondCactus.getRandomSpawn())
  }

  Manager.secondCactus.update(ctx)

  ctx.lineWidth = 1
  ctx.fillStyle = 'black'
  ctx.font = '30px Arial'
  ctx.fillText('Time: ' + Manager.timeInSecondsSinceStart, Manager.canvas.width / 2 - 200, 100)

  ctx.fillText('HighScore: ' + Manager.highScore, Manager.canvas.width / 2, 100)

  Manager.player.update()
}

function CactusGenerator() {
  let pos = 0
  function updatePos(val) {
    this.pos = val
  }
  function getPos() {
    return this.pos
  }

  function getRandomSpawn(seed) {
    let width = Manager.canvas.width || 200
    return Math.floor(Math.random() * (width - 200) + 200)
  }

  function update(ctx) {
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3

    this.pos = this.pos || getRandomSpawn(new Date())
    ctx.strokeRect(this.pos -= Manager.player.playerSpeed, Manager.floor, 30, 70)

    if (checkForCollision(this.pos, Manager.player.personagemAltitude, Manager.floor)) {
      Manager.gameOver = true
    }
  }
  return {
    getPos,
    updatePos,
    update,
    getRandomSpawn
  }
}

function checkForCollision(objectPosW, pos, floor) {
  if (pos + 50 > floor - 20) {
    if ((objectPosW + 32 >= 50 - 2 && objectPosW + 2 <= 50 + 48) ||
      objectPosW + 2 >= 50 + 48 && objectPosW + 32 <= 50 - 2) { return true }
  }

  return false
}

function Player() {
  let jumping = false
  let playerSpeed = 5
  let maxJumpHeight = 250
  let canJump = true
  let personagemAltitude = Manager.floor
  let jumpSpeed = 50
  let relativePos = (Manager.floor - this.personagemAltitude)
  let playerFloor;
  function update() {
    Manager.canvasContext.strokeStyle = 'red'
    Manager.canvasContext.lineWidth = 5

    this.personagemAltitude = this.personagemAltitude || Manager.floor

    this.relativePos = (Manager.floor - this.personagemAltitude)

    if (this.jumping && this.relativePos <= this.maxJumpHeight) {
      Manager.canvasContext.strokeRect(50, this.personagemAltitude -= this.jumpSpeed > 0 ? this.jumpSpeed -= 35 : 1, 50, 50)
    } else if (Manager.floor > this.personagemAltitude && !this.jumping) {
      Manager.canvasContext.strokeRect(50, this.personagemAltitude += this.jumpSpeed > 0 ? this.jumpSpeed -= 35 : 1, 50, 50)
    } else if (!this.jumping) {
      Manager.canvasContext.strokeRect(50, Manager.floor + 20, 50, 50)
      this.personagemAltitude = Manager.floor

      this.canJump = true
      this.relativePos = (Manager.floor - this.personagemAltitude)
    }
    if (this.relativePos >= this.maxJumpHeight) { this.jumping = false }
    this.jumpSpeed = 50

  }
  return {
    jumping,
    playerSpeed,
    maxJumpHeight,
    personagemAltitude,
    canJump,
    jumpSpeed,
    relativePos,
    update
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop() {
  Manager.firstCactus = new CactusGenerator()
  Manager.secondCactus = new CactusGenerator()
  Manager.player = new Player()
  while (!Manager.gameOver) {
    var current = new Date()
    Manager.floor = canvas.height / 2
    Manager.timeInSecondsSinceStart = Math.floor((current - Manager.initialGameTime) / 1000)

    draw(Manager.canvasContext)

    await sleep(Manager.sleepTime)
  }
}

loop()
